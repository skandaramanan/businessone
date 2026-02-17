import { createClient } from "@/lib/supabase/client";

export type Interviewer = {
  id: string;
  full_name: string;
};

export type SchedulerBooking = {
  id: string;
  candidate_name: string;
  candidate_email: string;
  interviewer_a_id: string;
  interviewer_b_id: string;
  slot_key: string;
  created_at: string;
  first_preference?: string | null;
  second_preference?: string | null;
};

export async function getInterviewers(): Promise<Interviewer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interviewers")
    .select("id, full_name")
    .order("id");

  if (error) throw error;
  return (data ?? []) as Interviewer[];
}

export async function getInterviewerSlots(interviewerId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interviewer_slots")
    .select("slot_key")
    .eq("interviewer_id", interviewerId);

  if (error) throw error;
  return (data ?? []).map((row) => row.slot_key);
}

export async function getAllAvailability(): Promise<Record<string, string[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interviewer_slots")
    .select("interviewer_id, slot_key");

  if (error) throw error;

  const result: Record<string, string[]> = {};
  for (const row of data ?? []) {
    const id = row.interviewer_id as string;
    if (!result[id]) result[id] = [];
    result[id].push(row.slot_key as string);
  }
  return result;
}

export async function setInterviewerSlots(
  interviewerId: string,
  slotKeys: string[],
): Promise<void> {
  const supabase = createClient();

  const { error: deleteError } = await supabase
    .from("interviewer_slots")
    .delete()
    .eq("interviewer_id", interviewerId);

  if (deleteError) throw deleteError;

  if (slotKeys.length === 0) return;

  const rows = slotKeys.map((slot_key) => ({
    interviewer_id: interviewerId,
    slot_key,
  }));

  const { error: insertError } = await supabase
    .from("interviewer_slots")
    .insert(rows);

  if (insertError) throw insertError;
}

export async function getBookings(): Promise<SchedulerBooking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scheduler_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as SchedulerBooking[];
}

export async function createBooking(input: {
  candidate_name: string;
  candidate_email: string;
  interviewer_a_id: string;
  interviewer_b_id: string;
  slot_key: string;
  first_preference?: string | null;
  second_preference?: string | null;
}): Promise<SchedulerBooking> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scheduler_bookings")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as SchedulerBooking;
}

export function getBookedSlotsForPair(
  bookings: SchedulerBooking[],
  interviewerAId: string,
  interviewerBId: string,
): string[] {
  return bookings
    .filter((booking) => {
      const participants = [booking.interviewer_a_id, booking.interviewer_b_id];
      return (
        participants.includes(interviewerAId) || participants.includes(interviewerBId)
      );
    })
    .map((booking) => booking.slot_key);
}
