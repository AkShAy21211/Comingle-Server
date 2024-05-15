import User from "../../../domain/user";


interface IUserUseCase{

    signUpandSendOtp(userData:User):Promise<any>;

}




export default IUserUseCase;