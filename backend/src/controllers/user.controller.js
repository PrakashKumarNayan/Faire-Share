import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from '../models/user.model.js'
import nodemailer from 'nodemailer';

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log("Fetched user:",user);

        const accessToken = user.generateAccessToken();
        // console.log("Access Token:",accessToken)

        const refreshToken = user.generateRefreshToken()
        // console.log("Refresh Token:",refreshToken)


        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiErrors(500, "Something went wrong while generating tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { email, fullName, password, reEnteredPassword, mobileNo } = req.body
    // console.log(email,fullName,password,reEnteredPassword,mobileNo);

    //check whether fields are non empty
    if (
        [email, fullName, password, mobileNo].some((field) => field?.trim() === "")
    ) {
        throw new ApiErrors(400, "All fields are required")
    }

    //check both passwords are same
    if (password !== reEnteredPassword) {
        throw new ApiErrors(400, "Both passwords should be same")
    }
    //check user exists or not
    const userExist = await User.findOne({
        $or: [{ mobileNo }, { email }]
    })

    if (userExist) {
        throw new ApiErrors(409, "User already exists")
    }

    //check for avatar and cover image

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    // console.log("Avatar file:",avatarLocalPath)

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    // console.log("Cover image:",coverImageLocalPath)
    if (!avatarLocalPath) {
        throw new ApiErrors(400, "Avatar not found");
    }

    //upload avatar and cover image on cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("Avatar uploaded on cloudinary:",avatar)
    // const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath): null;
    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }
    // console.log("Cover image in cloudinary:",coverImage)

    if (!avatar) {
        throw new ApiErrors(400, "Failed to upload avatar")
    }

    //create user in database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        mobileNo,
        password
    })

    //remove password and refresh token form user object

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check if user is created

    if (!createdUser) {
        throw new ApiErrors(500, "Failed to register user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );


})


//login function

const loginUser = asyncHandler(async (req, res) => {

    const { mobileNo, email, password } = req.body
    // console.log("Mobile or email:",mobileNo,email)

    if (!(mobileNo || email)) {
        throw new ApiErrors(400, "Mobile no or email required")
    }

    const user = await User.findOne({
        $or: [{ mobileNo }, { email }]
    })

    if (!user) {
        throw new ApiErrors(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)


    if (!isPasswordValid) {
        throw new ApiErrors(401, "Incorrect password")
    }

    // console.log("User id:",user._id);


    const { accessToken, refreshToken } = await generateTokens(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    //options for the deployment


    //const options = {
    //  httpOnly: true,
    //  secure: false,
    //  path: '/',
    //  sameSite: 'lax'
    // }

    //options for the developement

    const options = {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'lax'
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedUser, accessToken, refreshToken }, "User logged in successfully")
        )

})


//get logged in user

const getCurrentUser = asyncHandler(async (req, res) => {

    if (!req.user) {
        return res.status(200).json({
            success: false,
            message: "No user logged in"
        });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        )
})

const updateProfile = asyncHandler(async (req, res) => {
    const { email, mobileNo } = req.body;
    const currentUser = req.user;

    if (!currentUser) {
        throw new ApiErrors(401, "Unauthorized request")
    }

    if (
        [email, mobileNo].some((field) => !field || field.toString().trim() === "")
    ) {
        throw new ApiErrors(400, "Email and mobile number are required")
    }

    const existingUser = await User.findOne({
        _id: { $ne: currentUser._id },
        $or: [{ email }, { mobileNo }]
    })

    if (existingUser) {
        throw new ApiErrors(409, "Email or mobile number already exists")
    }

    const updateData = {
        email,
        mobileNo
    };

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            throw new ApiErrors(400, "Failed to upload avatar")
        }

        updateData.avatar = avatar.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
        currentUser._id,
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken")

    if (!updatedUser) {
        throw new ApiErrors(400, "Unable to update profile")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Profile updated successfully")
        )
})

//suggest existing users

const suggestUsers = asyncHandler(async (req, res) => {
    const { name } = req.body
    // console.log("Name:",name)
    if (name === '') {
        throw new ApiErrors(400, "Name is required")
    }

    const users = await User.find({
        fullName: {
            $regex: name,
            $options: 'i'
        }
    })

    if (!users) {
        throw new ApiErrors(400, "No users found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "Users with similar names")
        )


})

const sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiErrors(400, "Email id is required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiErrors(404, "No user found with this email address");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // app password: qhcr wjnv wmfj wtsl
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leotolstoy052@gmail.com',
            pass: 'qhcr wjnv wmfj wtsl'
        }
    });

    try {
        const info = await transporter.sendMail({
            from: '"FairShare" <leotolstoy052@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: `Your One Time Password (OTP) is ${otp}`, // plain text body
            html: `<p>Hello,</p><p>Your One Time Password (OTP) is: <b>${otp}</b></p><p>Use this to reset your password. It is valid for 10 minutes.</p>`
        });

        //   console.log("Message sent: %s", info.messageId);

        if (!info) {
            throw new ApiErrors(400, "Something went wrong while generating otp")
        }

        const response = { info, otp };

        return res
            .status(200)
            .json(
                new ApiResponse(200, response, "OTP sent successfully")
            )
    } catch (error) {
        throw new ApiErrors(400, "Something went wrong while sendig OTP")
    }

})


const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        throw new ApiErrors(401, "Email and password required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiErrors(404, "No user found with this email id")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Your password changed successfully")
        )
})


const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'lax'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "Logged out successfully"
        });
});




export {
    registerUser,
    loginUser,
    getCurrentUser,
    suggestUsers,
    resetPassword,
    sendOTP,
    logoutUser,
    updateProfile
}
