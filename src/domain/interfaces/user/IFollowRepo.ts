import Follow from "../../entities/follow";

interface IFollowRepo{



    createFollowRequest(requester:string,recipient:string):Promise<Follow| null |undefined>;
    getFollowerAndFollowing(id:string):Promise<any[] | null | undefined>;
    

}


export default IFollowRepo;