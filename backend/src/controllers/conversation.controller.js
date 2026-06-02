import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversation.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const getAllConversations = asyncHandler(async (req, res) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new ApiErrors(400, "Unauthorized request");
  }

  const conversations = await Conversation.find({
    members: currentUser?._id,
  })
    .select("-simpleMessages -expenseMessages")
    .sort({ updatedAt: -1 });

  if (!conversations) {
    throw new ApiErrors(400, "No conversations yet");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, conversations, "Conversations fetched successfully")
    );
});

const getAllChats = asyncHandler(async (req, res) => {
  const { members, chatName } = req.body;

  if (!members || !chatName) {
    throw new ApiErrors(400, "User not fetched");
  }

  // Get the logged-in user
  const loggedMember = req.user;
  if (!loggedMember) {
    throw new ApiErrors(400, "Logged user not fetched");
  }

  // Create the array of member IDs
  const membersIds = members.map((id) => new mongoose.Types.ObjectId(id));

  // Add the logged-in user to the membersIds
  membersIds.push(loggedMember._id);

  let conversation = await Conversation.findOne({
    chatName,
    members: { $all: membersIds },
  })
    .populate({
      path: "simpleMessages",
      populate: {
        path: "sender",
        model: "User",
        select: "-password -coverImage -email -refreshToken",
      },
    })
    .populate({
      path: "expenseMessages",
      populate: {
        path: "sender",
        model: "User",
        select: "-password -coverImage -email -refreshToken",
      }, // Populate the sender within each expense message
    });

  if (conversation) {
    // Combine simpleMessages and expenseMessages into a single array
    const combinedMessages = [
      ...conversation.simpleMessages.map((msg) => ({
        ...msg.toObject(),
        messageType: "simpleMessage",
      })),
      ...conversation.expenseMessages.map((msg) => ({
        ...msg.toObject(),
        messageType: "expenseMessage",
      })),
    ];

    // Sort combinedMessages by creation time
    const sortedMessages = combinedMessages.sort(
      (a, b) => a.createdAt - b.createdAt
    );

    // Return the sorted messages
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sortedMessages,
          "Fetched all chat messages successfully"
        )
      );
  } else {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          conversation,
          "Fetched all chat messages successfully"
        )
      );
  }
});

const getAllMembers = asyncHandler(async (req, res) => {
  const { members } = req.body;

  // Convert each member string to a MongoDB ObjectId
  const membersObjects = members.map(
    (member) => new mongoose.Types.ObjectId(member)
  );

  try {
    // Fetch details of all members
    const allMembersDetails = await Promise.all(
      membersObjects.map((member) => {
        return User.findOne({ _id: member }).select(
          "-password -coverImage -refreshToken"
        ); // Exclude sensitive info
      })
    );

    // Check if any members were not found
    if (!allMembersDetails) {
      throw new ApiErrors(404, "Some members were not found");
    }

    // Return the details of all members
    return res
      .status(200)
      .json(
        new ApiResponse(200, allMembersDetails, "Members fetched successfully")
      );
  } catch (error) {
    // Catch any errors during the process
    throw new ApiErrors(500, "Error fetching member details");
  }
});

export { getAllConversations, getAllChats, getAllMembers };
