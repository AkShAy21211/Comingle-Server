import Follow from "../../entities/follow";

interface IFollowRepo{



    createFollowRequest(requester:string,recipient:string):Promise<Follow| null |undefined>;
    getFollowingUser(id:string):Promise<any[] | null | undefined>;
    getFollowedUser(id:string):Promise<any[]|null|undefined>;
    findFollowBeforeCreatingNewOne(requester:string,recipient:string):Promise<Follow| null |undefined>;
    

}


export default IFollowRepo;