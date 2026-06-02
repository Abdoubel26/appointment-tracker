import { NextResponse } from "next/server";
import { findUserById } from "../../../../db/queries"


export const GET = async (req: Request) => {

    try{
        const { userId } =  await req.json()

        if(!userId) return NextResponse.json({ message: "userId missing"}, { status: 400})

        const user = await findUserById(userId)

        return NextResponse.json({ user: user}, { status: 200})
    }   
    catch(e){
        

    }
}