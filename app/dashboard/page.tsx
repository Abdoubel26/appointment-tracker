// app/dashboard/page.tsx
import { db } from "@/db";
import { appointments, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  let decoded: JwtPayload | null = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (e) {
    console.error(e);
    redirect("/login");
  }

  if (!decoded?.userId) redirect("/login");

  const userId = decoded.userId;

  const [userResult, appointmentResult] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)).limit(1),
    db.select().from(appointments)
      .where(eq(appointments.user_id, userId))
      .orderBy(appointments.date),
  ]);

  if (!userResult[0]) redirect("/login");

  const user = userResult[0];

  return (
    <DashboardClient
      appointments={appointmentResult}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
    />
  );
}