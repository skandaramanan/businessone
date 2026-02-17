"use client";

import { useEffect, useMemo, useState } from "react";
import { buildSlotKey, getTimeSlots } from "@/lib/availability/slots";
import { formatWeekDate, getWeekDates } from "@/lib/availability/weekConfig";

type WeekAvailabilityGridProps = {
  selectedSlots: string[];
  onChangeSlots?: (slots: string[]) => void;
  selectableSlots?: string[];
  blockedSlots?: string[];
  blockedSlotLabels?: Record<string, string>;
  activeSlotKey?: string;
  onSelectSlot?: (slotKey: string) => void;
  mode?: "availability" | "booking";
};

export function WeekAvailabilityGrid({
  selectedSlots,
  onChangeSlots,
  selectableSlots,
  blockedSlots,
  blockedSlotLabels,
  activeSlotKey,
  onSelectSlot,
  mode = "availability",
}: WeekAvailabilityGridProps) {
  const days = useMemo(() => getWeekDates(), []);
  const timeSlots = useMemo(() => getTimeSlots(), []);
  const selectedSet = useMemo(() => new Set(selectedSlots), [selectedSlots]);
  const selectableSet = useMemo(
    () => (selectableSlots ? new Set(selectableSlots) : null),
    [selectableSlots],
  );
  const blockedSet = useMemo(
    () => (blockedSlots ? new Set(blockedSlots) : null),
    [blockedSlots],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "remove">("add");

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, []);

  function updateSlot(slotKey: string, mode: "add" | "remove") {
    if (!onChangeSlots) return;
    const next = new Set(selectedSet);
    if (mode === "add") next.add(slotKey);
    if (mode === "remove") next.delete(slotKey);
    onChangeSlots(Array.from(next));
  }

  function startDrag(slotKey: string) {
    if (!onChangeSlots) return;
    const mode = selectedSet.has(slotKey) ? "remove" : "add";
    setDragMode(mode);
    setIsDragging(true);
    updateSlot(slotKey, mode);
  }

  function dragOver(slotKey: string) {
    if (!isDragging || !onChangeSlots) return;
    updateSlot(slotKey, dragMode);
  }

  return (
    <div className="overflow-auto rounded-2xl border border-stone-200 bg-white">
      <div
        className="grid min-w-[700px]"
        style={{ gridTemplateColumns: `72px repeat(${days.length}, minmax(80px, 1fr))` }}
      >
        <div className="sticky left-0 top-0 z-20 border-b border-r border-stone-200 bg-stone-100 p-2 text-xs font-semibold uppercase tracking-wide text-stone-600">
          Time
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="sticky top-0 z-10 border-b border-r border-stone-200 bg-stone-100 p-2 text-center text-xs font-semibold text-stone-700"
          >
            {formatWeekDate(day)}
          </div>
        ))}

        {timeSlots.map((time) => (
          <div key={time} className="contents">
            <div className="sticky left-0 z-10 border-b border-r border-stone-200 bg-stone-50 px-2 py-1.5 text-xs text-stone-600">
              {time}
            </div>
            {days.map((day) => {
              const slotKey = buildSlotKey(day, time);
              const isSelected = selectedSet.has(slotKey);
              const isBlocked = blockedSet ? blockedSet.has(slotKey) : false;
              const isSelectable = selectableSet ? selectableSet.has(slotKey) : true;
              const isActive = activeSlotKey === slotKey;
              const canDragEdit =
                mode === "availability" && isSelectable && !isBlocked && Boolean(onChangeSlots);
              const canClickSelect = mode === "booking" && isSelectable && !isBlocked;
              const blockedLabel = isBlocked && blockedSlotLabels?.[slotKey];

              const cellClass = [
                "h-9 min-h-9 border-b border-r border-stone-200 transition-colors text-left",
                canDragEdit || canClickSelect ? "cursor-pointer" : "cursor-not-allowed",
                mode === "availability" && isSelected
                  ? "bg-stone-900 text-white"
                  : mode === "booking"
                    ? isBlocked
                      ? "bg-stone-400 text-stone-800"
                      : isActive
                        ? "bg-[#FA951B] text-white"
                        : isSelectable
                          ? "bg-stone-900 text-white hover:bg-stone-800"
                          : "bg-stone-100 text-stone-400"
                    : "bg-stone-50",
                !isSelected && !isBlocked && mode === "availability" ? "hover:bg-stone-100" : "",
              ].join(" ");

              return (
                <button
                  key={slotKey}
                  type="button"
                  className={cellClass}
                  disabled={!canDragEdit && !canClickSelect}
                  onMouseDown={() => {
                    if (canDragEdit) startDrag(slotKey);
                  }}
                  onMouseEnter={() => {
                    if (canDragEdit) dragOver(slotKey);
                  }}
                  onClick={() => {
                    if (onSelectSlot && canClickSelect) onSelectSlot(slotKey);
                  }}
                  title={
                    isBlocked
                      ? blockedLabel
                        ? `Booked: ${blockedLabel}`
                        : "Booked out for both interviewers"
                      : undefined
                  }
                  aria-label={`${day} ${time}`}
                >
                  {isBlocked && blockedLabel ? (
                    <span className="truncate block text-[10px] leading-tight px-0.5" title={blockedLabel}>
                      {blockedLabel}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
