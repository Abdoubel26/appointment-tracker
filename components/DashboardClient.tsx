'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InferSelectModel } from 'drizzle-orm';
import { appointments } from '@/db/schema';
import AddAppointment from './AddAppointment';
import EditAppointment from './EditAppointment';

type Appointment = InferSelectModel<typeof appointments>;

type User = {
  id: string;
  name: string | null;
  email: string | null;
};

type Props = {
  appointments: Appointment[];
  user: User;
};

export default function DashboardClient({ appointments: initialAppointments, user }: Props) {
  const router = useRouter();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const sortedAppointments = [...initialAppointments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;

    const res = await fetch("/api/appointment/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete appointment");
    }
  };

  const getStatus = (date: Date | string, status: "pending" | "held") => {
    const appointmentDate = new Date(date);
    const now = new Date();

    if (status === "held") return { label: "Held", color: "bg-green-100 text-green-700" };
    if (appointmentDate < now) return { label: "Past", color: "bg-gray-100 text-gray-600" };
    return { label: "Pending", color: "bg-yellow-100 text-yellow-700" };
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-lg">
            {user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{user.name}</p>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 text-sm border cursor-pointer border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Appointments</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            + New Appointment
          </button>
        </div>

        {sortedAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
            <p className="text-neutral-500">No appointments yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">Title</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">Client</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">Date &amp; Time</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map((apt) => {
                  const status = getStatus(apt.date, apt.status);
                  return (
                    <tr key={apt.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                      <td className="py-4 px-6">
                        <div className="font-medium">{apt.title}</div>
                        {apt.description && <div className="text-sm text-neutral-500 line-clamp-1">{apt.description}</div>}
                      </td>
                      <td className="py-4 px-6">
                        <div>{apt.client_name || "—"}</div>
                        {apt.client_phone_number && <div className="text-sm text-neutral-500">{apt.client_phone_number}</div>}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        <br />
                        <span className="text-neutral-500">
                          {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-5">
                        <button onClick={() => setEditingAppointment(apt)} className="text-blue-600  cursor-pointer hover:text-blue-700 font-medium">Edit</button>
                        <button onClick={() => handleDelete(apt.id)} className="text-red-600  cursor-pointer hover:text-red-700 font-medium">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddAppointment userId={user.id} onClose={() => setShowAddModal(false)} />
      )}

      {editingAppointment && (
        <EditAppointment
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}
    </div>
  );
}