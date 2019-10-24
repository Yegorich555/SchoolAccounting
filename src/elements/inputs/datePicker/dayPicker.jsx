import { useState, useEffect } from "react";
import { months, daysShort } from "./config";
import { getMonthInformation } from "./helpers";
import { dateFunctions } from "@/helpers/jsExtend";

export default function DayPicker({
  value,
  selected,
  onSelected,
  onMonthClick,
  onCalendarChanged
}) {
  const [curDate, setDate] = useState(selected);

  const { days } = getMonthInformation(
    curDate.getFullYear(),
    curDate.getMonth()
  );

  useEffect(() => {
    onCalendarChanged(curDate, days);
  }, [curDate]);

  function onClick(e) {
    const { key, style } = e.target.dataset;
    switch (key) {
      case undefined:
        break;
      case "header":
        onMonthClick(curDate);
        break;
      case "prev":
      case "next": {
        const dt = new Date(curDate);
        dt.setDate(1);
        setDate(dateFunctions.addMonths.call(dt, key === "next" ? 1 : -1));
        break;
      }
      default: {
        const day = days[Number(key)];
        const result = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
        if (style === "prev") {
          // prev month
          dateFunctions.addMonths.call(result, -1).setDate(day);
        } else if (style === "next") {
          // next month
          dateFunctions.addMonths.call(result, 1).setDate(day);
        } else {
          result.setDate(day);
        }

        onSelected(result);
        break;
      }
    }
  }

  const isEqualValue =
    value &&
    curDate.getFullYear() === value.getFullYear() &&
    curDate.getMonth() === value.getMonth();

  const now = new Date();
  const isEqualNow =
    now.getFullYear() === curDate.getFullYear() &&
    now.getMonth() === curDate.getMonth();

  function getCellStyle(i) {
    const day = days[i];
    if (day >= 25 && i <= 6) {
      return "prev";
    }
    if (day < 8 && i >= days.length - 7) {
      return "next";
    }
    if (isEqualValue && day === value.getDate()) {
      // TODO aria-current
      return "cur";
    }

    if (isEqualNow && now.getDate() === day) {
      return "now";
    }
    return null;
  }
  const title = `${months[curDate.getMonth()]} ${curDate.getFullYear()}`;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      data-view="day"
      onClick={onClick}
      role="menu"
      aria-label={`Calendar days: ${title}`}
      tabIndex="-1"
    >
      <div>
        <button type="button" data-key="prev" aria-label="Previous month">
          «
        </button>
        <button
          type="button"
          data-key="header"
          aria-label="Show calendar months"
        >
          {title}
        </button>
        <button type="button" data-key="next" aria-label="Next month">
          »
        </button>
      </div>
      <div>
        {daysShort.map(v => (
          <div key={v}>{v}</div>
        ))}
      </div>
      <div>
        {days.map((v, t) => (
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
