/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from "react";
import SecondaryBtn from "@/elements/buttons/secondaryBtn";
import ModalForm from "@/elements/baseForm/modalForm";
import TextInput from "@/elements/inputs/textInput";

export default function EditLearnerBtn(props) {
  const [isOpen, setOpen] = useState(false);
  const { item, isAdd } = props;

  const elProps = Object.assign({}, props);
  delete elProps.messageSuf;
  delete elProps.onRemove;
  delete elProps.item;
  delete elProps.isAdd;

  return (
    <>
      <SecondaryBtn {...elProps} disabled={!item} onClick={() => setOpen(true)}>
        Редактировать
      </SecondaryBtn>
      {isOpen ? (
        <ModalForm
          onClosed={() => setOpen(false)}
          title={`${isAdd ? "Добавление" : "Редактирование"} ученика`}
          textSubmit="Сохранить"
        >
          <TextInput
            name="name"
            label="ФИО"
            defaultModel={item}
            validations={{ required: true }}
          />
        </ModalForm>
      ) : null}
    </>
  );
}