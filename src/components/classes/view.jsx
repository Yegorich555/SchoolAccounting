import { useState } from "react";
import memoizeOne from "memoize-one";
import NavBtn from "@/elements/buttons/navBtn";
import styles from "./view.scss";
import DataTable from "@/elements/dataTable";
import { DateToString } from "@/helpers/jsExtend";
import ClassSummary from "./classSummary";

const now = new Date(Date.now());

const arrClasses = ["1А", "1Б"];
const arrLearners = [
  { name: "Name 1", dob: now, classNum: arrClasses[0] },
  { name: "Name 2", dob: now, classNum: arrClasses[0] },
  { name: "Name 3", dob: now, classNum: arrClasses[0] }
];
const dtConfig = {
  headerKeys: [
    { propName: "name", text: "ФИО" },
    { propName: "dob", text: "Дата рождения", formatFn: DateToString }
  ]
};

function getLearners(classNum) {
  return memoizeOne((arr, num) => {
    return arr.filter(a => a.classNum === num);
  }).call(this, arrLearners, classNum);
}

export default function ClassesView() {
  const [current, setCurrent] = useState(arrClasses[0]);

  return (
    <>
      <div className={styles.box}>
        {arrClasses.map(v => (
          <NavBtn
            key={v}
            onClick={() => setCurrent(v)}
            aria-selected={v === current}
          >
            {v}
          </NavBtn>
        ))}
        <NavBtn
          onClick={() => setCurrent("Sum")}
          aria-selected={current === "Sum"}
        >
          Итого
        </NavBtn>
      </div>
      {current === "Sum" || !arrLearners.length ? null : (
        <DataTable
          config={dtConfig}
          items={getLearners(current)}
          onSelected={null}
        />
      )}
      {current !== "Sum" ? null : <ClassSummary items={arrLearners} />}
    </>
  );
}
