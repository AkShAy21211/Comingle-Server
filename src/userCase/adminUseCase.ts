import Admin from "../domain/admin";
import TokenManager from "../infrastructure/utils/generateToken";
import Bcrypt from "../infrastructure/utils/hashPassword";
import IAdminReposotory from "./interface/admin/adminIRepo";
import IAdminUseCase from "./interface/admin/adminIUseCase";

class AdminUseCase implements IAdminUseCase {
  constructor(
    private _reposotory: IAdminReposotory,
    private _jwt: TokenManager,
    private _bcrypt: Bcrypt
  ) {}

 async signInAdmin(adminData:Admin) {
  try {
    // Check if admin exists
    const admin = await this._reposotory.findAdminByEmail(adminData.email);
    console.log(admin);
    
    if (!admin) {
      return {
        status: false,
        message: "Admin does not exist",
      };
    }

    // Verify password
    const matchPassword = await this._bcrypt.Decryption(adminData.password, admin.password);
    if (!matchPassword) {
      return {
        status: false,
        message: "Invalid login credentials",
      };
    }

    // Create JWT token
    const token = this._jwt.createToken(admin._id, "admin");
    return {
      status: true,
      token: token,
      admin:admin,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error during admin sign-in:", error);
    return {
      status: false,
      message: "An error occurred during login",
    };
  }
}

}

export default AdminUseCase;
