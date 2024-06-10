import User from "../../entities/user";


interface IAuthUseCase{

    signUpandSendOtp(userData:User):Promise<any>;
    verifyUserByEmailOtp(token:string,otp:string):Promise<any>;
    resendOtp(token:string):Promise<any>;
    findUserByUsername(username:string):Promise<any>
    signinUser(email:string,password:string):Promise<any>;
    googleLogin(user:any):Promise<any>;
   


}




export default IAuthUseCase;