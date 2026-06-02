'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onClose: () => void
  userId: string
};

export default function AddAppointment({ onClose, userId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [client_name, setClientName] = useState("");
  const [client_phone_number, setClientPhone] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "held">("pending");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointment/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,
            title,
            date: new Date(date),
            client_name: client_name || null,
            client_phone_number: client_phone_number || null,
            description: description || null,
            status,
        }),
      });

    if (!res.ok) throw new Error("Failed to create appointment");

      router.refresh();
      onClose();
    } catch (err) {
      setError("Something went wrong. Please try again: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-medium">New Appointment</h2>
          <button onClick={onClose} className="text-xl cursor-pointer text-neutral-400 hover:text-neutral-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-neutral-500">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg" />
          </div>

          <div>
            <label className="text-sm text-neutral-500">Date &amp; Time</label>
            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-500">Client Name</label>
              <input value={client_name} onChange={e => setClientName(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-neutral-500">Phone</label>
              <input value={client_phone_number} onChange={e => setClientPhone(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-500">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as "pending" | "held")} className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg">
              <option value="pending">Pending</option>
              <option value="held">Held</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-neutral-500">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="py-3 bg-blue-600  cursor-pointer hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50">
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}