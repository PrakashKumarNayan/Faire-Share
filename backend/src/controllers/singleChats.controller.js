import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { SimpleMessage } from "../models/simpleMessage.model.js";
import { ExpenseMessage } from "../models/expenseMessage.model.js";
import { Conversation } from "../models/conversation.model.js";

const sendSimpleMessage = asyncHandler(async (req,res)=>{
    const {message,receiverArray,chatName} = req.body;



    if(!message || !receiverArray || !chatName){
        throw new ApiErrors(400,"Provided data are insufficient")
    }

    const sender = req.user

    if(!sender){
        throw new ApiErrors(400,"Sender not fetched")
    }

    const receiver = await User.findOne({_id:receiverArray[0]})
    
    if(!receiver){
        throw new ApiErrors(400,"Reciever not fetched")
    }

    const members = [sender._id,receiver._id]
    

    const simpleMessage = await SimpleMessage.create({
        message,
        members,
        chatName,
        sender: sender._id
    })



    try {
        let conversation = await Conversation.findOne(
            {
                chatName: chatName,
                members: { $all:members }
            }
        )    
    
    
    
        if(conversation){
            if(conversation.members.length === members.length){
                conversation.simpleMessages.push(simpleMessage._id)
                await conversation.save();
            }
        }else{
            conversation = await Conversation.create(
                {
                    isGroup: false,
                    chatName,
                    members,
                    chatIcon: receiver.avatar,
                    simpleMessages: [simpleMessage._id]
                }
            )
        }
    
// simpleMessage = await SimpleMessage.findById(simpleMessage._id).populate("sender", "name email avatar");    
    
        return res.status(200).json(
            new ApiResponse(200,{simpleMessage,conversation},"New simple message added to the conversation")
        )
    } catch (error) {
        throw new ApiErrors(400,"Error during finding conversation document")
    }
})

const sendExpenseMessage = asyncHandler( async(req,res)=>{
    const {amount,description,place,expenseDate,chatName,receiverArray} =req.body

    if(
        [amount,description,place,expenseDate,chatName,receiverArray[0]].some((field)=>field.trim()==="")
    ){
        throw new ApiErrors(400,"Provided data are insufficient")
    }

    const sender = req.user;

    if(!sender){
        throw new ApiErrors(400,"Sender not fetched")
    }

    const receiver = await User.findOne({_id:receiverArray[0]})

    if(!receiver){
        throw new ApiErrors(400,"Reciever not fetched")
    }

    const members = [sender._id,receiver._id]

    const expenseMessage = await ExpenseMessage.create(
        {
            amount,
            description,
            place,
            expenseDate,
            members,
            chatName,
            sender
        }
    )

    try {
        let conversation = await Conversation.findOne(
            {
                chatName: chatName,
                members: {$all: members}
            }
        )
        if(conversation){
            if(conversation.members.length === members.length){
                conversation.expenseMessages.push(expenseMessage._id)
                await conversation.save()
            }
        }else{
            conversation = await Conversation.create(
                {
                    isGroup: false,
                    chatName,
                    members,
                    expenseMessages: [expenseMessage._id]
                }
            )
        }

        return res.status(200).json(
            new ApiResponse(200,conversation,"New expense message added")
        )
    } catch (error) {
        throw new ApiErrors(400,"Error while searching conversation document")
    }

})


export {
    sendSimpleMessage,
    sendExpenseMessage
}



















  