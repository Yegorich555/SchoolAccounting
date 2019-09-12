import Modal from "@/elements/modal";
import styles from "./theError.scss";

export default function TheError({ errorCode, error, onClosed }) {
  return (
    <Modal onClosed={onClosed} className={[styles.modal, styles.isCritical]}>
      <div className={styles.page}>
        <h2 className={styles.subheader}>OUCH!</h2>
        <h3 className={styles.message}>
          {error || (
            <>
              SOMETHING IS NOT QUITE RIGHT
              <br />
              <br />
              We hope to solve it shortly
            </>
          )}
        </h3>
        {errorCode != null ? (
          // eslint-disable-next-line react/jsx-one-expression-per-line
          <div className={styles.errCode}>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Error code: {errorCode === true ? "--" : errorCode}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
