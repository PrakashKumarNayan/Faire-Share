
import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

export class UserAPIs {
    async signUp(userData) {
        try {
            // Handling form data
            const formData = new FormData();
            formData.append('mobileNo', userData.mobileNo)
            formData.append('fullName', userData.fullName);
            formData.append('email', userData.email);
            formData.append('password', userData.password);
            formData.append('reEnteredPassword', userData.reEnteredPassword);

            const avatarFile = userData.avatar?.[0] || userData.avatar;
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            const coverFile = userData.coverImage?.[0] || userData.coverImage;
            if (coverFile) {
                formData.append('coverImage', coverFile);
            }

            // API call using axios
            const response = await axios.post(`${baseURL}/api/v1/user/register`,
                formData,
                {
                    withCredentials: true
                }
            );
            // console.log("Logged in user:",response)

            // If registration is successful, log in
            if (response && response.data.success === true) {
                const credentials = {
                    mobileNo: userData.mobileNo,
                    password: userData.password
                };
                return await this.login(credentials);
            }
        } catch (error) {
            console.error("Error while register API call:", error);
            throw error;
        }
    }

    async login(userData) {
        try {
            // console.log("user data for login api call:",userData)
            const response = await axios.post(`${baseURL}/api/v1/user/login`,
                {
                    mobileNo: userData.mobileNo,
                    password: userData.password
                },
                {
                    withCredentials: true
                }
            );
            return response.data; // return the API response data
        } catch (error) {
            // console.error("Error while login API call:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const response = await axios.get(`${baseURL}/api/v1/user/getCurrentUser`,
                {
                    withCredentials: true
                }
            );
            return response.data; // return the API response data
        } catch (error) {
            console.error("Error while getting current user:", error);
            throw error;
        }
    }

    async updateProfile(userData) {
        try {
            const formData = new FormData();
            formData.append("email", userData.email);
            formData.append("mobileNo", userData.mobileNo);

            if (userData.avatar) {
                formData.append("avatar", userData.avatar);
            }

            const response = await axios.patch(`${baseURL}/api/v1/user/updateProfile`,
                formData,
                {
                    withCredentials: true
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error while updating profile:", error);
            throw error;
        }
    }

    async suggestUser({ name }) {
        try {
            // console.log(name)
            const response = await axios.post(`${baseURL}/api/v1/user/suggestUsers`,
                {
                    name
                },
                {
                    withCredentials: true
                }
            )

            return response.data;
        } catch (error) {
            console.error("Error while fetching for user :", error)
            throw error
        }
    }

    async sendOtp({ email }) {
        try {
            const response = await axios.post(`${baseURL}/api/v1/user/sendOtp`, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async resetPassword({ email, newPassword }) {
        try {
            const response = await axios.post(`${baseURL}/api/v1/user/resetPassword`,
                { email, newPassword }
            )
            return response;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            const response = await axios.post(
                `${baseURL}/api/v1/user/logout`,
                {},
                {
                    withCredentials: true   // ✅ VERY IMPORTANT
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error while logout:", error);
            throw error;
        }
    }
}

const userAPI = new UserAPIs();
export default userAPI;
