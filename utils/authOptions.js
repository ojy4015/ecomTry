// when signIn happened, check if user's password matched with password saved in database

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials, req) {
        dbConnect();
        const { email, password } = credentials;
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found!");
        }

        // verify password
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],
  // after login is successful callbacks is triggered
  callbacks: {
    async signIn({ user }) {
      // {email,image, name} comes from google(data.user)
      const { email, name, image } = user;

      dbConnect();
      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        // create new user
        await User.create({
          email,
          name,
          image,
        });
      }
      // if already exist
      return true;
    },

    //  jwt 만들 때 실행되는 코드
    // add all the user profile(including user role from db) to the session
    jwt: async ({ token, user }) => {
      // get info from db
      const userByEmail = await User.findOne({ email: token.email });
      // console.log("userByEmail : ", userByEmail);

      // add this info to the token
      userByEmail.password = undefined;
      userByEmail.resetCode = undefined;

      token.user = userByEmail;
      // console.log("token : ", token);

      return token;
    },

    // 유저 세션이 조회될 때 마다 실행되는 코드
    // update session
    session: async({session, token}) => {
        session.user = token.user;
        //console.log("session : ", session);

        return session;
    },

  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
