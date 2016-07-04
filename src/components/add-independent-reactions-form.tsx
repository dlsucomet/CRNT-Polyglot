import * as React from 'react';
import {observer} from 'mobx-react';

import FormModel from '../component-models/add-form-model';

@observer
export default class AddIndependentReactionsForm extends React.Component<{model: FormModel}, {}> {
  render() {
    let m = this.props.model;

    return (
      <div>
        <h2>Add Independent Reactions</h2>
        <label>Species</label>
        <input value={m.variable} />
        <label>Start Index</label>
        <input type="number" value={m.startIndex} />
        <label>End Index</label>
        <input type="number" value={m.endIndex} />
        <button onClick={this.add}>Add</button>
      </div>
    );
  }

  // TODO: handle change events!

  add = () => {
    let m = this.props.model;
    m.reactionNetwork.addIndependentReactions(m.variable, m.startIndex, m.endIndex);
  }
}
