import Otp from "../../entities/opt";

interface IOtp {


    createOtpAndCollection(email:string,otp:string):any;
    getOtp(email:string):Promise<Otp | null>;

}


export default IOtp