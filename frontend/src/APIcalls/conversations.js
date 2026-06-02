import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export class ConversationAPIs {
    async getAllConversations(){
        try {
            const response = await axios.get(`${baseURL}/api/v1/conversation/getAllConversations`,
                {
                    withCredentials: true
                }
            );

            return response.data
        } catch (error) {
            throw error
        }
    }

    async getAllChats({members,chatName}){
        try {
            // console.log("members data:",members,chatName)
            const response = await axios.post(`${baseURL}/api/v1/conversation/getAllChats`,
                {
                    members,
                    chatName
                },
                {
                    withCredentials: true
                }
            )

            return response.data
        } catch (error) {
            throw error;
        }
    }

    async getAllMembers(members){
        try {
            const response = await axios.post(`${baseURL}/api/v1/conversation/getAllMembers`,{
                members
            },
        {
            withCredentials: true
        }
        )
            return response.data
        } catch (error) {
            throw error
        }
    }
}


const conversationAPIs = new ConversationAPIs();

export default conversationAPIs;
