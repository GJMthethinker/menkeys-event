import { organizers, teamMembers } from "@/lib/data/store";
import { generateId } from "@/lib/id";
import type { Organizer, TeamMember, TeamRole } from "@/lib/types";

export async function getOrganizerById(
  id: string
): Promise<Organizer | undefined> {
  return organizers.find((o) => o.id === id);
}

export async function createOrganizer(
  input: Omit<Organizer, "id" | "createdAt" | "verified" | "plan">
): Promise<Organizer> {
  const record: Organizer = {
    ...input,
    id: generateId("org"),
    verified: false,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  organizers.push(record);
  return record;
}

export async function listTeamMembers(
  organizerId: string
): Promise<TeamMember[]> {
  return teamMembers.filter((m) => m.organizerId === organizerId);
}

export async function inviteTeamMember(
  organizerId: string,
  name: string,
  email: string,
  role: TeamRole
): Promise<TeamMember> {
  const record: TeamMember = {
    id: generateId("team"),
    organizerId,
    name,
    email,
    role,
    invitedAt: new Date().toISOString(),
  };
  teamMembers.push(record);
  return record;
}
