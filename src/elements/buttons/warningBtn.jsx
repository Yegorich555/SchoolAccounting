/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from "react";
import styles from "./warningBtn.scss";
import BasicBtn from "./basicBtn";
import Modal from "../modal";
import PrimaryBtn from "./primaryBtn";

export default function WarningBtn(props) {
  const [isOpen, setOpen] = useState(false);

  const elProps = Object.assign({}, props);
  delete elProps.messageSuf;

  return (
    <>
      <BasicBtn
        {...elProps}
        className={[props.className, styles.btn]}
        onClick={() => setOpen(true)}
      >
        {props.children}
      </BasicBtn>
      {isOpen ? (
        <Modal onClosed={() => setOpen(false)}>
          <div className={styles.removeDialog}>
            <h2>Удалить {props.messageSuf}?</h2>
            <PrimaryBtn
              onClick={() => {
                setOpen(false);
                props.onClick();
              }}
            >
              Да
            </PrimaryBtn>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
