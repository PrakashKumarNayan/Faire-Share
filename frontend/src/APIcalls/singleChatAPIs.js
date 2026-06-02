import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export class SingleChatAPIs {
    async sendSimpleChat ({message,receiverArray,chatName}){
        console.log("Received data:",typeof(receiverArray))
        try {
            const response = await axios.post(`${baseURL}/api/v1/singleChats/sendSimpleMessage`,
                {
                    message,
                    receiverArray,
                    chatName
                },
                {
                    withCredentials: true
                }
            )

            return response
        } catch (error) {
            throw error
        }
    }


    async sendExpenseChat ({amount,description,place,expenseDate,chatName,receiverArray}){
        try {
            const response = await axios.post(`${baseURL}/api/v1/singleChats/sendExpenseMessage`,
                {
                    amount,
                    description,
                    place,
                    expenseDate,
                    chatName,
                    receiverArray
                },
                {
                    withCredentials: true
                }
            )
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

const singleChatAPIs = new SingleChatAPIs();

export default singleChatAPIs;