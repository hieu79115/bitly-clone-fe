import * as React from "react";
import { format, isValid, startOfToday, setHours, setMinutes, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: string; // Formatted as YYYY-MM-DDTHH:mm or ISO string
  onChange?: (value: string) => void;
  disabled?: boolean;
  minDate?: Date;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
  minDate = startOfToday(),
  placeholder = "Pick expiration date & time",
  className,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isValid(d) ? d : undefined;
  }, [value]);

  const timeString = React.useMemo(() => {
    if (!selectedDate) return "12:00";
    const h = String(selectedDate.getHours()).padStart(2, "0");
    const m = String(selectedDate.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }, [selectedDate]);

  const formatToLocalString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSelectDate = (day: Date | undefined) => {
    if (!day) return;
    const currentH = selectedDate ? selectedDate.getHours() : 12;
    const currentM = selectedDate ? selectedDate.getMinutes() : 0;
    const updated = setMinutes(setHours(day, currentH), currentM);
    onChange?.(formatToLocalString(updated));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = e.target.value;
    if (!timeVal) return;
    const [h, m] = timeVal.split(":").map(Number);
    const base = selectedDate || new Date();
    const updated = setMinutes(setHours(base, h ?? 12), m ?? 0);
    onChange?.(formatToLocalString(updated));
  };

  const handleApplyPreset = (days: number) => {
    const target = addDays(new Date(), days);
    onChange?.(formatToLocalString(target));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-left shadow-xs transition-colors hover:bg-slate-50/80 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          !selectedDate && "text-slate-400",
          className
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="size-3.5 text-primary shrink-0" />
          <span className="truncate">
            {selectedDate
              ? format(selectedDate, "PPP 'at' HH:mm")
              : placeholder}
          </span>
        </div>
        {selectedDate && !disabled && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
            title="Clear date"
          >
            <X className="size-3.5" />
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 border border-slate-200 shadow-xl rounded-xl" align="start">
        <div className="p-3">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Presets:</span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="h-6 text-[11px] px-2 rounded-md"
              onClick={() => handleApplyPreset(1)}
            >
              +1 Day
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="h-6 text-[11px] px-2 rounded-md"
              onClick={() => handleApplyPreset(7)}
            >
              +7 Days
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="h-6 text-[11px] px-2 rounded-md"
              onClick={() => handleApplyPreset(30)}
            >
              +30 Days
            </Button>
          </div>

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            disabled={(date) => (minDate ? date < minDate : false)}
            autoFocus
          />

          {/* Time Picker */}
          <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Clock className="size-3.5 text-primary" />
              <span>Time:</span>
            </div>
            <input
              type="time"
              value={timeString}
              onChange={handleTimeChange}
              className="h-7 px-2 text-xs border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-slate-50"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
