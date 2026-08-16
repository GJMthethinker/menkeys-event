import sql from "@/lib/db";

export async function verifyAdminLogin(email: string, password: string): Promise<string | null> {
    const rows = await sql`
        select id from admins
            where email = ${email} and password_hash = crypt(${password}, password_hash)
                limit 1
                  `;
    return rows[0] ? rows[0].id : null;
}
