import "./styles/main.scss";
import ReactDom from "react-dom";
import { Component } from "react";
import TheError from "./components/theError";
import Classes from "./components/Classes";
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

  componentDidCatch() {
    this.setState({ errorCode: true });
  }

  render() {
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
          onSelected={this.onHandleSelected}
          selected={this.state.selected}
        />
        <Classes />
      </>
    );
  }
}

ReactDom.render(<AppContainer />, document.getElementById("app"));
