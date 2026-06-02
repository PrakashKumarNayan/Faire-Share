import mongoose,{Schema} from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        isGroup: {
            type: Boolean,
            default: false,
        },
        chatName: {
            type: String,
            required: true,
            trim: true
        },
        description:{
            type: String,
            required: false
        },
        chatIcon:{
            type: String,
            required: false
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        simpleMessages: [
            {
                type: Schema.Types.ObjectId,
                ref: "SimpleMessage"
            }
        ],
        expenseMessages: [
            {
                type: Schema.Types.ObjectId,
                ref: "ExpenseMessage"
            }
        ]
    },
    {
        timestamps: true
        
    }
)


export const Conversation = mongoose.model("Conversation",conversationSchema)