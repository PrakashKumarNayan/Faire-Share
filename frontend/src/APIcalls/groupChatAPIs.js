import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

export class GroupChatAPIs {
    async createGroup(chatData) {
        // console.log("Chat data in api:",chatData)
        try {
            const formdata = new FormData();

            formdata.append('description', chatData.description)
            formdata.append('groupName', chatData.groupName)
            // formdata.append('members',chatData.groupMembersIds)

            chatData.groupMembersIds.forEach((id) => {
                formdata.append("members", id);
            });

            // console.log("Chat icon:",chatData.chatIcon[0])

            if (chatData.chatIcon[0]) {
                formdata.append('chatIcon', chatData.chatIcon[0])
            }

            // console.log("chat icon:",formdata.chatIcon)


            const response = await axios.post(`${baseURL}/api/v1/groupChats/createGroup`,
                formdata,
                { withCredentials: true }
            )

            // console.log("New group:",response)

            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getGroupDetails(groupId) {
        try {
            const response = await axios.get(`${baseURL}/api/v1/groupChats/details/${groupId}`,
                { withCredentials: true }
            )

            return response.data;
        } catch (error) {
            throw error
        }
    }

    async sendSimpleMessage({ message, receiverArray, chatName }) {

        try {
            const response = await axios.post(`${baseURL}/api/v1/groupChats/sendSimpleMessage`,
                {
                    message,
                    receiverArray,
                    chatName
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

    async sendExpenseMessage({ amount, description, place, expenseDate, chatName, receiverArray }) {
        try {
            const response = await axios.post(`${baseURL}/api/v1/groupChats/sendExpenseMessage`,
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
            throw error;
        }
    }
}

const groupChatAPIs = new GroupChatAPIs();

export default groupChatAPIs;
