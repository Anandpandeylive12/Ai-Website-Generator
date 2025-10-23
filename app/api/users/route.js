export const dynamic = "force-dynamic"; 

import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { usersTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ user: null, message: "Not logged in" }, { status: 200 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "User email not available" }, { status: 400 });
    }

    // ✅ Insert user safely only if not exists
    await db.insert(usersTable)
      .values({
        name: user.fullName ?? "NA",
        email,
        credits: 2
      })
      .onConflictDoNothing(); // ✅ Prevents duplicate insert crash

    // ✅ Return user from DB
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return NextResponse.json({ user: existingUser[0] });

  } catch (err) {
    console.error("Error in /api/users:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
