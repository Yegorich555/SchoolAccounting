import { useState } from "react";
import memoizeOne from "memoize-one";
import NavBtn from "@/elements/buttons/navBtn";
import styles from "./view.scss";
import DataTable from "@/elements/dataTable";
import { DateToString } from "@/helpers/jsExtend";
import ClassSummary from "./classSummary";

// const now = new Date(Date.now());

const arrClasses = ["1А", "1Б", "2А"];
const arrLearners = [
  {
    name: "Рудак Мария Ивановна",
    dob: new Date(2011, 10, 1),
    classNum: arrClasses[0]
  },
  {
    name: "Степенюк Игорь Андреевич",
    dob: new Date(2012, 10, 1),
    classNum: arrClasses[0]
  },
  {
    name: "Зыль Игорь Андреевич",
    dob: new Date(2013, 10, 1),
    classNum: arrClasses[1]
  },
  {
    name: "Курик Анна Алексеевна",
    dob: new Date(2013, 10, 2),
    classNum: arrClasses[2]
  }
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
