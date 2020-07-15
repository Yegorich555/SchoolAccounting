import { Component } from "react";
import { set as lodashSet } from "lodash";
import styles from "./style.scss";
import Spinner from "@/elements/spinner";
import BaseFormConnector, { FormContext } from "./baseFormConnector";
import { arrayFunctions, PromiseWait } from "@/helpers/jsExtend";
import PrimaryBtn from "@/elements/buttons/primaryBtn";

class BaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      formError: null,
    };
    this.inputs = [];
  }

  componentWillUnmount() {
    this.isUnMounted = true;
  }

  onSubmit = e => {
    e.preventDefault();

    if (this.isPending) return;

    let model = {};
    let hasValues = false;
    const hasError = this.inputs.some(input => {
      if (DEBUG && !input.validate) {
        console.warn("props.validate is not attached");
      } else if (!input.validate()) {
        return true;
      }

      const v = input.provideValue();
      if (v !== undefined) {
        model = lodashSet(model, input.props.name, v); // set nested properties: model['a.b'] => model[a][b]
        // model[input.props.name] = v;
        hasValues = true;
      }
      return false;
    });

    if (hasError) return;

    if (!hasValues && this.inputs.length) {
      this.setState({ formError: "At least one value is required" });
      return;
    }

    if (this.props.onValidate) {
      const result = this.props.onValidate(model, this.inputs);
      if (typeof result === "string") {
        this.setState({ formError: result });
        return;
      }
      if (result !== true) return;
    }

    this.setState({ formError: null });

    if (this.props.onValidSubmit) {
      this.isPending = true;
      this.setState({ isPending: true });
      const maybePromise = this.props.onValidSubmit(model);
      if (maybePromise && maybePromise.then) {
        PromiseWait(maybePromise).finally(() => {
          // TODO: show error in results
          this.isPending = false;
          !this.isUnMounted && this.setState({ isPending: false });
        });
      }
    } else if (DEBUG) {
      console.warn("props.onValidSubmit is not attached");
    }
  };

  handleBtnBlur = () => {
    this.setState({ formError: null });
    this.props.onResetError && this.props.onResetError();
  };

  attachToForm = component => {
    arrayFunctions.addIfNotExists.call(this.inputs, component);
  };

  detachFromForm = component => {
    arrayFunctions.remove.call(this.inputs, component);
  };

  getContext = () => ({
    attachToForm: this.attachToForm,
    detachFromForm: this.detachFromForm,
  });

  reset = () => {
    this.inputs.forEach(input => {
      if (DEBUG && !input.resetValue) {
        throw new Error(
          `Form Input '${input.props.name}' requires a resetValue() function`
        );
      } else {
        input.resetValue();
      }
    });
  };

  render() {
    return (
      <form className={this.props.className} onSubmit={this.onSubmit}>
        {this.props.title ? (
          <h3 className={[styles.title, this.props.titleClass]}>
            {this.props.title}
          </h3>
        ) : null}
        <FormContext.Provider value={this.getContext()}>
          {this.props.children}
        </FormContext.Provider>
        {this.state.formError ? (
          <div className={styles.formError}>{this.state.formError}</div>
        ) : null}

        <div className={[styles.btnGroup, this.props.btnGroupClass]}>
          <PrimaryBtn
            type="submit"
            formNoValidate
            className={styles.btnSubmit}
            onBlur={this.handleBtnBlur}
          >
            {this.state.isPending ? (
              <Spinner className={styles.spinner} />
            ) : null}
            {this.props.textSubmit || "Submit"}
          </PrimaryBtn>
          {this.props.buttons}
        </div>
      </form>
    );
  }
}

export { BaseFormConnector as connectForm };
export default BaseForm;
