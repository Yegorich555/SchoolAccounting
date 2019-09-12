import styles from "./formBoxContainer.scss";

export default function FormBoxContainer({ className, children }) {
  return <div className={[styles.сontainer, className]}>{children}</div>;
}
