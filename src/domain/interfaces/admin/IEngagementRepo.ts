import Engagement from "../../entities/engagemant";

interface IEngagementRepo {
  createEngagements(data: {type:string,count:Number}): Promise<Engagement|null|undefined>;
  updateEngagement(type: string): Promise<any>;
  findEngagementOfTheDay(): Promise<Engagement>
  getEngagement(): Promise<Engagement[] | null | undefined>;
//   getEngagementByDate(date:Date):Promise<Engagement|null|undefined>;
}

export default IEngagementRepo;
