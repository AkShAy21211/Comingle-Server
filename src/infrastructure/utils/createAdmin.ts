import adminModel from "../database/adminModel";
import Bcrypt from "./hashPassword";

const bcrypt = new Bcrypt();

async function createAdmin() {
  const existingAdmin = await adminModel.findOne({ email: "admin@gmail.com" });
  if (existingAdmin) {
    return;
  }
  const hashPassword = await bcrypt.Encryption("Admin1*");
  const admin = await adminModel.create({
    name: "Admin Commingle",
    email: "admin@gmail.com",
    password: hashPassword,
  });
  await admin.save();

  return;
}

export default createAdmin;
