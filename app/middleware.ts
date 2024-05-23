import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
    // console.log(req.nextauth.token.role);


  },
  {

    // callbacks: {
    //   authorized: ({ token }) => !!token,
    // },
  }
);

export const config = { matcher: ["*"] };