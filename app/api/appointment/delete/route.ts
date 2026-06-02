
import { NextResponse } from "next/server";
import { deleteAppointment } from "../../../../db/queries";


export const DELETE = async (req: Request) => {

    const { id } = await req.json();

    if(!id) return NextResponse.json({ message:" id requried"}, { status: 400 });

    const deletedAppointment = await deleteAppointment(id)

    return NextResponse.json({ message:"appointment deleted"}, { status:200})
}