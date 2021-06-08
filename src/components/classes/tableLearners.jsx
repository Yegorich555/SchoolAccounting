import styles from "./view.scss";
import DataTableEdit from "@/elements/dataTableEdit";
import { DateToString } from "@/helpers/jsExtend";

function dateFromExcel(v) {
  if (!v || typeof v !== "string") return v;
  if (/^(\d{2})[-.](\d{2})[-.](\d{2,4})/.test(v)) {
    const dtArr = v.split(/[-.]/).map(a => Number.parseInt(a, 10));
    const dt = new Date(
      dtArr[2] < 100 ? 2000 + dtArr[2] : dtArr[2],
      dtArr[1] - 1,
      dtArr[0]
    );
    if (Number.isNaN(dt)) return "";
    return dt;
  }
  const dt = Date.parse(v);
  if (Number.isNaN(dt) || dt < 0) return "";
  return new Date(dt);
}

const dtConfig = {
  headerKeys: [
    { propName: "name", text: "ФИО" },
    {
      propName: "dob",
      text: "Дата рождения",
      pasteFormat: dateFromExcel,
      formatFn: v => DateToString(v) || `???${v}`
    },
    { propName: "removed", text: "Выбыл" },
    { propName: "added", text: "Прибыл" }
  ]
};

export default function TableLearners(props) {
  let cfg = dtConfig;
  if (props.showClassName) {
    cfg = JSON.parse(JSON.stringify(dtConfig));
    cfg.headerKeys.push({ propName: "className", text: "Класс" });
  }

  return (
    <DataTableEdit
      className={[
        styles.table,
        props.isHigherTable ? styles.tableHigher : null
      ]}
      getRowClassName={v => !props.isRemoved && v.removed && styles.removed}
      config={cfg}
      {...props}
      ref={el => {
        props.refTable && props.refTable(el);
      }}
    />
  );
}
