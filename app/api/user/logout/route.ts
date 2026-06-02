import { NextRequest, NextResponse } from "next/server";




export const POST = async (req: NextRequest) => {
    const response = NextResponse.redirect(new URL("/login", req.url))
    response.cookies.delete("token")
    return response
}