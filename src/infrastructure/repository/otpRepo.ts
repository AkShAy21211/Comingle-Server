import Otp from "../../domain/opt";
import IOtp from "../../userCase/interface/otp/IOtp";
import optModel from "../database/otpModel";

class OtpReposotory implements IOtp{


    async createOtpAndCollection(email: string, otp: string) {
        try {
            
            await optModel.create({
                email:email,
                otp:otp
            })
        } catch (error) {

            console.log('error occured when creating otp',error);
            
            
        }
    }

   async getOtp(email: string): Promise<Otp | null> {
    try {
        const otp = await optModel.findOne({ email: email }) as Otp;
        return otp ? otp :null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

}



export default OtpReposotory;