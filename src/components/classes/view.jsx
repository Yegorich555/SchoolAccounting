/* eslint-disable no-underscore-dangle */
import { useState } from "react";
import NavBtn from "@/elements/buttons/navBtn";
import styles from "./view.scss";
import ClassSummary from "./classSummary";
import Store from "@/helpers/store";
import ClassOrdinary from "./classOrdinary";
import TableLearners from "./tableLearners";
import ClassCommon from "./classCommon";

function useForceUpdate() {
  const [_v, set] = useState(true);
  return () => set(!_v);
}

export default function ClassesView() {
  const { items: citems } = Store.classes;
  const classes = [
    ...citems,
    {
      id: "added",
      label: "Прибыли",
      render: () => (
        <TableLearners
          items={Store.learners.items
            .filter(v => v.added)
            .map(v => ({
              ...v,
              className: citems.find(c => c.id === v.classId).name,
            }))
            .sort((a, b) => {
              const r = a.className.localeCompare(b.className, undefined, {
                sensitivity: "base",
                ignorePunctuation: true,
                numeric: true,
              });
              if (r === 0) {
                return b.added - a.added;
              }
              return r;
            })}
          showClassName
          isHigherTable
        />
      ),
    },
    {
      id: "removed",
      label: "Выбыли",
      render: () => {
        return (
          <TableLearners
            items={Store.learners.items
              .filter(v => v.removed)
              .map(v => ({
                ...v,
                className: citems.find(c => c.id === v.classId).name,
              }))
              .sort((a, b) => {
                const r = a.className.localeCompare(b.className, undefined, {
                  sensitivity: "base",
                  ignorePunctuation: true,
                  numeric: true,
                });
                if (r === 0) {
                  return b.removed - a.removed;
                }
                return r;
              })}
            isRemoved
            showClassName
            isHigherTable
          />
        );
      },
    },
    { id: "common", label: "Итого", render: () => <ClassCommon /> },
    { id: "sum", label: "Сводная", render: () => <ClassSummary /> },
  ];

  const [currentClass, setItem] = useState(
    classes.find(a => a.id === Store.currentClassName) || Store.classes.items[0]
  );

  const forceUpdate = useForceUpdate();

  function setCurrent(item) {
    setItem(item);
    forceUpdate();
    Store.currentClassName = (item && item.id) || "";
  }

  Store.selectClass = id => setCurrent(classes.find(v => v.id === id));
  // if (!currentClass) {
  //   // prevent empty selection when forceUpdate happens
  //   const cur = Store.currentClassName || Store.classes.items[0];
  //   if (cur) {
  //     setCurrent(cur);
  //   }
  // } else if (
  //   currentClass.id &&
  //   !Store.classes.items.find(v => v.id === currentClass.id)
  // ) {
  //   // was removed
  //   setCurrent(Store.classes.items[0]);
  // }

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
            key={v.id}
            onClick={() => setCurrent(v)}
            aria-selected={currentClass && v.id === currentClass.id}
          >
            {v.label || v.name}
          </NavBtn>
        ))}
      </div>
      {currentClass &&
        (currentClass.render ? (
          currentClass.render()
        ) : (
          <ClassOrdinary currentClass={currentClass} onChanged={forceUpdate} />
        ))}
    </>
  );
}
