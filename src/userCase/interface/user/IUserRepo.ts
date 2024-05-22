import User from "../../../domain/user";



interface IUserReop{

    saveUserToDb(userData:User):Promise<User|null|undefined>;
    findUserByemail(email:string):Promise<User|null|undefined>;
    verifyUserStatus(email:string):Promise<void>;
    findUserById(id:string):Promise<User | null |undefined>;
    updateUser(id:string,data:any):Promise<User | null | undefined>;
    
}




export default IUserReop;