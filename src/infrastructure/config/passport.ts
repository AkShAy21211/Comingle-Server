import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserReposotory from "../repository/userRepo";
import dotenv from "dotenv";
import User from "../../domain/entities/user";


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


        if (!user) {
          user = await userRopo.findUserByemail(emails?.[0].value as string);

          if (user) {
            user.googleId = profile.id;
            user.profile.image =
              user.profile.image || (photos?.[0].value as string);
                        return done(null, user as User);

          } else {
            const userData = {
              name: displayName,
              googleId: id,
              isVerified: emails?.[0].verified ? true : false,
              username:'@'+displayName.toLocaleLowerCase(),
              email: emails?.[0].value as string,
              profile: {
                image: photos?.[0].value,
              },
            };
            user = await userRopo.createUser(userData);

            return done(null, user as User);
          }
        }else{

          
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
  done(null, (user as User).googleId);
});

passport.deserializeUser((user: User, done) => {
  console.log(user);

  done(null, user);
});
