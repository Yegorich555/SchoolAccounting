import { useState } from "react";
import memoizeOne from "memoize-one";
import styles from "./view.scss";
import TextInput from "@/elements/inputs/textInput";
import Dropdown from "@/elements/inputs/dropdown";
import WarningBtn from "@/elements/buttons/warningBtn";
import AddEditLearnerBtn from "./editLearnerBtn";
import Store from "@/helpers/store";
import TableLearners from "./tableLearners";

function _getLearners(arr, curClass) {
  return arr.filter(a => a.classId === curClass.id);
}

const getLearners = memoizeOne(_getLearners);

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
          updateId={currentClass.id}
          label="Класс"
          placeholder=""
          name="name"
          defaultModel={currentClass}
          onChange={v => {
            updateClass({ name: v });
          }}
        />
        <Dropdown
          updateId={currentClass.id}
          label="Учитель"
          placeholder=""
          name="teacherId"
          defaultModel={currentClass}
          options={Store.teachers.items.map(v => ({
            text: v.name,
            value: v.id
          }))}
          onChange={v => updateClass({ teacherId: v })}
        />
        <WarningBtn
          onClick={clickRemoveClass}
          messageSuf={`класс ${currentClass.name}`}
        >
          Удалить класс
        </WarningBtn>
      </div>
      <TableLearners
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
