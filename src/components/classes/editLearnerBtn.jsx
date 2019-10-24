/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from "react";
import SecondaryBtn from "@/elements/buttons/secondaryBtn";
import ModalForm from "@/elements/baseForm/modalForm";
import TextInput from "@/elements/inputs/textInput";
import DatePicker from "@/elements/inputs/datePicker/datePicker";
import SlideInput from "@/elements/inputs/slideInput";

export default function EditLearnerBtn(props) {
  const [isOpen, setOpen] = useState(false);
  const [isArrived, setArrived] = useState(!!props.added);
  const [isRemoved, setRemoved] = useState(!!props.removed);
  const { item, isAdd } = props;

  const elProps = Object.assign({}, props);
  delete elProps.messageSuf;
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
          <DatePicker
            name="dob"
            label="Дата рождения"
            defaultModel={item}
            validations={{ required: true }}
          />
          {isAdd ? (
            <>
              <SlideInput
                label="Выбыл"
                name="isRemoved"
                defaultValue={item && item.removed}
                onChanged={v => setRemoved(v)}
              />
              <TextInput
                label="Выбыл (примечание)"
                name="removed"
                placeholder=""
                defaultModel={item}
                disabled={!isRemoved}
              />
            </>
          ) : (
            <>
              <SlideInput
                label="Прибыл"
                name="isAdded"
                defaultValue={item && item.added}
                onChanged={v => setArrived(v)}
              />
              <TextInput
                label="Прибыл (примечание)"
                placeholder=""
                name="added"
                defaultModel={item}
                disabled={!isArrived}
              />
            </>
          )}
        </ModalForm>
      ) : null}
    </>
  );
}
