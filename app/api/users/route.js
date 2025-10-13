// /app/api/users/route.js
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { usersTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export default async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "User not logged in" }, { status: 401 });

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return NextResponse.json({ error: "User email not available" }, { status: 400 });

    const userResult = await db.select().from(usersTable).where(eq(usersTable.email, email));

    let userData;
    if (userResult.length === 0) {
      userData = { name: user.fullName ?? "NA", email, credits: 2 };
      await db.insert(usersTable).values(userData);
    } else {
      userData = userResult[0];
    }

    return NextResponse.json({ user: userData });
  } catch (err) {
    console.error("Error in /api/users:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
