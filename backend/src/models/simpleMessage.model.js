import mongoose,{Schema} from "mongoose";


const simpleMessageSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true,
        },
        sender:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        chatName: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const SimpleMessage =mongoose.model("SimpleMessage",simpleMessageSchema);