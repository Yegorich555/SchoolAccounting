import NavBtn from "@/elements/buttons/navBtn";
import styles from "./theHeader.scss";
import ClassesView from "./classes/view";
import Personal from "./personal";
import Store from "@/helpers/store";
import Search from "./search";

export const headerConfig = [
  { text: "Классы", component: ClassesView },
  { text: "Персонал", component: Personal },
];

function download() {
  const data = Store.toString();
  const el = document.createElement("a");
  const blob = new Blob([data], { type: "application/json" });
  const href = window.URL.createObjectURL(blob);
  el.setAttribute("href", href);
  el.setAttribute("download", "schoolAccounting");
  el.click();
}

function upload() {
  const el = document.createElement("input");
  el.type = "file";
  el.accept = "application/json";
  function event(e) {
    el.removeEventListener("change", e);

    const file = (e.srcElement || e.target).files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      Store.parse(reader.result);
      Store.uploaded();
    };
    reader.onerror = ex => {
      console.error("FileReader error", ex);
    };
    reader.readAsText(file);
  }

  el.addEventListener("change", event);
  el.click();
}

export default function TheHeader({ onSelected, selected }) {
  return (
    <header className={styles.box}>
      <Search placeholder="Поиск" />
      {headerConfig.map(v => (
        <NavBtn
          key={v.text}
          onClick={() => onSelected(v)}
          aria-selected={v === selected}
        >
          {v.text}
        </NavBtn>
      ))}
      <NavBtn
        className={styles.downloadBtn}
        title="Сохранить на диск"
        onClick={download}
      />
      <NavBtn
        className={styles.uploadBtn}
        title="Загрузить с диска"
        onClick={upload}
      />
    </header>
  );
}
