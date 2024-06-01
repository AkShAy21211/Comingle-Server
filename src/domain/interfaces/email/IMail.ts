interface IMail{


    sendEmail(to:string,otp:number,subject:string):Promise<any>;
}


export default IMail;