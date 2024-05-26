import User from "../../../domain/user";


interface IUserUseCase{

    signUpandSendOtp(userData:User):Promise<any>;
    verifyUserByEmailOtp(token:string,otp:string):Promise<any>;
    resendOtp(token:string):Promise<any>;
    signinUser(email:string,password:string):Promise<any>;
    getUserProfile(id:string):Promise<any>;
    updateUserProfileImages(id:string,imagePth:string,type:string):Promise<any>; 
    updateUserDetails(id:string,userData:User):Promise<any>; 
    googleLogin(user:any):Promise<any>;
    forgotPassword(email:string):Promise<any>;
    setNewPassWord(token:string,password:string):Promise<any>; 

}




export default IUserUseCase;