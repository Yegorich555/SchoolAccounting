import NavBtn from "@/elements/buttons/navBtn";
import styles from "./theHeader.scss";
import ClassesView from "./classes/view";
import Personal from "./personal";

export const headerConfig = [
  { text: "Классы", component: ClassesView },
  { text: "Персонал", component: Personal }
];

export default function TheHeader({ onSelected, selected }) {
  return (
    <header className={styles.box}>
      {headerConfig.map(v => (
        <NavBtn
          key={v.text}
          onClick={() => onSelected(v)}
          aria-selected={v === selected}
        >
          {v.text}
        </NavBtn>
      ))}
    </header>
  );
}
