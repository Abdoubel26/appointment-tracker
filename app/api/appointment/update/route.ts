import { updateAppointment } from "@/db/queries";
import { NextResponse } from "next/server";



export const PUT = async (req: Request) =>  {

   try {
        const body = await req.json()

        const updatedData = {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
        };

        const updatedAppointment = updateAppointment(updatedData)
        return NextResponse.json({ message:"updated", appointment: updatedAppointment}, { status: 200})
    }
    catch(e) {
        console.log(e)
        return NextResponse.json({ message: "Server Error"}, { status: 500})
    }
}