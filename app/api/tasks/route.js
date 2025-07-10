import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

// ✅ GET /api/tasks - Fetch tasks for logged-in user
export async function GET(req) {
  const user = await getUserFromToken(); // ✅ add await
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await db.query(
      `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
      [user.id]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

// ✅ POST /api/tasks - Save tasks for logged-in user
export async function POST(req) {
  const user = await getUserFromToken(); // ✅ add await
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Delete existing tasks for this user
    await db.query(`DELETE FROM tasks WHERE user_id = $1`, [user.id]);

    // Insert new tasks
    for (const status in body) {
      const taskList = body[status];
      for (const task of taskList) {
        const dueDate = task.dueDate === "" ? null : task.dueDate;

        await db.query(
          `INSERT INTO tasks (user_id, title, description, due_date, priority, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [user.id, task.title, task.description, dueDate, task.priority, status]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving tasks:", error);
    return NextResponse.json({ error: "Failed to save tasks" }, { status: 500 });
  }
}
