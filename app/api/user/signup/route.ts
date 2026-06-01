import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { addUser, findUserByEmail } from "../../../../db/queries";
import { NextResponse } from "next/server";
import { Truculenta } from "next/font/google";



export const POST = async (req: Request) => {
    
    try{
        const user: User = await req.json();

        if(!user.email || !user.name || !user.password) return NextResponse.json({ message: "fields missing"}, { status: 400});
        
        const foundUser = await findUserByEmail(user.email);

        if(foundUser[0]) return NextResponse.json({ message: "Email Already registered"}, { status: 400});

        const hashedPassword = await bcrypt.hash(user.password, 10)

        const addedUser = await addUser({...user, password: hashedPassword})

        const token = jwt.sign({ userId: addedUser[0].id}, process.env.JWT_SECRET!, { expiresIn: "3d"})

        const response = NextResponse.json({ message: "signed up"}, { status: 201})

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax", 
            secure: process.env.NODE_ENV === "production",
            path: "/"
        })

        return response
    }
    catch(e){
        console.log(e)
        return NextResponse.json({ message: "Server Error"}, { status: 500})
    }
};