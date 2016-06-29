import { ReactionNetwork  } from './reactions';

import * as ControlFormat from './formats/control';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

class AppState {
  @observable input: string = "# Model Name\nX -> Y";
  @observable showOutput: boolean = false;

  private lastGoodOutput: string = "";

  @computed get output(): string {
    try {
      var rn = ReactionNetwork.fromString(this.input);
      let out = ControlFormat.generateFile(rn);
      this.lastGoodOutput = out;
      return out;
    } catch (e) {
      return "Syntax error...\n" + this.lastGoodOutput;
    }
  }
}

@observer
class App extends React.Component<{ state: AppState }, {}> {
  private inputElem: HTMLTextAreaElement;
  InputElemRef = (ref) => { this.inputElem = ref; }

  render() {
    let state = this.props.state;

    return (
      <div>
        <textarea value={state.input} onChange={this.updateInput} ref={this.InputElemRef}/>
        <button onClick={this.showHideOutput}>
        {state.showOutput ? "Hide Output" : "Show Output"}
        </button>
        <div>
          <pre>
            {state.showOutput ? state.output : "Output Hidden"}
          </pre>
        </div>
      </div>
    );
  }

  updateInput = () => {
    let state = this.props.state;
    state.input = this.inputElem.value;
  }

  showHideOutput = () => {
    let state = this.props.state;
    state.showOutput = !state.showOutput;
  }
}

let appState = new AppState();
ReactDOM.render(<App state={appState} />, document.getElementById('root'));
