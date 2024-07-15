
import cron from 'node-cron'
import IPostUseCase from "../../domain/interfaces/user/IPostUseCase";

export class PostCronJob {
  constructor(private readonly postScheduler: IPostUseCase) {}

  start(): void {
   
    cron.schedule('*/2 * * * *', async () => {
      try {
        // Example: Schedule posts due to be published today
        await this.postScheduler.fetchSchedules();

      
      } catch (error) {
        console.error("Error scheduling posts:", error);
      }
    });
  }
}


export default PostCronJob