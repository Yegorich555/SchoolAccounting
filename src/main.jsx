import "./styles/main.scss";
import ReactDom from "react-dom";
import { Component } from "react";
import TheError from "./components/theError";

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: null,
      error: null
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
        Everything will be here
      </>
    );
  }
}

ReactDom.render(<AppContainer />, document.getElementById("app"));
