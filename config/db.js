// /config/db.js
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema"; // import all your tables

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema }); // <-- must include schema!
