import Follow from "../../entities/follow";

interface IFollowRepo{



    createFollowRequest(requester:string,recipient:string):Promise<Follow| null |undefined>;
    getFollowingUser(id:string):Promise<any[] | null | undefined>;
    getFollowedUser(id:string):Promise<any[]|null|undefined>;
    getStatus(requester:string,recipitent:string):Promise<string | null |undefined>;
    updateFollowStatus(followId:string,status:string):Promise<Follow | null|undefined>;
    getFollowRequestByuser(requester:string):Promise<Follow[]|null|undefined>
    

}


export default IFollowRepo;