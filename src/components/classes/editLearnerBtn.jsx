/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from "react";
import SecondaryBtn from "@/elements/buttons/secondaryBtn";
import ModalForm from "@/elements/baseForm/modalForm";
import TextInput from "@/elements/inputs/textInput";
import DatePicker from "@/elements/inputs/datePicker/datePicker";
import SlideInput from "@/elements/inputs/slideInput";
import { DateToString } from "@/helpers/jsExtend";
import styles from "./editLearnerBtn.scss";
import RadioInput from "@/elements/inputs/radioInput";

function EditLearnerForm(props) {
  const { item, isAdd } = props;
  const [isArrived, setArrived] = useState(!!((item && item.added) || isAdd));
  const [isDeparted, setDeparted] = useState(!!(item && item.removed));

  return (
    <ModalForm
      className={styles.modal}
      onValidSubmit={v => {
        if (!v.isNeedAdd) {
          v.added = null;
        }
        if (!v.isNeedRemove) {
          v.removed = null;
        }
        // this required for Object.assign when props is not defined at all (it can be with inputValue === undefined)
        if (v.isGirl === undefined) {
          v.isGirl = undefined;
        }
        delete v.isNeedAdd;
        delete v.isNeedRemove;
        v.id = item && item.id;

        props.onSubmit(v);
      }}
      onClosed={props.onClosed}
      title={`${isAdd ? "Добавление" : "Редактирование"} ученика`}
      textSubmit="Сохранить"
    >
      <TextInput
        name="name"
        label="ФИО"
        defaultModel={item}
        validations={{ required: true }}
      />
      <DatePicker
        name="dob"
        label="Дата рождения"
        defaultModel={item}
        validations={{ required: true }}
      />
      <RadioInput
        name="isGirl"
        label="Пол"
        defaultModel={item}
        options={[
          { text: "Авто (вич/вна)", value: undefined },
          { text: "Муж", value: false },
          { text: "Жен", value: true },
        ]}
      />
      <div className={styles.inputGroup}>
        <SlideInput
          label="Прибыл"
          name="isNeedAdd"
          defaultValue={isArrived}
          onChanged={v => setArrived(v)}
        />
        <TextInput
          placeholder=""
          name="added"
          defaultValue={DateToString(new Date())}
          disabled={!isArrived}
          validations={{ required: isArrived }}
        />
      </div>
      <div className={styles.inputGroup}>
        <SlideInput
          label="Выбыл"
          name="isNeedRemove"
          defaultValue={isDeparted}
          onChanged={v => setDeparted(v)}
        />
        <TextInput
          name="removed"
          placeholder=""
          defaultValue={(item && item.removed) || DateToString(new Date())}
          disabled={!isDeparted}
          validations={{ required: isDeparted }}
        />
      </div>
    </ModalForm>
  );
}

export default function EditLearnerBtn(props) {
  const [isOpen, setOpen] = useState(false);
  const { item, isAdd } = props;
  const elProps = Object.assign({}, props);
  delete elProps.onRemove;
  delete elProps.item;
  delete elProps.isAdd;

  return (
    <>
      <SecondaryBtn
        {...elProps}
        disabled={!isAdd && !item}
        onClick={() => setOpen(true)}
      >
        {isAdd ? "Добавить" : "Редактировать"}
      </SecondaryBtn>
      {isOpen ? (
        <EditLearnerForm {...props} onClosed={() => setOpen(false)} />
      ) : null}
    </>
  );
}
