import React from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file

export function CalendarDateRangePicker({ dateRange, onDateChange }) {
  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    onDateChange({ start: startDate, end: endDate });
  };

  return (
    <div className="relative">
      <DateRangePicker
        ranges={[
          {
            startDate: dateRange.start,
            endDate: dateRange.end,
            key: "selection",
          },
        ]}
        onChange={handleSelect}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        direction="horizontal"
        rangeColors={["#4CAF50"]}
      />
    </div>
  );
}