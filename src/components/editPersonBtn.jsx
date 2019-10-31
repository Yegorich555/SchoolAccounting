/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from "react";
import SecondaryBtn from "@/elements/buttons/secondaryBtn";
import ModalForm from "@/elements/baseForm/modalForm";
import TextInput from "@/elements/inputs/textInput";
import styles from "./classes/editLearnerBtn.scss";

function EditPersonForm(props) {
  const { item, isAdd } = props;

  return (
    <ModalForm
      className={styles.modal}
      onValidSubmit={v => {
        v.id = item && item.id;
        props.onSubmit(v);
      }}
      onClosed={props.onClosed}
      title={`${isAdd ? "Добавление" : "Редактирование"}`}
      textSubmit="Сохранить"
    >
      <TextInput
        name="name"
        label="ФИО"
        defaultModel={item}
        validations={{ required: true }}
      />
      <TextInput
        name="post"
        label="Должность"
        defaultModel={item}
        validations={{ required: true }}
      />
    </ModalForm>
  );
}

export default function EditPersonBtn(props) {
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
        <EditPersonForm {...props} onClosed={() => setOpen(false)} />
      ) : null}
    </>
  );
}
