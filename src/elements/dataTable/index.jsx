/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Component } from "react";
import memoize from "memoize-one";
import DateCompare from "ytech-js-extensions/lib/date/compareByDate";
import styles from "./style.scss";
import Modal from "../modal";
import PrimaryBtn from "../buttons/primaryBtn";
import SecondaryBtn from "../buttons/secondaryBtn";
import WarningBtn from "../buttons/warningBtn";

const askTypes = {
  paste: 1,
  remove: 2
};

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
    // if (value instanceof Date) {
    //   return value.toLocaleDateString();
    // }
    return value;
  },
  sortByKey: (array, sortKey, isSortAsk) => {
    return array.sort((a, b) => {
      const v1 = isSortAsk ? b[sortKey] : a[sortKey];
      const v2 = isSortAsk ? a[sortKey] : b[sortKey];
      if (v1 instanceof Date) {
        return DateCompare(v1, v2);
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

  sort = () =>
    memoize((arr, key, isAsk) =>
      DataTableHelper.sortByKey(arr, key, isAsk)
    ).call(this, this.props.items, this.state.sortKey, this.state.isSortAsk);

  onPaste = e => {
    const clipboardData =
      e.clipboardData ||
      window.clipboardData ||
      (e.originalEvent && e.originalEvent.clipboardData);
    const text = clipboardData.getData("text");
    this.paste(text);
  };

  paste = text => {
    const lines = text
      .split(/[\r\n|\r|\n]/)
      .filter(v => v)
      .map(t => t.split(/[;,\t]/).map(val => val.trim()));

    if (lines.length) {
      const items = lines.map(line => {
        const item = {};
        this.headerKeys.forEach((h, i) => {
          item[h.propName] = line[i];
        });
        return item;
      });
      this.setState({
        isAsk: askTypes.paste,
        pasteItems: items
      });
    }
  };

  onCopy = e => {
    console.warn("copy", e.clipboardData);
  };

  onKeyDown = e => {
    switch (e.keyCode) {
      case 46:
        this.onRemove();
        break;
      default:
        break;
    }
  };

  onRemove = () => {
    if (this.props.onDelete && this.state.currentItem != null) {
      this.props.onDelete(this.state.currentItem);
    }
  };

  closeAskModal = () => {
    this.setState({ isAsk: false, pasteItems: null });
  };

  closeAskModalYes = () => {
    this.props.onPaste && this.props.onPaste(this.state.pasteItems);
    this.closeAskModal();
  };

  render() {
    let body;
    let header;

    const sortedList = this.sort();
    const lst = sortedList;

    const { headerKeys } = this;

    if (lst) {
      header = headerKeys.map(item => {
        const text = DataTableHelper.getHeaderText(item);
        return (
          <th key={item.propName} style={{ minWidth: item.minWidth }}>
            <span className={styles.hide} aria-hidden>
              {text}
            </span>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus  */}
            <div
              role="button"
              onClick={e => {
                this.onHeaderClick(item, e);
              }}
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
          onClick={() => this.onRowClick(item, i)}
          className={this.isRowSelected(item, i) ? styles.selected : null}
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

    const { pasteItems } = this.state;
    return (
      <>
        <div
          ref={el => {
            this.ref = el;
          }}
          className={[styles.tableContainer, this.props.className]}
          onPaste={this.onPaste}
          onKeyDown={this.onKeyDown}
          onCopy={this.onCopy}
          tabIndex="-1"
        >
          <div className={styles.scrollContainer}>
            <table>
              <thead>
                <tr>{header}</tr>
              </thead>
              <tbody>{body}</tbody>
            </table>
          </div>
        </div>
        {this.state.isAsk === askTypes.paste ? (
          <Modal onClosed={this.closeAskModal}>
            <h2>
              {pasteItems.length
                ? `Вы хотите вставить ${pasteItems.length} строк?`
                : ``}
            </h2>
            <DataTable config={this.props.config} items={pasteItems} />
            <PrimaryBtn onClick={this.closeAskModalYes}>Да</PrimaryBtn>
            <SecondaryBtn onClick={this.closeAskModal}>Нет</SecondaryBtn>
          </Modal>
        ) : null}
        <div className={styles.btnGroup}>
          {navigator.clipboard ? (
            <PrimaryBtn
              onClick={() => {
                navigator.clipboard.readText().then(this.paste);
              }}
            >
              Вставить
            </PrimaryBtn>
          ) : null}
          {/* <PrimaryBtn>Копировать</PrimaryBtn> */}
          {/* <WarningBtn onClick={this.onRemove}>Удалить</WarningBtn> */}
        </div>
      </>
    );
  }
}
