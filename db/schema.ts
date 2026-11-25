import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const requests = sqliteTable("trial_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  name: text("name").notNull(),
  business: text("business").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  sector: text("sector").notNull(),
  monthlyLeads: text("monthly_leads").notNull(),
  crm: text("crm"),
  agent: text("agent"),
});
