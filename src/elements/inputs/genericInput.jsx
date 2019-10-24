import config from "@/config";
import TextInput from "./textInput";
import DatePicker from "./datePicker/datePicker";
import SlideInput from "./slideInput";
import RadioInput from "./radioInput";
import Dropdown from "./dropdown";
import NumberInput from "./numberInput";
import MultiSelectInput from "./multiSelect";

const types = [
  {
    key: "text",
    render: props => {
      const { datatype } = props.dataObj;
      const maxLength = Number.parseInt(
        datatype.replace(/(text)|\(|\)/g, ""),
        10
      );
      return <TextInput {...props} maxLength={maxLength || 255} />;
    }
  },
  {
    key: "date",
    render: props => <DatePicker isString {...props} />
  },
  {
    key: "boolean",
    render: props => {
      const { isRequired } = props.dataObj;
      if (isRequired) {
        return <SlideInput {...props} />;
      }
      return (
        <RadioInput
          defaultValue={null}
          {...props}
          options={[
            { text: __ln("Yes"), value: true },
            { text: __ln("No"), value: false },
            { text: __ln("Unknown"), value: null }
          ]}
        />
      );
    }
  },
  {
    key: "numeric",
    render: props => {
      const { datatype } = props.dataObj;
      const maskLength = datatype.replace(/(numeric)|\(|\)/g, "");
      return <NumberInput {...props} maskLength={maskLength} />;
    }
  },
  {
    key: "select",
    render: props => {
      const { validValues } = props.dataObj;
      if (!Array.isArray(validValues)) {
        console.error(
          `Datatype [select] must contain a validValues. Field [${props.dataObj.name}.validValues]`
        );
      }
      return <Dropdown {...props} options={validValues || []} />;
    }
  },
  {
    key: "multiselect",
    render: props => {
      const { validValues } = props.dataObj;
      if (!Array.isArray(validValues)) {
        console.error(
          `Datatype [multiselect] must contain a validValues. Field [${props.dataObj.name}.validValues]`
        );
      }
      return <MultiSelectInput {...props} options={validValues || []} />;
    }
  }
];

export default function GenericInput(props) {
  const { datatype, name, label, isRequired } = props.dataObj;
  const result = types.find(v => datatype && datatype.startsWith(v.key));

  if (!result) {
    console.error(
      `Input for [${datatype}] is not defined. Field [${name}.datatype]`
    );
    return null;
  }

  const resultProps = {
    ...props,
    name,
    label: __ln(label),
    validations: Object.assign({}, props.validations, {
      required: isRequired
    })
  };

  const { dynamicProps } = props;
  if (dynamicProps) {
    Object.assign(resultProps, dynamicProps(resultProps));
  }

  return result.render(resultProps);
}

export function GenericInputs(props) {
  const fields = config.customerFields[props.propKey];

  return Object.keys(fields)
    .map(key => ({ ...fields[key], name: `${props.propKey}.${key}` }))
    .sort((v1, v2) => v1.displayOrder - v2.displayOrder)
    .map(v => <GenericInput key={v.displayOrder} dataObj={v} {...props} />);
}
