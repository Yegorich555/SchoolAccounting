import { useState, useEffect } from "react";
import { monthsShort } from "./config";
import { dateFunctions } from "@/helpers/jsExtend";

export default function MonthPicker({
  value,
  selected,
  onSelected,
  onYearClick,
  onCalendarChanged
}) {
  const [curDate, setDate] = useState(selected);

  useEffect(() => {
    onCalendarChanged(curDate, monthsShort);
  }, [curDate]);

  function onClick(e) {
    const { key } = e.target.dataset;
    switch (key) {
      case "header":
        onYearClick && onYearClick(curDate);
        break;
      case "prev":
      case "next": {
        const dt = new Date(curDate);
        dt.setDate(1);
        setDate(dateFunctions.addYears.call(dt, key === "next" ? 1 : -1));
        break;
      }
      default: {
        const i = Number(key);
        const dt = new Date(curDate.getFullYear(), i, 1);
        onSelected && onSelected(dt);
        break;
      }
    }
  }

  const isEqualValue = value && curDate.getFullYear() === value.getFullYear();

  const now = new Date();
  const isEqualNow = now.getFullYear() === curDate.getFullYear();

  function getCellStyle(i) {
    if (isEqualValue && i === value.getMonth()) {
      return "cur";
    }
    if (isEqualNow && now.getMonth() === i) {
      return "now";
    }
    return null;
  }
  const title = curDate.getFullYear();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      data-view="month"
      onClick={onClick}
      role="menu"
      aria-label={`Calendar months: ${title}`}
      tabIndex="-1"
    >
      <div>
        <button type="button" data-key="prev" aria-label="Previous years">
          «
        </button>
        <button
          type="button"
          data-key="header"
          aria-label="Show calendar years"
        >
          {title}
        </button>
        <button type="button" data-key="next" aria-label="Next years">
          »
        </button>
      </div>
      <div>
        {monthsShort.map((v, t) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={`${v}_${t}`}
            type="button"
            data-key={t}
            data-style={getCellStyle(t)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
