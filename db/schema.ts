import { varchar, pgTable, uuid, timestamp, pgEnum} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull(),
    password: varchar("password").notNull()
})

export const statusEnum = pgEnum("statusEnum", ["pending", "held"])

export const appointments = pgTable("appointments", {
    user_id: uuid("user_id").references(() => users.id).notNull(),
    status: statusEnum("status").default("pending").notNull(),
    title: varchar("title").notNull(),
    date: timestamp("date").notNull(),
    id: uuid("id").primaryKey().defaultRandom(),
    description: varchar("description"),
    client_name: varchar("client_name"),
    client_phone_number: varchar("client_phone_number"),
})
