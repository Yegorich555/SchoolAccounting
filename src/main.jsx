import "./styles/main.scss";
import ReactDom from "react-dom";
import { Component } from "react";
import TheError from "./components/theError";
import TheHeader, { headerConfig } from "./components/theHeader";

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: null,
      error: null,
      selected: headerConfig[0]
    };
  }

  resetError = () => {
    this.setState({ errorCode: null, error: null });
  };

  onSelected = v => {
    this.setState({ selected: v });
  };

  componentDidCatch() {
    this.setState({ errorCode: true });
  }

  render() {
    const Current = this.state.selected.component;
    return (
      <>
        {this.state.errorCode ? (
          <TheError
            errorCode={this.state.errorCode}
            error={this.state.error}
            onClosed={this.resetError}
          />
        ) : null}
        <TheHeader
          onSelected={this.onSelected}
          selected={this.state.selected}
        />

        <Current />
      </>
    );
  }
}

ReactDom.render(<AppContainer />, document.getElementById("app"));
