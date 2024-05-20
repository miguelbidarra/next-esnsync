import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        console.log("Profile Google: ", profile);
        let userRole = "member";
        if (profile?.email === "miguelbidarrab@gmail.com") {
          userRole = "admin";
        }
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Using lean() to optimize Mongoose query
          const foundUser = await User.findOne({ email: credentials.email }).lean().exec();
          if (foundUser) {
            const match = await bcrypt.compare(credentials.password, foundUser.password);
            if (match) {
              delete foundUser.password;
              foundUser["role"] = "Member";
              return foundUser;
            }
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

export default NextAuth(options);
