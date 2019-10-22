/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from "react";
import styles from "./warningBtn.scss";
import BasicBtn from "./basicBtn";
import Modal from "../modal";

export default function WarningBtn(props) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <BasicBtn
        {...props}
        className={[props.className, styles.btn]}
        onClick={() => setOpen(true)}
      >
        {props.children}
      </BasicBtn>{" "}
      {isOpen ? (
        <Modal onClosed={() => setOpen(false)}>
          <div className={styles.removeDialog}>
            <h2>Удалить {props.messageSuf}?</h2>
            <WarningBtn onClick={props.onClick}>Да</WarningBtn>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
