import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { User } from "@/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(
          `http://localhost:8080/api/Account/authentication`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        console.log(JSON.stringify(credentials));

        if (!response.ok) return null;

        return (await response.json()) as User;
      },
    }),
  ],
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
