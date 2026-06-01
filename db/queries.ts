import { db } from "./index"
import { users, appointments } from "./schema"
import { eq } from "drizzle-orm"

export const addUser = async (user: User) => {
    const newUser = await db.insert(users).values(user).returning();
    return newUser;
};

export const findUserByEmail = async (email: string) => {
    const foundUser = await db.select().from(users).where(eq(users.email, email));
    return foundUser;
};

export const findUserById = async (id: string) => {
    const foundUser = await db.select().from(users).where(eq(users.id, id));
    return foundUser;
};

export const addAppointment = async (appointment: Appointment) => {
    const addedAppointment = await db.insert(appointments).values(appointment).returning();
    return addedAppointment;
}

export const updateAppointment = async (appointment: Appointment) => {
    if (!appointment.id) throw new Error("Appointment id is required for update");
    const updatedAppointment = await db.update(appointments).set(appointment).where(eq(appointments.id, appointment.id)).returning();
    return updatedAppointment;
}

export const deleteAppointment = async (id: string) => {
    const deletedAppointment = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return deletedAppointment;
}

