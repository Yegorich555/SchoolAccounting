import { useState } from "react";
import memoizeOne from "memoize-one";
import NavBtn from "@/elements/buttons/navBtn";
import styles from "./classes.scss";
import DataTable from "@/elements/dataTable";
import { DateToString } from "@/helpers/jsExtend";

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

export default function Classes() {
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
      </div>
      {!arrLearners.length ? null : (
        <DataTable
          config={dtConfig}
          items={getLearners(current)}
          onSelected={null}
        />
      )}
    </>
  );
}
