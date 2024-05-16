import User from "../../../domain/user";



interface IUserReop{

    saveUserToDb(userData:User):Promise<User|null|undefined>;
    findUserByemail(email:string):Promise<User|null|undefined>;
    verifyUserStatus(email:string):Promise<void>;
    
}




export default IUserReop;