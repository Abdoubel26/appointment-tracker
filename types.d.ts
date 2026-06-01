type User = {
    id?: string,
    name: string,
    email: string,
    password: string
}

type Appointment = {
    date: Date,
    user_id: string,
    title: string,
    id?: string,
    description?: string,
    client_name?: string,
    client_phone_number?: string,
    status: "pending" | "held"
}