import PostReport from "../../entities/repostPost";
import { bool } from 'sharp';

interface IReportRepo{

    createReport(postId:string,reason:string):Promise<PostReport|null|undefined>;
    getReports():Promise<PostReport[]|null|undefined>;
    deleteReport(postId:string):Promise<boolean|null|undefined>;
}


export default IReportRepo;