import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import sql from "@/lib/db";
import { generateId } from "@/lib/id";

const SESSION_COOKIE = "menkeys_session";
const SESSION_DAYS = 30;

export async function createSession(subjectType: "organizer" | "admin", subjectId: string) {
    const id = generateId("sess");
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await sql`insert into sessions (id, subject_type, subject_id, expires_at) values (${id}, ${subjectType}, ${subjectId}, ${expiresAt.toISOString()})`;
    cookies().set(SESSION_COOKIE, id, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          expires: expiresAt,
    });
}

export async function getSession(): Promise<{ subjectType: string; subjectId: string } | null> {
    const id = cookies().get(SESSION_COOKIE)?.value;
    if (!id) return null;
    const rows = await sql`select * from sessions where id = ${id} and expires_at > now() limit 1`;
    if (!rows[0]) return null;
    return { subjectType: rows[0].subject_type, subjectId: rows[0].subject_id };
}

export async function destroySession() {
    const id = cookies().get(SESSION_COOKIE)?.value;
    if (id) {
          await sql`delete from sessions where id = ${id}`;
    }
    cookies().delete(SESSION_COOKIE);
}

export async function requireOrganizer(): Promise<string> {
    const session = await getSession();
    if (!session || session.subjectType !== "organizer") {
          redirect("/organizer/login");
    }
    return session.subjectId;
}

export async function requireAdmin(): Promise<string> {
    const session = await getSession();
    if (!session || session.subjectType !== "admin") {
          redirect("/admin/login");
    }
    return session.subjectId;
}

export async function getOrganizerSession(): Promise<string | null> {
    const session = await getSession();
    if (!session || session.subjectType !== "organizer") return null;
    return session.subjectId;
}
