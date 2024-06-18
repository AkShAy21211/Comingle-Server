import { Request, Response } from "express";
import DashboardUseCase from "../../../userCase/admin/dashboardUseCase";

class DashboardController {
  constructor(private _dashboardUseCase: DashboardUseCase) {}

  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analyticsResponse = await this._dashboardUseCase.getAnatytics();

      if (analyticsResponse) {
        res.status(200).json(analyticsResponse);
      }else{

        res.status(404).json(analyticsResponse)
      }


    } catch (error) {

        res.status(500).json({message:"Internal server error"})
        console.log(error);
        
    }
  }
}

export default DashboardController;
