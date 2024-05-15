import bcrypt from "bcryptjs";

class Bcrypt {
  async Encryption(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error("Encryption failed:", error);
      throw error;
    }
  }

  async Decryption(password: string, hashPassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashPassword);
      return isMatch;
    } catch (error) {
      console.error("Decryption failed:", error);
      throw error;
    }
  }
}


export default Bcrypt;