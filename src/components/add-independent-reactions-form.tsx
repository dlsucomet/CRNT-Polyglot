import * as React from 'react';
import {observer} from 'mobx-react';

import FormModel from '../component-models/add-form-model';

interface Props {
  model: FormModel;
  onAdd: (v: string, s: number, e: number) => void;
}

@observer
export default class AddIndependentReactionsForm extends React.Component<Props, {}> {
  render() {
    let m = this.props.model;

    return (
      <div>
        <h2>Add Independent Reactions</h2>
        <label>Species</label>
        <input value={m.variable} onChange={this.updateVariable} />
        <label>Start Index</label>
        <input type="number" value={m.startIndex} onChange={this.updateStartIndex} />
        <label>End Index</label>
        <input type="number" value={m.endIndex} onChange={this.updateEndIndex} />
        <button onClick={this.add}>Add</button>
      </div>
    );
  }

  updateVariable = (e: Event) => {
    let input = e.target as HTMLInputElement;
    let m = this.props.model;
    m.variable = input.value;
  }

  updateStartIndex = (e: Event) => {
    let input = e.target as HTMLInputElement;
    let m = this.props.model;
    m.startIndex = parseInt(input.value);
  }

  updateEndIndex = (e: Event) => {
    let input = e.target as HTMLInputElement;
    let m = this.props.model;
    m.endIndex = parseInt(input.value);
  }
  
  add = () => {
    let m = this.props.model;
    this.props.onAdd(m.variable, m.startIndex, m.endIndex);
  }
}
