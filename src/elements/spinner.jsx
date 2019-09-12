import styles from "./spinner.scss";

export default function Spinner({ style, className, overflow }) {
  return (
    <>
      <div style={style} className={[styles.spinner, className]} />
      {overflow ? <div style={style} className={styles.overflow} /> : null}
    </>
  );
}
