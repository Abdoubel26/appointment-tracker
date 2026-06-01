import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { findUserByEmail} from "../../../../db/queries";


export const POST = async (req: Request ) => {

    const { email, password } = await req.json();

    if(!email || !password) return NextResponse.json({ message:"required fields missing"}, { status: 400});

    const foundUser = await findUserByEmail(email);

    if(!foundUser[0]) return NextResponse.json({ message:"Email not registered"}, {status: 404});

    const isMatch = bcrypt.compare(password, foundUser[0].password);

    if(!isMatch) return NextResponse.json({ message: "wrong credentials"}, { status: 401 });
    
    const token = jwt.sign({ userId: foundUser[0].id}, process.env.JWT_SECRET!, { expiresIn: "3d"});

    const response = NextResponse.json({ message: "Logged in"}, { status: 200});

    response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });

    return response;
};