import User from "../../../domain/user";



interface IUserReop{

    saveUserToDb(userData:User):Promise<User|null|undefined>
    findUserByemail(email:String):Promise<User|null|undefined>
}




export default IUserReop;