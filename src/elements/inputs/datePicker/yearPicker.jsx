import { useState, useEffect } from "react";
import { dateFunctions } from "@/helpers/jsExtend";
import { getYears } from "./helpers";

export default function YearPicker({
  value,
  selected,
  onSelected,
  onCalendarChanged
}) {
  const [curDate, setDate] = useState(selected);

  const yearsObj = getYears(curDate.getFullYear());

  useEffect(() => {
    onCalendarChanged(curDate, yearsObj.years);
  }, [curDate]);

  function onClick(e) {
    const { key } = e.target.dataset;
    switch (key) {
      case undefined:
        break;
      case "prev":
      case "next": {
        const dt = new Date(curDate);
        dt.setDate(1);
        setDate(dateFunctions.addYears.call(dt, key === "next" ? 10 : -10));
        break;
      }
      default: {
        const v = Number(key);
        const dt = new Date(yearsObj.years[v], 0, 1);
        onSelected && onSelected(dt);
        break;
      }
    }
  }

  function getCellStyle(i) {
    if (value && i === value.getFullYear()) {
      return "cur";
    }
    if (i === new Date().getFullYear()) {
      return "now";
    }
    return null;
  }

  const title = `${yearsObj.start} ... ${yearsObj.end}`;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      data-view="year"
      onClick={onClick}
      role="menu"
      aria-label={`Calendar years: ${title}`}
      tabIndex="-1"
    >
      <div>
        <button type="button" data-key="prev" aria-label="Previous years">
          «
        </button>
        <div role="heading" aria-level="2">
          {title}
        </div>
        <button type="button" data-key="next" aria-label="Next years">
          »
        </button>
      </div>
      <div>
        {yearsObj.years.map((v, t) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={`${v}_${t}`}
            type="button"
            data-key={t}
            data-style={getCellStyle(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
