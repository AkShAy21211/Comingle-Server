import PostReport from "../../entities/repostPost";

interface IReportRepo{

    createReport(postId:string,reason:string):Promise<PostReport|null|undefined>;
    getReports():Promise<PostReport[]|null|undefined>
}


export default IReportRepo;