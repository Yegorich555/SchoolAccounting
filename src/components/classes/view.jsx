/* eslint-disable no-underscore-dangle */
import { useState } from "react";
import memoizeOne from "memoize-one";
import NavBtn from "@/elements/buttons/navBtn";
import styles from "./view.scss";
import ClassSummary from "./classSummary";
import DataTableEdit from "@/elements/dataTableEdit";
import Store from "@/helpers/store";
import TextInput from "@/elements/inputs/textInput";
import Dropdown from "@/elements/inputs/dropdown";

const dtConfig = {
  headerKeys: [
    { propName: "name", text: "ФИО" },
    { propName: "dob", text: "Дата рождения" }
  ]
};

function _getLearners(arr, num) {
  return arr.filter(a => a.classNum === num); // TODO fix this
}
const getLearners = memoizeOne(_getLearners);

function useForceUpdate() {
  const [_v, set] = useState(true);
  return () => set(!_v);
}

export default function ClassesView() {
  let classes = Store.classes.items;
  const [currentClass, setCurrent] = useState(classes[0]);
  const [learners, updateLearners] = useState(Store.learners.items);

  const forceUpdate = useForceUpdate();

  function updateClass(obj) {
    classes = Store.classes.update(Object.assign(currentClass, obj));
  }

  return (
    <>
      <div className={styles.box}>
        <NavBtn
          className={styles.addBtn}
          onClick={() => setCurrent(Store.classes.add({ name: "ХХХ" }))}
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
      {currentClass === "Sum" || !currentClass ? null : (
        <>
          <div className={styles.formBox}>
            <TextInput
              label="Класс"
              placeholder=""
              name="name"
              defaultModel={currentClass}
              onChange={v => {
                updateClass({ name: v });
                forceUpdate();
              }}
            />
            <Dropdown
              label="Учитель"
              placeholder=""
              name="teacher"
              defaultModel={currentClass}
              options={[]}
              // onChange={v => updateClass({ teacher: v })}
            />
          </div>
          <DataTableEdit
            config={dtConfig}
            items={getLearners(learners, currentClass)}
            onPaste={v => updateLearners(Store.learners.add(v, currentClass))} // TODO fix this
            onRemove={v => updateLearners(Store.learners.remove(v))}
            // onCopy={onCopy}
            onSelected={null}
          />
        </>
      )}
      {currentClass !== "Sum" ? null : <ClassSummary items={learners} />}
    </>
  );
}
