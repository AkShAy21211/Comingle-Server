
interface User{

    _id:string;
    name:string;
    email:string;
    phone:number;
    password:string;
    isVerified:boolean;
    isBlocked:boolean;
    profile:{
        image:string;
        background:string;
        bio:string;
        age:number;
        country:string;
        gender:string;
        isPremium:boolean;
        followers:string[];
        following:string[];
        posts:number;
    }
    googleId: string;

    timestamp:Date;
    
}

export default User;