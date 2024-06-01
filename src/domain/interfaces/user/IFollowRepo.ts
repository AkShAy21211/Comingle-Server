import Follow from "../../entities/follow";

interface IFollowRepo{


    createFollowRequest(requester:string,recipient:string):Promise<Follow| null |undefined>;
    

}


export default IFollowRepo;