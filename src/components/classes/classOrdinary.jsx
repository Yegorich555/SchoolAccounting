import { useState } from "react";
import memoizeOne from "memoize-one";
import styles from "./view.scss";
import TextInput from "@/elements/inputs/textInput";
import Dropdown from "@/elements/inputs/dropdown";
import WarningBtn from "@/elements/buttons/warningBtn";
import AddEditLearnerBtn from "./editLearnerBtn";
import Store from "@/helpers/store";
import DataTableEdit from "@/elements/dataTableEdit";
import { DateToString } from "@/helpers/jsExtend";

function _getLearners(arr, curClass) {
  return arr.filter(a => a.classId === curClass.id);
}

const getLearners = memoizeOne(_getLearners);

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

export default function ClassOrdinary({ currentClass, onChanged }) {
  const [learners, updateLearners] = useState(Store.learners.items);

  function updateClass(obj) {
    Store.classes.update(Object.assign(currentClass, obj));
    onChanged();
  }

  function clickRemoveClass() {
    Store.classes.remove(currentClass);
    onChanged();
  }

  return (
    <>
      <div className={styles.formBox}>
        <TextInput
          label="Класс"
          placeholder=""
          name="name"
          defaultModel={currentClass}
          onChange={v => {
            updateClass({ name: v });
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
        className={styles.table}
        config={dtConfig}
        items={getLearners(learners, currentClass)}
        addBtn={() => (
          <AddEditLearnerBtn
            isAdd
            onSubmit={v => updateLearners(Store.learners.add(v, currentClass))}
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
        getFooter={lst =>
          [
            // prettier-ignore
            `В классе: ${lst.reduce((total, v) => (!v.removed ? total + 1 : total), 0)}`,
            // prettier-ignore
            `Выбыло: ${lst.reduce((total, v) => (v.removed ? total + 1 : total), 0)}`,
            // prettier-ignore
            `Прибыло: ${lst.reduce((total, v) => (v.added ? total + 1 : total), 0)}`,
            `Всего: ${lst.length}`
          ].join("\t|\t")
        }
        // onSelected={null}
      />
    </>
  );
}
