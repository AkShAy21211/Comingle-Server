import User from "../../entities/user";

interface IProfileUserCase {
  getUserProfile(id: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  setNewPassWord(token: string, password: string): Promise<any>;
  updateUserProfileImages(
    id: string,
    images: Express.Multer.File,
    type: string
  ): Promise<any>;
  updateUserDetails(id: string, userData: User): Promise<any>;
  getOtherUserProfile(username:string):Promise<any>;
}



export default IProfileUserCase;