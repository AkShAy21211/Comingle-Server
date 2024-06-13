import PostReport from "../../domain/entities/repostPost";
import IReportRepo from "../../domain/interfaces/user/IReportReopo";
import ReportModel from "../database/reportModal";

class ReportReposotory implements IReportRepo {
  async createReport(postId: string, reason: string): Promise<PostReport|null|undefined> {
    try {
      const newReport = new ReportModel({
        postId: postId,
        reason: reason,
      });
      await newReport.save();

      return newReport;

    } catch (error) {
      console.log(error);
    }
  }

  async getReports(): Promise<PostReport[] | null | undefined> {
    try {
      
      const reports = await ReportModel.find({}).lean();

      return reports;

    } catch (error) {
      console.log(error);
      
    }
  }
}

export default ReportReposotory;
