
interface User{

    _id:string;
    name:string;
    email:string;
    password:string;
    isVerified:boolean;
    isBlocked:boolean;
    profile:{
        image:string;
        bio:string;
        age:number;
        country:string;
        gender:string;
        isPremium:boolean;
        followers:number;
        following:number;
        posts:number;
    }
    timestamp:Date;
    
}

export default User;