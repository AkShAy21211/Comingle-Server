import User from "../../entities/user";



interface IUserReop{

    saveUserToDb(userData:User):Promise<User|null|undefined>;
    findUserByemail(email:string):Promise<User|null|undefined>;
    verifyUserStatus(email:string):Promise<void>;
    findUserById(userToFind: {googleId?:string,_id?:string}):Promise<User | null |undefined>;
    updateUser(id:string,data:any):Promise<User | null | undefined>;
    changeUserPassword(id:string,password:string):Promise<void>;
    createUser(userData:any):Promise<User | null | undefined>;
    updateUserProfileImages(id:string,image:{image?:string}):Promise<User | null | undefined>;
    getAllUsers(id:string):Promise<User[] | null | undefined>;
    findUsername(username:string):Promise<User|null|undefined>;
    addFollowings(id:string,following:string):Promise<User| null|undefined>
    removeFollowing(id:string,following:string):Promise<User| null|undefined>;
    addFollowers(id:string,following:string):Promise<User| null|undefined>
    fetchAllUsers():Promise<User[]|null|undefined>
    blockOrUnblockUser(id:string):Promise<User|null|undefined>;
    getUserByUsername(username:string):Promise<User|null|undefined>;
    getTotalUsersAnalytics():Promise<any>;
    findFriends(userId:string):Promise<User|null|undefined>;
    serachUserBynameOrEmail(name:string, currentUser:string):Promise<User[]|null|undefined>;

}




export default IUserReop;