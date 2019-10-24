import tryParseJsonDate from "ytech-js-extensions/lib/date/tryParseJSON";
import DropdownBasic from "../dropdownBasic";
import { connectForm } from "@/elements/baseForm";
import styles from "./datePicker.scss";
import DayPicker from "./dayPicker";
import { DateToString, DateMask } from "@/helpers/jsExtend";
import MonthPicker from "./monthPicker";
import YearPicker from "./yearPicker";

const separatorReplacement = /[,. /\\]/g;
const separator = "-";

const openStates = {
  closed: 0,
  day: 1,
  month: 2,
  year: 3
};

class InsideDatePicker extends DropdownBasic {
  constructor(props) {
    super(props);
    this.state.isOpen = openStates.closed;
    this.state.selected = this.defaultValue || new Date();
    this.isString = !!props.isString;
  }

  get defaultValue() {
    const v = super.defaultValue;
    if (typeof v !== "string") {
      return v;
    }

    this.isString = true;

    const dt = tryParseJsonDate(v);
    if (dt instanceof Date) {
      this.isJsonString = true;
      return dt;
    }

    const dt2 = new Date(Date.parse(v));
    if (!dt2) {
      console.error(`DateInput. Impossible to parse defaultValue: [${v}]`);
    }
    return dt2;
  }

  provideValueCallback() {
    const v = this.currentValue;

    if (this.constructor.isEmpty(v)) {
      return undefined;
    }

    if (this.isJsonString) {
      return JSON.stringify(v);
    }
    if (this.isString) {
      return DateToString(v);
    }
    return v;
  }

  parseInputValue = v => {
    const dt = Date.parse(v);
    return (dt && new Date(dt)) || undefined;
  };

  onOpen(values) {
    super.onOpen({ isOpen: openStates.day, ...values });
  }

  onDaySelected = v => {
    this.onClose(v);
  };

  onMonthSelected = v => {
    this.onOpen({ selected: v, isOpen: openStates.day });
  };

  onYearSelected = v => {
    this.onOpen({ selected: v, isOpen: openStates.month });
  };

  onMonthClick = v => {
    this.onOpen({ selected: v, isOpen: openStates.month });
  };

  onYearClick = v => {
    this.onOpen({ selected: v, isOpen: openStates.year });
  };

  get menuClassName() {
    return styles.menu;
  }

  get btnOpenClassName() {
    return styles.btnOpen;
  }

  get placeholder() {
    return this.props.placeholder || `Ожидаемый формат: ${DateMask}`;
  }

  get propsInput() {
    return {
      ...super.propsInput,
      role: "combobox",
      "aria-haspopup": "menu",
      "aria-expanded": !!this.state.isOpen
    };
  }

  get menuProps() {
    return {
      tabIndex: null
      // TODO 'data-helptext':
    };
  }

  onMenuKeyDown = e => {
    // case 37: // it's arrow-left
    // case 39: // it's arrow-right
    // case 38: // it's arrow-up
    // case 40: // it's arrow-down
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      const isUp = e.keyCode === 38;
      const isDown = e.keyCode === 40;
      const isLeft = e.keyCode === 37;
      const isRight = e.keyCode === 39;

      const focused = document.activeElement;
      const keyVal = Number.parseInt(focused.getAttribute("data-key"), 10);

      if (Number.isNaN(keyVal)) {
        return;
      }

      const menuEl = e.currentTarget;

      e.preventDefault();
      e.stopPropagation();

      let nextKeyVal;
      if (isUp || isDown) {
        const itemsInRow = this.state.isOpen === openStates.day ? 7 : 4;
        nextKeyVal = keyVal + (isUp ? -1 : 1) * itemsInRow;
      } else {
        // left|right
        nextKeyVal = (isLeft ? -1 : 1) + keyVal;
      }

      const parent = focused.parentElement;

      if (nextKeyVal < 0) {
        const btn = menuEl.querySelector(`[data-key='prev']`);
        if (!btn) {
          return;
        }

        this._updateFocus = function updateFocus(_dt, items) {
          const next = isLeft
            ? parent.lastChild
            : menuEl.querySelector(`[data-key='${items.length + nextKeyVal}']`);
          next && next.focus();
          delete this._updateFocus;
        };

        btn.click();
        return;
      }

      const nextEl = menuEl.querySelector(`[data-key='${nextKeyVal}']`);
      nextEl && nextEl.focus();

      if (!nextEl && (isDown || isRight)) {
        const btn = menuEl.querySelector(`[data-key='next']`);
        if (!btn) {
          return;
        }

        const dataKey =
          nextKeyVal -
          Number.parseInt(parent.lastChild.getAttribute("data-key"), 10) -
          1;

        this._updateFocus = function updateFocus() {
          const next = isRight
            ? parent.firstChild
            : menuEl.querySelector(`[data-key='${dataKey}']`);
          next && next.focus();
          delete this._updateFocus;
        };

        btn.click();
      }
    }
  };

  onCalendarChanged = (dt, items) => {
    this._updateFocus && this._updateFocus(dt, items);
  };

  getInputText(value, userInputValue) {
    if (userInputValue == null) {
      return DateToString(value) || "";
    }
    if (userInputValue != null) {
      return userInputValue
        .replace(separatorReplacement, separator)
        .replace(new RegExp(`${separator}+`, "g"), separator);
    }
    return userInputValue;
  }

  renderMenu(value) {
    switch (this.state.isOpen) {
      case openStates.day:
        return (
          <DayPicker
            value={value}
            selected={this.state.selected}
            onSelected={this.onDaySelected}
            onMonthClick={this.onMonthClick}
            onCalendarChanged={this.onCalendarChanged}
          />
        );
      case openStates.month:
        return (
          <MonthPicker
            value={value}
            selected={this.state.selected}
            onSelected={this.onMonthSelected}
            onYearClick={this.onYearClick}
            onCalendarChanged={this.onCalendarChanged}
          />
        );
      case openStates.year:
        return (
          <YearPicker
            value={value}
            selected={this.state.selected}
            onSelected={this.onYearSelected}
            onCalendarChanged={this.onCalendarChanged}
          />
        );
      default:
        return null;
    }
  }
}

const DatePicker = connectForm(InsideDatePicker);
export default DatePicker;
