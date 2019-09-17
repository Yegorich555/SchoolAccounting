import NavBtn from "@/elements/buttons/navBtn";
import styles from "./theHeader.scss";

export const headerConfig = [
  { text: "Классы", value: 1 },
  { text: "Персонал", value: 2 }
];

export default function TheHeader({ onSelected, selected }) {
  return (
    <header className={styles.box}>
      {headerConfig.map(v => (
        <NavBtn
          key={v.value}
          onClick={() => onSelected(v)}
          aria-selected={v === selected}
        >
          {v.text}
        </NavBtn>
      ))}
    </header>
  );
}
