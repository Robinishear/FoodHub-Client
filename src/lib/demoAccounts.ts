import type { Role } from "@/types";

export type DemoAccount = {
  role: Role;
  label: string;
  email: string;
  password: string;
};

/** Demo logins for local/staging; create matching users in your API database. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "CUSTOMER",
    label: "Customer",
    email: "customer@foodhub.com",
    password: "customer123",
  },
  {
    role: "ADMIN",
    label: "Admin",
    email: "admin@foodhub.com",
    password: "admin123",
  },
  {
    role: "PROVIDER",
    label: "Provider",
    email: "provider@foodhub.com",
    password: "provider123",
  },
  {
    role: "MANAGER",
    label: "Manager",
    email: "manager@gmail.com",
    password: "manager123",
  },
  {
    role: "ORGANIZER",
    label: "Organizer",
    email: "organizer@foodhub.com",
    password: "organizer123",
  },
];
