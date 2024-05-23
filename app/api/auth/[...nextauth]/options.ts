import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";
import User from "../../../../models/User";
import NextAuthConfig from "next-auth";

// type Token = { role: string };
// type User = { role: string };
// type Session = {
//   session: { user: User },
//   user: User,
//   token: Token,
// };
// type JWT = {
//   token: Token,
//   user: User,
// };

export const options = {
  pages: {
    signIn: "login",
  },
  providers: [
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google: ", profile);

        // if (profile?.email == "admin@example.com") {
        //   userRole = "admin";
        // }
        return {
          ...profile,
          id: profile.sub,
          role: "member",
          image: profile.image,
        };
      },
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: {
    //       label: "email:",
    //       type: "text",
    //       placeholder: "your-email",
    //     },
    //     password: {
    //       label: "password:",
    //       type: "password",
    //       placeholder: "your-password",
    //     },
    //   },
    //   async authorize(credentials, _req: any) {
    //     console.log("Authorizing credentials: ", credentials);
    //     try {
    //       const foundUser = await User.findOne({ email: credentials!.email })
    //         .lean()
    //         .exec();
    //       if (foundUser) {
    //         console.log("User Exists: ", foundUser);
    //         const match = await bcrypt.compare(
    //           credentials!.password,
    //           foundUser.password
    //         );
    //         if (match) {
    //           console.log("Password match");
    //           delete foundUser.password;
    //           foundUser["role"] = "Member";
    //           return foundUser;
    //         } else {
    //           console.log("Password does not match");
    //         }
    //       } else {
    //         console.log("User not found");
    //       }
    //     } catch (error) {
    //       console.error("Error in authorization: ", error);
    //     }
    //     return null;
    //   },
    // }),
  ],
  callbacks: {
    /**
     *@todo - rewrite this part
     */
    // async signIn({ user, account, profile }) {
    //   console.log('Sign in: ', user, account, profile);
    //   return true;
    // },
    // async jwt({ token, user }) {
    //   // if (user) {
    //   //   token.role = user.role;
    //   // }
    //   return token;
    // },
    // async session({ session, token }) {
    //   // if (session?.user) {
    //   //   session.user.role = token.role;
    //   // }
    //   return session;
    // },
  },
};
