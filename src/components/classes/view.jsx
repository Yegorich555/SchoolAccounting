/* eslint-disable no-underscore-dangle */
import { useState } from "react";
import memoizeOne from "memoize-one";
import NavBtn from "@/elements/buttons/navBtn";
import styles from "./view.scss";
import ClassSummary from "./classSummary";
import DataTableEdit from "@/elements/dataTableEdit";
import Store from "@/helpers/store";

// const now = new Date(Date.now());

// const arrClasses = ["1А", "1Б", "2А"];
// const arrLearners = [
//   {
//     name: "Рудак Мария Ивановна",
//     dob: new Date(2011, 10, 1),
//     classNum: arrClasses[0]
//   },
//   {
//     name: "Степенюк Игорь Андреевич",
//     dob: new Date(2012, 10, 1),
//     classNum: arrClasses[0]
//   },
//   {
//     name: "Зыль Игорь Андреевич",
//     dob: new Date(2013, 10, 1),
//     classNum: arrClasses[1]
//   },
//   {
//     name: "Курик Анна Алексеевна",
//     dob: new Date(2013, 10, 2),
//     classNum: arrClasses[2]
//   }
// ];
const dtConfig = {
  headerKeys: [
    { propName: "name", text: "ФИО" },
    { propName: "dob", text: "Дата рождения" }
  ]
};

function _getLearners(arr, num) {
  return arr.filter(a => a.classNum === num);
}
const getLearners = memoizeOne(_getLearners);

export default function ClassesView() {
  const { classes } = Store;
  const [currentClass, setCurrent] = useState(classes[0]);
  const [learners, updateLearners] = useState(Store.learners);

  return (
    <>
      <div className={styles.box}>
        <NavBtn
          className={styles.addBtn}
          onClick={() => setCurrent(Store.addClass("ХХХ"))}
        />
        {classes.map(v => (
          <NavBtn
            key={v.name}
            onClick={() => setCurrent(v)}
            aria-selected={v.name === currentClass.name}
          >
            {v.name}
          </NavBtn>
        ))}
        <NavBtn
          onClick={() => setCurrent("Sum")}
          aria-selected={currentClass === "Sum"}
        >
          Итого
        </NavBtn>
      </div>
      {currentClass === "Sum" || !Store.learners.length ? null : (
        <>
          <div>{currentClass && currentClass.teacher}</div>
          <DataTableEdit
            config={dtConfig}
            items={getLearners(learners, currentClass)}
            onPaste={v => updateLearners(Store.addLearners(v, currentClass))}
            onRemove={v => updateLearners(Store.removeLearner(v))}
            // onCopy={onCopy}
            onSelected={null}
          />
        </>
      )}
      {currentClass !== "Sum" ? null : <ClassSummary items={learners} />}
    </>
  );
}
