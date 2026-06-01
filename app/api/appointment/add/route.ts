import { NextResponse } from "next/server";
import { addAppointment } from "../../../../db/queries";


export const POST = async (req: Request) => {

    try {
        const {  date, user_id, title , description , client_name, client_phone_number }: Appointment = await req.json();

        if(!date || !user_id || !title) return NextResponse.json({ message:"missing required fields"}, { status: 400});

        const newAppointment = await addAppointment(
            {
                date: new Date(date), 
                user_id, 
                title, 
                description, 
                client_name, 
                client_phone_number, 
                status: (Date.now() > new  Date(date).getTime() ? "held" : "pending")
            }
        );

        return NextResponse.json({ message: "appointment added", appointment: newAppointment}, { status: 201})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({ message: "Server Error"}, { status: 500})
    }
}