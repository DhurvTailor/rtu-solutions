import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const [rows]: any = await db.query(
          "SELECT * FROM users WHERE email = ?",
          [user.email]
        );
        if (rows.length === 0) {
          await db.query(
            `INSERT INTO users (google_id, name, email, img, role) VALUES (?, ?, ?, ?, ?)`,
            [account?.providerAccountId, user.name, user.email, user.image, "user"]
          );
        }
        return true;
      } catch (error) {
        console.error("signIn error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const [rows]: any = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );
          if (rows.length > 0) {
            token.id = rows[0].id;
            token.role = rows[0].role;
            token.img = rows[0].img;
            token.name = rows[0].name;
            token.email = rows[0].email;
          }
        } catch (error) {
          console.error("jwt error:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = (token.img as string) || session.user.image;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
};