import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserReposotory from "../repository/userRepo";
import dotenv from "dotenv";
import User from "../../domain/entities/user";
import { log } from "console";
import UserModel from "../database/userModel";

dotenv.config();

const userRopo = new UserReposotory();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/user/auth/google/callback",
      passReqToCallback: true,
    },
    async function (_request, _accessToken, _refreshToken, profile, done) {
      try {
        const { id, emails, displayName, photos } = profile;
        const userToFind = {
          googleId: id,
        };
        let user = await userRopo.findUserById(userToFind);

        console.log("1", user);

        if (!user) {
          user = await userRopo.findUserByemail(emails?.[0].value as string);

          if (user) {
            user.googleId = profile.id;
            user.profile.image =
              user.profile.image || (photos?.[0].value as string);
            console.log("2", user);
          } else {
            const userData = {
              name: displayName,
              googleId: id,
              isVerified: emails?.[0].verified ? true : false,
              email: emails?.[0].value as string,
              profile: {
                image: photos?.[0].value,
              },
            };
            user = await userRopo.createUser(userData);

            return done(null, user as User);
          }
        }else{

          console.log('user exist alerady');
          
            return done(null, user as User);

        }
      } catch (error) {
        console.log(error);

        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("logged from here2");
  done(null, (user as User).googleId);
});

passport.deserializeUser((user: User, done) => {
  console.log("logged from here3");
  console.log(user);

  done(null, user);
});
