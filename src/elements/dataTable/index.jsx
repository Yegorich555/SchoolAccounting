import { Component } from "react";
import memoize from "memoize-one";
import DateCompare from "ytech-js-extensions/lib/date/compareByDate";
import styles from "./style.scss";
import { DateToString } from "@/helpers/jsExtend";

export const DataTableHelper = {
  toUpperCaseFirst: v => v.charAt(0).toUpperCase() + v.slice(1),
  getHeaderText: header =>
    header.text || DataTableHelper.toUpperCaseFirst(header.propName),
  getCellValue: (headerKey, value) => {
    if (value == null) return value;
    if (Array.isArray(value) && headerKey.propKey) {
      return value.map(iv => iv && iv[headerKey.propKey]);
    }
    if (headerKey.propKey) return value[headerKey.propKey];
    if (headerKey.type === "email")
      return <a href={`mailto:${value}`}>{value}</a>;
    if (value instanceof Date) {
      return DateToString(value);
    }
    return value;
  },
  sortByKey: (array, sortKey, isSortAsk) => {
    return array.sort((a, b) => {
      const v1 = isSortAsk ? b[sortKey] : a[sortKey];
      const v2 = isSortAsk ? a[sortKey] : b[sortKey];
      if (v1 instanceof Date) {
        return DateCompare(v1, v2);
      }
      if (typeof v1 === "string") {
        // natural sorting can be different for browsers: https://stackoverflow.com/questions/51165/how-to-sort-strings-in-javascript
        return v1.localeCompare(v2, undefined, {
          sensitivity: "base",
          ignorePunctuation: true,
          numeric: true
        });
      }
      return (v1 > v2) - (v1 < v2);
    });
  },
  isEqual: (v1, v2) => v1 === v2
};

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: null,
      isSortAsk: false,
      currentItem: null
    };
  }

  get headerKeys() {
    return (
      this.props.config &&
      this.props.config.headerKeys &&
      this.props.config.headerKeys.filter(h => !h.onlyExport)
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get insideProps() {
    return null;
  }

  select = item => {
    this.setState({ currentItem: item });
  };

  onRowClick = item => {
    this.select(item);
    this.props.onSelected && this.props.onSelected(item);
  };

  renderValue = (headerKey, value, item) => {
    if (headerKey.formatFn) {
      return headerKey.formatFn(value, item);
    }

    return DataTableHelper.getCellValue(headerKey, value);
  };

  isRowSelected = item => DataTableHelper.isEqual(this.state.currentItem, item);

  onHeaderClick = item => {
    const { isSortAsk, sortKey: prevSortKey } = this.state;
    this.setState({
      sortKey: item.propName,
      isSortAsk: prevSortKey === item.propName ? !isSortAsk : false
    });
  };

  onTableClick = e => {
    const { header } = e.target.dataset;
    if (header != null) {
      this.onHeaderClick(this.headerKeys[Number.parseInt(header, 10)]);
    } else {
      const { row } = e.target.closest("tr").dataset;
      if (row != null) {
        this.onRowClick(this.sort()[Number.parseInt(row, 10)]);
      }
    }
  };

  sort = () =>
    memoize((arr, key, isAsk) =>
      DataTableHelper.sortByKey(arr, key, isAsk)
    ).call(this, this.props.items, this.state.sortKey, this.state.isSortAsk);

  render() {
    let body;
    let header;

    const sortedList = this.sort();
    const lst = sortedList;

    const { headerKeys } = this;

    if (lst) {
      header = headerKeys.map((item, i) => {
        const text = DataTableHelper.getHeaderText(item);
        return (
          <th key={item.propName} style={{ minWidth: item.minWidth }}>
            <span className={styles.hide} aria-hidden>
              {text}
            </span>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus  */}
            <div
              role="button"
              data-header={i}
              className={
                this.state.sortKey === item.propName
                  ? [
                      styles.currentSort,
                      this.state.isSortAsk ? styles.sortAsc : null
                    ]
                  : null
              }
            >
              {text}
            </div>
          </th>
        );
      });
      body = lst.map((item, i) => (
        <tr
          // eslint-disable-next-line react/no-array-index-key
          key={`${i}_${item[headerKeys[0]]}`} // TODO improve logic because it can provide bugs
          className={this.isRowSelected(item, i) ? styles.selected : null}
          data-row={i}
        >
          {headerKeys.map(hItem => {
            const defValue = item[hItem.propName];
            const value = this.renderValue(hItem, defValue, item);
            return (
              <td
                key={hItem.propName}
                title={hItem.maxWidth ? defValue : null}
                style={{ maxWidth: hItem.maxWidth }}
              >
                {value}
              </td>
            );
          })}
        </tr>
      ));
    }

    return (
      <div className={styles.centerContainer}>
        <div className={styles.fixBorder} {...this.insideProps}>
          <div className={[styles.tableContainer, this.props.className]}>
            <div>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
              <table
                data-copy
                onClick={this.onTableClick}
                ref={el => {
                  this.refEl = el;
                }}
              >
                <thead>
                  <tr>{header}</tr>
                </thead>
                <tbody>{body}</tbody>
              </table>
            </div>
          </div>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <div className={styles.footer}>
            {(this.props.getFooter && this.props.getFooter(lst)) ||
              `Всего: ${lst.length}`}
          </div>
        </div>
      </div>
    );
  }
}
