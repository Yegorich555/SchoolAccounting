/* eslint-disable no-underscore-dangle */
import { useState } from "react";

import NavBtn from "@/elements/buttons/navBtn";
import styles from "./view.scss";
import ClassSummary from "./classSummary";
import Store from "@/helpers/store";
import ClassOrdinary from "./classOrdinary";
import TableLearners from "./tableLearners";

function useForceUpdate() {
  const [_v, set] = useState(true);
  return () => set(!_v);
}

export default function ClassesView() {
  const classes = [
    ...Store.classes.items,
    {
      name: "Added",
      label: "Прибыли",
      render: () => (
        <TableLearners items={Store.learners.items.filter(v => v.added)} />
      )
    },
    {
      name: "Removed",
      label: "Выбыли",
      render: () => (
        <TableLearners items={Store.learners.items.filter(v => v.removed)} />
      )
    },
    // { name: "Common", label: "Сводная" },
    { name: "Sum", label: "Итого", render: () => <ClassSummary /> }
  ];

  const [currentClass, setItem] = useState(
    classes.find(a => a.name === Store.currentPath) || Store.classes.items[0]
  );

  const forceUpdate = useForceUpdate();

  function setCurrent(item) {
    setItem(item);
    Store.currentPath = (item && item.name) || "";
  }

  if (!currentClass) {
    // prevent empty selection when forceUpdate happens
    const cur = Store.currentPath || Store.classes.items[0];
    if (cur) {
      setCurrent(cur);
    }
  } else if (
    currentClass.id &&
    !Store.classes.items.find(v => v.id === currentClass.id)
  ) {
    // was removed
    setCurrent(Store.classes.items[0]);
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
            {v.label || v.name}
          </NavBtn>
        ))}
      </div>
      {currentClass &&
        ((currentClass.render && currentClass.render()) || (
          <ClassOrdinary currentClass={currentClass} onChanged={forceUpdate} />
        ))}
    </>
  );
}
