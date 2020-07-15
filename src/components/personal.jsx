import { useState } from "react";
import DataTableEdit from "@/elements/dataTableEdit";
import Store from "@/helpers/store";
import styles from "./personal.scss";
import EditPersonBtn from "./editPersonBtn";

const dtConfig = {
  headerKeys: [
    { propName: "name", text: "ФИО" },
    { propName: "post", text: "Должность" },
    // { propName: "rate", text: "Ставка" },
    // { propName: "multi", text: "Совместитель" },
    // { propName: "dob", text: "Дата рождения" },
    // { propName: "addr", text: "Адрес" },
    // { propName: "phone", text: "Телефон" },
    // {
    //   propName: "category",
    //   text: "Категория",
    //   title: "Категория (дата присвоения/подтверждения)"
    // },

    // { propName: "education", text: "Образование" },
    // { propName: "specialty", text: "Специальность" },
    // { propName: "university", text: "ВУЗ" },
    // { propName: "universityDateEnd", text: "Год окончания ВУЗа" },
    // { propName: "expTotal", text: "СР общий", title: "на 01.09" },
    // { propName: "expEducation", text: "СР в образовании", title: "на 01.09" },
    // { propName: "expTeacher", text: "СР педагогом", title: "на 01.09" },
    // { propName: "expCurrent", text: "СР на должности", title: "на 01.09" },
    // { propName: "startWorkDate", text: "Дата приема" },
    // { propName: "vacationPeriod", text: "Период на отпуск" },
    // { propName: "bonus", text: "Надбавка по контракту" },
    // {
    //   propName: "dateEndContract",
    //   text: "Срок контракта",
    //   title: "Срок контракта до"
    // },
    // {
    //   propName: "dateEndMedicine",
    //   text: "Мед справка",
    //   title: "Мед справка до"
    // },
    // { propName: "fluorography", text: "Флюорография" },
    // { propName: "numberId", text: "Личный номер" },
    // { propName: "numberPassport", text: "Номер паспорта" },
    // { propName: "datePassport", text: "Дата выдачи", title: "паспорта" },
    // { propName: "whomPassport", text: "Кем выдан", title: "паспорт" }
  ],
};

function useForceUpdate() {
  const [_v, set] = useState(true);
  return () => set(!_v);
}

export default function Personal() {
  const { items } = Store.teachers;
  const forceUpdate = useForceUpdate();
  function update() {
    forceUpdate();
  }

  return (
    <DataTableEdit
      config={dtConfig}
      items={items}
      className={styles.table}
      addBtn={() => (
        <EditPersonBtn isAdd onSubmit={v => update(Store.teachers.add(v))} />
      )}
      onPaste={v => update(v.forEach(a => Store.teachers.add(a)))}
      removeBtn={item => (
        <EditPersonBtn
          item={item}
          onSubmit={v => {
            update(Store.teachers.update(v));
          }}
        />
      )}
    />
  );
}
