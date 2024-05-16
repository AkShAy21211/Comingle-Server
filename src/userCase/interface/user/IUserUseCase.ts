import User from "../../../domain/user";


interface IUserUseCase{

    signUpandSendOtp(userData:User):Promise<any>;
    verifyUserByEmailOtp(token:string,otp:string):Promise<any>;

}




export default IUserUseCase;