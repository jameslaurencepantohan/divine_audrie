"use server";
import { neon } from "@neondatabase/serverless";

// Create reusable SQL client
export const sql = neon(process.env.DATABASE_URL);

// Example helper function
export async function getData() {
    return await sql`SELECT * FROM users`;
}