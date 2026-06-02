import mongoose,{Schema} from "mongoose";

const expenseMessageSchema = new mongoose.Schema(
    {
        amount:{
            type: Number,
            required: true,
        },
        description: {
            type: String,
            requiredd: true,
            trim: true
        },
        place:{
            type: String,
            requiredd: true,
            trim: true
        },
        expenseDate:{
            type: Date,
            required: true,
        },
        sender:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        members:[
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

export const ExpenseMessage = mongoose.model("ExpenseMessage",expenseMessageSchema)