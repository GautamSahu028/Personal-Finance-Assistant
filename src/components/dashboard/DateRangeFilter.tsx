// src/components/dashboard/DateRangeFilter.tsx
"use client";
import { useEffect, useState, useRef } from "react";

interface DateRangeFilterProps {
  value: string;
  onChange: (
    value: string,
    customRange?: { start?: string; end?: string }
  ) => void;
  className?: string;
  compact?: boolean;
}

export function DateRangeFilter({
  value,
  onChange,
  className = "",
  compact = false,
}: DateRangeFilterProps) {
  const [customRange, setCustomRange] = useState<{
    start?: string;
    end?: string;
  }>({});
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value === "custom") onChange("custom", customRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCustomChange = (field: "start" | "end", val: string) => {
    const updated = { ...customRange, [field]: val };
    setCustomRange(updated);
    onChange("custom", updated);
  };

  const options = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "custom", label: "Custom Range" },
  ];

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue, customRange);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (value === "custom" && customRange.start && customRange.end) {
      return `${customRange.start} → ${customRange.end}`;
    }
    return selectedOption?.label || "Select range";
  };

  return (
    <div className={`flex items-center ${className}`} aria-label="Date range">
      {value === "custom" ? (
        // Custom date range inputs
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-all duration-200">
            {/* Calendar icon */}
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-500 flex-shrink-0"
            >
              <path
                d="M7 11h10M7 16h10M8 3v2M16 3v2M5 5h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="flex items-center gap-2">
              <input
                aria-label="Start date"
                type="date"
                value={customRange.start || ""}
                onChange={(e) => handleCustomChange("start", e.target.value)}
                className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 min-w-[110px] cursor-pointer"
              />
              <span className="text-gray-400 text-sm font-medium px-1">→</span>
              <input
                aria-label="End date"
                type="date"
                value={customRange.end || ""}
                onChange={(e) => handleCustomChange("end", e.target.value)}
                className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 min-w-[110px] cursor-pointer"
              />
            </div>
          </div>

          {/* Back to presets button */}
          <button
            onClick={() => onChange("30d", customRange)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
          >
            Back to presets
          </button>
        </div>
      ) : (
        // Custom dropdown for preset ranges
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer min-w-[140px]"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            {/* Calendar icon */}
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-500 flex-shrink-0"
            >
              <path
                d="M7 11h10M7 16h10M8 3v2M16 3v2M5 5h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Current selection */}
            <span
              className={`font-medium text-gray-900 flex-1 text-left ${
                compact ? "text-sm" : "text-sm"
              }`}
            >
              {getDisplayText()}
            </span>

            {/* Dropdown arrow */}
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`text-gray-400 ml-1 flex-shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Custom dropdown menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50 py-1 min-w-[140px]">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                    value === option.value
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
