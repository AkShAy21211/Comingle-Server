import Admin from "../../domain/entities/admin";
import IAdminReposotory from "../../domain/interfaces/admin/adminIRepo";
import adminModel from "../database/adminModel";

class AdminReposotory implements IAdminReposotory {
  async findAdminByEmail(email: string): Promise<Admin | null | undefined> {
    try {
      const existingAdmin = await adminModel.findOne({ email: email });
      return existingAdmin;
    } catch (error) {
      console.log(error);
    }
  }

  async createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<Admin | null | undefined> {
    try {
      const admin = new adminModel({
        name: name,
        email: password,
        password: password,
      });
      await admin.save();
      console.log(admin);
      
      return;

    } catch (error) {
      console.log("error createing admin", error);
    }
  }
}

export default AdminReposotory;
