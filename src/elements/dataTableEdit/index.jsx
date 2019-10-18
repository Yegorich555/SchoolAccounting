import styles from "./style.scss";
import Modal from "../modal";
import PrimaryBtn from "../buttons/primaryBtn";
import SecondaryBtn from "../buttons/secondaryBtn";
import DataTable from "../dataTable";

const askTypes = {
  paste: 1,
  remove: 2
};

function getRusSuf(length) {
  switch (length) {
    case 1:
      return "у";
    case 2:
    case 3:
    case 4:
      return "и";
    default:
      return "";
  }
}

export default class DataTableEdit extends DataTable {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: null,
      isSortAsk: false,
      currentItem: null
    };
  }

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

  get insideProps() {
    return {
      onPaste: this.onPaste,
      onKeyDown: this.onKeyDown,
      onCopy: this.onCopy,
      tabIndex: "-1"
    };
  }

  render() {
    const { pasteItems } = this.state;
    return (
      <>
        {super.render()}
        {this.state.isAsk === askTypes.paste ? (
          <Modal onClosed={this.closeAskModal} className={styles.askModal}>
            <h2>
              {pasteItems.length
                ? `Вы хотите вставить ${pasteItems.length} строк${getRusSuf(
                    pasteItems.length
                  )}?`
                : ``}
            </h2>
            <DataTable config={this.props.config} items={pasteItems} />
            <div className={styles.btnGroup}>
              <PrimaryBtn onClick={this.closeAskModalYes}>Да</PrimaryBtn>
              <SecondaryBtn onClick={this.closeAskModal}>Нет</SecondaryBtn>
            </div>
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
        </div>
      </>
    );
  }
}
