import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./../../../(models)/User";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google: ", profile);

        let userRole = "member";

        if (profile?.email == "miguelbidarrab@gmail.com" || "pepconde.1993@gmail.com") {
          userRole = "admin";
        }
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackUrl: "/api/auth/callback/google",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        console.log("Authorizing credentials: ", credentials);
        try {
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec();
          if (foundUser) {
            console.log("User Exists: ", foundUser);
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );
            if (match) {
              console.log("Password match");
              delete foundUser.password;
              foundUser["role"] = "Member";
              return foundUser;
            } else {
              console.log("Password does not match");
            }
          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error in authorization: ", error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
