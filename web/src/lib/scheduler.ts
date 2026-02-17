export const defaultInterviewers = [
  { id: "i-ava", name: "Ava Shah" },
  { id: "i-liam", name: "Liam Chen" },
  { id: "i-noah", name: "Noah Patel" },
  { id: "i-mia", name: "Mia Lopez" },
];

export type InterviewBooking = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  interviewerAId: string;
  interviewerBId: string;
  slotKey: string;
  createdAt: string;
};

export function getSharedSlots(
  interviewerASlots: string[],
  interviewerBSlots: string[],
): string[] {
  const bSet = new Set(interviewerBSlots);
  return interviewerASlots.filter((slot) => bSet.has(slot));
}

export function getBookedSlotsForPair(
  bookings: InterviewBooking[],
  interviewerAId: string,
  interviewerBId: string,
): string[] {
  return bookings
    .filter((booking) => {
      const participants = [booking.interviewerAId, booking.interviewerBId];
      return (
        participants.includes(interviewerAId) || participants.includes(interviewerBId)
      );
    })
    .map((booking) => booking.slotKey);
}

export function getInterviewerName(interviewerId: string): string {
  return (
    defaultInterviewers.find((interviewer) => interviewer.id === interviewerId)?.name ??
    "Unknown interviewer"
  );
}
