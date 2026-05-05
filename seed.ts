import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import UserModel from "./src/infrastructure/database/userModel";
import postModel from "./src/infrastructure/database/postModel";
import connectDB from "./src/infrastructure/config/db";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const users = [
  {
    name: "Alex Johnson",
    username: "alexj",
    email: "alex@example.com",
    password: "Password123!",
    isVerified: true,
    profile: {
      bio: "Tech enthusiast and coffee lover.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    }
  },
  {
    name: "Sarah Williams",
    username: "sarahw",
    email: "sarah@example.com",
    password: "Password123!",
    isVerified: true,
    profile: {
      bio: "Digital artist & traveler.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    }
  },
  {
    name: "Marcus Chen",
    username: "marcusc",
    email: "marcus@example.com",
    password: "Password123!",
    isVerified: true,
    profile: {
      bio: "Software developer by day, gamer by night.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    }
  }
];

const descriptions = [
  "Just wrapped up a huge project! Time to celebrate with some good coffee. ☕️🚀",
  "Exploring the mountains today. Nature is the best reset button. 🏔️",
  "My new workspace setup is finally complete! What do you guys think? 💻✨",
  "Sunday vibes. Reading a good book and relaxing.",
  "Throwback to last summer's road trip. Can't wait for the next adventure!",
  "Just pushed my first open-source contribution! Feeling incredibly proud.",
  "Coffee and code. The perfect combination for a productive morning.",
  "Sunsets like this remind me how beautiful the world is.",
  "Trying out a new recipe tonight. Wish me luck! 🍳",
  "Sometimes you just need to disconnect and go for a walk in the city."
];

const generatePosts = (count: number) => {
  const generated = [];
  for (let i = 0; i < count; i++) {
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    generated.push({
      description: `${randomDesc} #${i + 1}`,
      image: [{ url: `https://picsum.photos/800/800?random=${i}`, type: "image" }],
    });
  }
  return generated;
};

const posts = generatePosts(30);

const seedDB = async () => {
  try {
    await connectDB();
    
    console.log("Starting seed process...");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Password123!", salt);

    const insertedUsers = [];

    for (let u of users) {
      let existingUser = await UserModel.findOne({ email: u.email });
      if (!existingUser) {
        u.password = hashedPassword;
        existingUser = await UserModel.create(u);
        console.log(`Created user: ${u.username}`);
      } else {
        console.log(`User ${u.username} already exists, skipping creation.`);
      }
      insertedUsers.push(existingUser);
    }

    if (insertedUsers.length > 0) {
      // Create posts
      for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        const randomUser = insertedUsers[i % insertedUsers.length];
        
        await postModel.create({
          userId: randomUser._id,
          description: p.description + " - " + Math.random().toString(36).substring(7),
          image: p.image,
          status: "Published",
          date: new Date()
        });
        console.log(`Created new post for ${randomUser.username}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();
