import Store from "@/helpers/store";
import DataTableEdit from "@/elements/dataTableEdit";
import { ParseClassNumber } from "@/helpers/jsExtend";
import styles from "./classCommon.scss";

const dtConfig = {
  headerKeys: [
    { propName: "className", text: "Класс" },
    { propName: "teacherName", text: "Руководитель" },
    { propName: "sumConcurrent", text: "Классов в параллели" },
    { propName: "sumClass", text: "Всего", title: "На начало учебного года" }
  ]
};

function getRows() {
  try {
    const rows = [];
    const classes = Store.classes.items.sort((a, b) => {
      const v1 = a.name;
      const v2 = b.name;
      return v1.localeCompare(v2, undefined, {
        sensitivity: "base",
        ignorePunctuation: true,
        numeric: true
      });
    });
    const teachers = Store.teachers.items;
    const learners = Store.learners.items.filter(v => !v.removed && !v.added);

    let prevNumber = 1;
    classes.forEach(cl => {
      const teacher = teachers.find(a => a.id === cl.teacherId);
      const num = ParseClassNumber(cl.name);

      if (num !== prevNumber) {
        const curRows = rows.filter(r => r.classNum === prevNumber);
        rows.push({
          className: prevNumber,
          sumConcurrent: curRows.length,
          sumClass: curRows.reduce((s, v) => s + v.sumClass, 0)
        });

        if (prevNumber === 4) {
          rows.push({
            teacherName: "Всего I-IV",
            sumClass: rows.reduce(
              (s, v) => (v.sumConcurrent ? s + v.sumClass : s),
              0
            )
          });
        } else if (prevNumber === 9) {
          rows.push({
            teacherName: "Всего V-IX",
            sumClass: rows.reduce(
              (s, v) =>
                v.classNum >= 5 && v.classNum <= 9 ? s + v.sumClass : s,
              0
            )
          });
        }
      }

      prevNumber = num;
      const row = {
        classNum: num,
        className: cl.name,
        teacherName: teacher && teacher.name,
        sumConcurrent: null,
        sumClass: learners.reduce(
          (total, v) => (v.classId === cl.id ? total + 1 : total),
          0
        )
      };
      rows.push(row);
    });

    rows.push({
      teacherName: "Всего X-XI",
      sumClass: rows.reduce(
        (s, v) => (v.classNum >= 10 && v.classNum <= 11 ? s + v.sumClass : s),
        0
      )
    });
    rows.push({
      teacherName: "Всего V-XI",
      sumClass: rows.reduce(
        (s, v) => (v.classNum >= 5 && v.classNum <= 11 ? s + v.sumClass : s),
        0
      )
    });
    rows.push({
      teacherName: "Всего учащихся",
      sumClass: rows.reduce((s, v) => (v.classNum ? s + v.sumClass : s), 0)
    });
    rows.push({
      teacherName: "Всего классов",
      sumConcurrent: classes.length
    });
    return rows;
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

export default function ClassCommon() {
  const rows = getRows();
  if (!rows) {
    return <div>Ошибка в данных</div>;
  }
  return (
    <DataTableEdit className={styles.table} items={rows} config={dtConfig} />
  );
}
