type User = {
    email: string;
    username: string;
    profile_pic: string;
    meetings: string[];  // Adjust the type based on the structure of meetings
    user_id: string;
};

export default User;