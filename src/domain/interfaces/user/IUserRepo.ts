import User from "../../entities/user";



interface IUserReop{

    saveUserToDb(userData:User):Promise<User|null|undefined>;
    findUserByemail(email:string):Promise<User|null|undefined>;
    verifyUserStatus(email:string):Promise<void>;
    findUserById(userToFind: {googleId?:string,_id?:string}):Promise<User | null |undefined>;
    updateUser(id:string,data:any):Promise<User | null | undefined>;
    createUser(userData:any):Promise<User | null | undefined>;
    updateUserProfileImages(id:string,image:{image?:string}):Promise<User | null | undefined>;
    getAllUsers():Promise<User[] | null | undefined>;
    
}




export default IUserReop;