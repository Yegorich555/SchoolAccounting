import NavBtn, { NavBtnConfirm } from "@/elements/buttons/navBtn";
import styles from "./theHeader.scss";
import ClassesView from "./classes/view";
import Personal from "./personal";
import Store from "@/helpers/store";
import Search from "./search";
import { ParseClassNumber } from "@/helpers/jsExtend";

export const headerConfig = [
  { text: "Классы", component: ClassesView },
  { text: "Персонал", component: Personal },
];

function download(prefix = "") {
  const data = Store.toString();
  const el = document.createElement("a");
  const blob = new Blob([data], { type: "application/json" });
  const href = window.URL.createObjectURL(blob);
  el.setAttribute("href", href);
  el.setAttribute("download", `schoolAccounting${prefix}`);
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

function onGradeUp() {
  download("_old");

  const classes = Store.classes.items.sort((a, b) => {
    const v1 = a.name;
    const v2 = b.name;
    return v1.localeCompare(v2, undefined, {
      sensitivity: "base",
      ignorePunctuation: true,
      numeric: true,
    });
  });
  classes.forEach(cl => {
    const num = ParseClassNumber(cl.name);
    if (num === 11) {
      Store.classes.remove(cl);
    }
    // eslint-disable-next-line no-param-reassign
    cl.name = cl.name.replace(num, num + 1);
  });
  Store.classes.submit();
  window.location.reload();
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
      <NavBtnConfirm
        onClick={() => onGradeUp()}
        title="Перевести классы на след.год"
        msg="Перевести классы на следующий год? 11-е классы будут удалены!"
      >
        Перевод
      </NavBtnConfirm>
    </header>
  );
}
