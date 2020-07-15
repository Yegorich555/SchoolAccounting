import "./styles/main.scss";
import ReactDom from "react-dom";
import { Component } from "react";
import TheError from "./components/theError";
import TheHeader, { headerConfig } from "./components/theHeader";
import Store from "./helpers/store";

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: null,
      error: null,
      selected:
        headerConfig.find(v => v.text === Store.currentPath) || headerConfig[0],
    };
    Store.onUploaded(() => {
      this.forceUpdate();
    });
  }

  resetError = () => {
    this.setState({ errorCode: null, error: null });
  };

  onSelected = v => {
    this.setState({ selected: v });
    Store.currentPath = v.text;
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
