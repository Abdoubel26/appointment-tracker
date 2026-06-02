import { updateAppointment } from "@/db/queries";
import { NextResponse } from "next/server";



export const PUT = async (req: Request) =>  {

    const appointment: Appointment = await req.json()

    const updatedAppointment = updateAppointment(appointment)
    return NextResponse.json({ message:"updated", appointment: updatedAppointment}, { status: 200})
}