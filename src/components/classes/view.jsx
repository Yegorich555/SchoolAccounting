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
import WarningBtn from "@/elements/buttons/warningBtn";
import AddEditLearnerBtn from "./editLearnerBtn";

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
    { propName: "dob", text: "Дата рождения", pasteFormat: dateFromExcel },
    { propName: "removed", text: "Выбыл" },
    { propName: "added", text: "Прибыл" }
  ]
};

function _getLearners(arr, curClass) {
  return arr.filter(a => a.classId === curClass.id);
}
const getLearners = memoizeOne(_getLearners);

function useForceUpdate() {
  const [_v, set] = useState(true);
  return () => set(!_v);
}

export default function ClassesView() {
  let classes = Store.classes.items;
  const [currentClass, setItem] = useState(
    classes.find(a => a.name === Store.currentPath) ||
      (Store.currentPath === "Sum" && { name: "Sum" }) ||
      classes[0]
  );

  function setCurrent(item) {
    setItem(item);
    Store.currentPath = (item && item.name) || "";
  }

  const [learners, updateLearners] = useState(Store.learners.items);

  const forceUpdate = useForceUpdate();

  function updateClass(obj) {
    classes = Store.classes.update(Object.assign(currentClass, obj));
  }

  function clickRemoveClass() {
    const arr = Store.classes.remove(currentClass);
    setCurrent(arr[0]);
  }

  if (!currentClass) {
    // prevent empty selection when forceUpdate happens
    const cur = Store.currentPath || Store.classes.items[0];
    if (cur) {
      setCurrent(cur);
    }
  }

  return (
    <>
      <div className={styles.box}>
        <NavBtn
          className={styles.addBtn}
          title="Добавить класс"
          onClick={() => setCurrent(Store.classes.add({ name: "ХХХ" }))}
        />
        {classes.map(v => (
          <NavBtn
            key={v.name}
            onClick={() => setCurrent(v)}
            aria-selected={currentClass && v.name === currentClass.name}
          >
            {v.name}
          </NavBtn>
        ))}
        <NavBtn
          onClick={() => setCurrent({ name: "Sum" })}
          aria-selected={currentClass && currentClass.name === "Sum"}
        >
          Итого
        </NavBtn>
      </div>
      {!currentClass || currentClass.name === "Sum" ? null : (
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
            <WarningBtn
              onClick={clickRemoveClass}
              messageSuf={`класс ${currentClass.name}`}
            >
              Удалить класс
            </WarningBtn>
          </div>
          <DataTableEdit
            config={dtConfig}
            items={getLearners(learners, currentClass)}
            addBtn={() => (
              <AddEditLearnerBtn
                isAdd
                onSubmit={v =>
                  updateLearners(Store.learners.add(v, currentClass))
                }
              />
            )}
            onPaste={v => updateLearners(Store.learners.add(v, currentClass))}
            removeBtn={item => (
              <AddEditLearnerBtn
                item={item}
                onSubmit={v => {
                  Store.learners.update(v);
                  updateLearners(Store.learners.items);
                }}
              />
            )}
            // onSelected={null}
          />
        </>
      )}
      {!currentClass || currentClass.name !== "Sum" ? null : <ClassSummary />}
    </>
  );
}
