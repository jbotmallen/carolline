"use server";

import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function checkStudentStatus(email: string) {
  try {
    if (!email.includes("usc.edu")) {
      return { success: false, message: 'Email is not a valid student email', status: 400 };
    }

    const existingStudent = await db.select().from(students).where(eq(students.email, email)).limit(1);

    if (existingStudent.length === 0) {
      return { success: false, message: 'Forbidden. Student email not found.', status: 403 };
    }

    const cookieStore = await cookies();
    cookieStore.set("email", email, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
    });

    revalidatePath("/chat");
    return { success: true, message: 'Student status verified', status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in checkStudentStatus:', error.message);
    }
    return { success: false, message: 'An error occurred. Please try again.', status: 500 };
  }
};