export function getMonthInformation(year, month, isMondayFirst = true) {
  // eslint-disable-next-line no-param-reassign
  month += 1; /* Expects month to be in 1-12 index based. */

  /* Create a date. Usually month in JS is 0-11 index based but here is a hack that can be used to calculate total days in a month */
  const date = new Date(year, month, 0);
  /* Get the total number of days in a month */
  const result = {
    totalDays: date.getDate() /* End day of month. Like Saturday is end of month etc. 0 means Sunday and 6 means Saturday */,
    endDay: date.getDay(),
    days: []
  };

  date.setDate(isMondayFirst ? 0 : 1);

  /* Start day of month. Like Saturday is start of month etc. 0 means Sunday and 6 means Saturday */
  result.startDay = date.getDay();

  /* Here we generate days for 35 or 42 cells of a Month */
  /* Here we calculate previous month dates for placeholders if starting day is not Sunday */
  let prevMonthDays = 0;
  if (result.startDay !== 0) {
    prevMonthDays = new Date(year, month - 1, 0).getDate() - result.startDay;
  }

  /* This is placeholder for next month. If month does not end on Saturday, placeholders for next days to fill other cells */
  let count = 0;
  const totalWeeks = Math.ceil((result.totalDays + result.startDay) / 7);
  for (let i = 0; i < totalWeeks * 7; i++) {
    const day = {};
    /* Previous month dates (if month does not start on Sunday) */ if (
      i < result.startDay
    ) {
      prevMonthDays += 1;
      day.date = prevMonthDays;
      /* Next month dates (if month does not end on Saturday) */
    } else if (i > result.totalDays + (result.startDay - 1)) {
      count += 1;
      day.date = count;
      /* Current month dates. */
    } else {
      day.date = i - result.startDay + 1;
    }
    result.days[result.days.length] = day.date;
  }
  return result;
}

export function getYears(year) {
  const start = parseInt(year / 10, 10) * 10;
  const end = start + 9;
  const result = {
    start: start - 1,
    end: end + 1,
    years: []
  };

  let cur = result.start - 1;
  while (++cur <= result.end) {
    result.years.push(cur);
  }
  return result;
}
