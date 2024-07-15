import UserModel from "../database/userModel";
import Bcrypt from "./hashPassword";

const bcrypt = new Bcrypt();

async function createDemoUser() {
  const existingGuest = await UserModel.findOne({ email: "guest@gmail.com" });
  if (existingGuest) {
    return;
  }
  const hashPassword = await bcrypt.Encryption("Guest*#123");
  const guest = await UserModel.create({
    name: "Guest",
    username: "@guest",
    email: "guest@gmail.com",
    password: hashPassword,
  });
  guest.isVerified = true;
  await guest.save();

  return;
}

export default createDemoUser;
