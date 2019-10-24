import { useRef } from "react";
import BaseForm from "@/elements/baseForm";
import Modal from "@/elements/modal";
import styles from "./modalForm.scss";

export default function ModalForm(props) {
  const modal = useRef(null);
  function onValidSubmit(model) {
    if (props.onValidSubmit) {
      const maybePromise = props.onValidSubmit(model);
      if (maybePromise && maybePromise.then) {
        maybePromise.finally(() => {
          modal.current && modal.current.close();
        });
      } else {
        modal.current && modal.current.close();
      }
    }
    return props.onValidSubmit;
  }

  return (
    <Modal ref={modal} onClosed={props.onClosed}>
      <BaseForm
        {...props}
        className={[styles.modalForm, props.className]}
        onValidSubmit={onValidSubmit}
      />
    </Modal>
  );
}
