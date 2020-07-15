import { Component } from "react";
import ReactDom from "react-dom";
import withClickOutside from "react-click-outside";
import styles from "./modal.scss";
import { arrayFunctions } from "@/helpers/jsExtend";

const ModalRoot = document.getElementById("modal-root");
const IsClosePrevious = false; // if it's true then all modals will be close at the same time

function getSiblings(elem) {
  // Setup siblings array and get the first sibling
  const siblings = [];
  let sibling = elem.parentNode.firstChild;
  // Loop through each sibling and push to the array
  while (sibling) {
    if (
      sibling.nodeType === 1 &&
      sibling !== elem &&
      sibling.tagName !== "SCRIPT" &&
      sibling.tagName !== "NOSCRIPT"
    ) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  return siblings;
}

class ModalBodyInside extends Component {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return (
      <div className={styles.body} role="dialog">
        {this.props.children}
      </div>
    );
  }
}

const ModalBody = withClickOutside(ModalBodyInside);
const ModalsArray = [];

export default class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen != null ? this.props.isOpen : true,
    };
  }

  componentDidMount() {
    // close modal by pressing Esc button
    this.el.addEventListener("keydown", e => e.keyCode === 27 && this.close());

    this.lastFocused = document.activeElement;

    // hide previousModal
    this.prevOpenedModal = ModalsArray.find(item => !item.state.isHidden);
    this.prevOpenedModal && this.prevOpenedModal.hide();
    ModalsArray.push(this);

    // hide main scroll
    if (!this.prevOpenedModal) document.body.style.overflow = "hidden";

    getSiblings(ModalRoot).forEach(item => {
      item.setAttribute("aria-hidden", "true");
    });

    // setFocus to the first active element
    const nested = Array.prototype.slice
      .call(
        this.el.querySelectorAll(
          'select, input, textarea, button, a, [tabindex="0"], [role="button"]'
        )
      )
      // select only visible elements
      .filter(
        item =>
          !!(
            item.offsetWidth ||
            item.offsetHeight ||
            item.getClientRects().length
          )
      );
    const last = this.closeBtnEl; // nested.length && nested[nested.length - 1];
    const first = (nested.length && nested[0]) || last;
    if (first) {
      first.focus(); // autoFocus to the first element according to accessibility for Modal

      first.addEventListener("keydown", e => {
        // focus to the last by pressing shift+tab
        if (e.which === 9 && e.shiftKey) {
          e.preventDefault();
          last.focus();
        }
      });

      last.addEventListener("keydown", e => {
        // focus to the first by pressing tab
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault();
          first.focus();
        }
      });
    }
  }

  componentWillUnmount() {
    this.returnBack();
    arrayFunctions.remove.call(ModalsArray, this);
  }

  returnBack = () => {
    if (this.prevOpenedModal) {
      if (IsClosePrevious) {
        this.prevOpenedModal.close();
      } else {
        this.prevOpenedModal.show(
          () => this.lastFocused && this.lastFocused.focus()
        );
      }
    } else document.body.style.overflow = null;
    this.lastFocused && this.lastFocused.focus();
  };

  close = () => {
    this.setState({ isOpen: false });
    this.returnBack();
    this.props.onClosed && this.props.onClosed();
  };

  hide = () => {
    this.setState({ isHidden: true });
  };

  show = callback => {
    this.setState({ isHidden: false }, callback);
  };

  renderWindow = () => {
    return (
      <div
        className={this.props.className}
        ref={ref => {
          this.el = ref;
        }}
        style={{ display: this.state.isHidden ? "none" : null }}
      >
        <div className={styles.container}>
          <ModalBody
            onClickOutside={() => !this.state.isHidden && this.close()}
          >
            {this.props.children}
            <button
              ref={ref => {
                this.closeBtnEl = ref;
              }}
              type="button"
              aria-label="Close modal"
              className={styles.close}
              onClick={this.close}
            />
          </ModalBody>
        </div>
        <div className={styles.overlay} />
      </div>
    );
  };

  render() {
    if (!this.state.isOpen) return null;
    return ReactDom.createPortal(this.renderWindow(), ModalRoot);
  }
}
