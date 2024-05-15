interface IMail{


    sendEmail(to:string,otp:number):Promise<any>;
}


export default IMail;