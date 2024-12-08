import axiosInstance from "@/lib/axiosInstence";

export const fetch_contacts = async (userId: string | undefined,searchTerm: string) => {
    try {

        const response = await axiosInstance.get(`/chat/contacts/${userId}?search=${searchTerm}`);
        return response.data 
    } catch (error) {
        
        throw error
    }
};
export const fetch_room=async(recieverId:string,senderId:string|undefined)=>{
    try {
        const response=await axiosInstance.get(`/chat/room/${recieverId}/${senderId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const  fetch_room_message=async(roomId:string,userId:string|undefined)=>{
    try {
        const response=await axiosInstance.get(`/chat/room-message/${roomId}/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const fetch_chats= async (userId: string | undefined,searchTerm: string) => {
    try {

        const response = await axiosInstance.get(`/chat/chats/${userId}?search=${searchTerm}`);
        return response.data 
    } catch (error) {
        
        throw error
    }
}