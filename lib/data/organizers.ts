import sql from "@/lib/db";
import { generateId } from "@/lib/id";
import type { Organizer, TeamMember, TeamRole } from "@/lib/types";

function mapOrganizer(r: any): Organizer {
    return {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone ?? undefined,
          logoUrl: r.logo_url ?? undefined,
          verified: r.verified,
          plan: r.plan,
          createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    };
}

function mapTeamMember(r: any): TeamMember {
    return {
          id: r.id,
          organizerId: r.organizer_id,
          name: r.name,
          email: r.email,
          role: r.role,
          invitedAt: r.invited_at instanceof Date ? r.invited_at.toISOString() : r.invited_at,
    };
}

export async function getOrganizerById(id: string): Promise<Organizer | undefined> {
    const rows = await sql`select * from organizers where id = ${id} limit 1`;
    return rows[0] ? mapOrganizer(rows[0]) : undefined;
}

export async function createOrganizer(
    input: Omit<Organizer, "id" | "createdAt" | "verified" | "plan">
  ): Promise<Organizer> {
    const id = generateId("org");
    const rows = await sql`
        insert into organizers (id, name, email, phone, logo_url, verified, plan)
            values (${id}, ${input.name}, ${input.email}, ${input.phone ?? null}, ${input.logoUrl ?? null}, false, 'free')
                returning *
                  `;
    return mapOrganizer(rows[0]);
}

export async function listTeamMembers(organizerId: string): Promise<TeamMember[]> {
    const rows = await sql`select * from team_members where organizer_id = ${organizerId}`;
    return rows.map(mapTeamMember);
}

export async function inviteTeamMember(
    organizerId: string,
    name: string,
    email: string,
    role: TeamRole
  ): Promise<TeamMember> {
    const id = generateId("team");
    const rows = await sql`
        insert into team_members (id, organizer_id, name, email, role)
            values (${id}, ${organizerId}, ${name}, ${email}, ${role})
                returning *
                  `;
    return mapTeamMember(rows[0]);
}


export async function signupOrganizer(input: {
        name: string;
        email: string;
        password: string;
        phone?: string;
}): Promise<{ ok: boolean; reason?: string; organizerId?: string }> {
        const existing = await sql`select id from organizers where email = ${input.email} limit 1`;
        if (existing[0]) {
                    return { ok: false, reason: "email_taken" };
        }
        const id = generateId("org");
        await sql`
                insert into organizers (id, name, email, phone, verified, plan, password_hash)
                        values (${id}, ${input.name}, ${input.email}, ${input.phone ?? null}, false, 'free', crypt(${input.password}, gen_salt('bf')))
                            `;
        return { ok: true, organizerId: id };
}

export async function verifyOrganizerLogin(email: string, password: string): Promise<string | null> {
        const rows = await sql`
                select id from organizers
                        where email = ${email} and password_hash is not null and password_hash = crypt(${password}, password_hash)
                                limit 1
                                    `;
        return rows[0] ? rows[0].id : null;
}


export async function listAllOrganizers(): Promise<Organizer[]> {
        const rows = await sql`select * from organizers order by created_at desc`;
        return rows.map(mapOrganizer);
}
