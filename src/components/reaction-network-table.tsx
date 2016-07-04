import * as React from 'react';
import {observer} from 'mobx-react';

import ReactionNetworkModel from '../component-models/reaction-network-model';
import ReactionRow from './reaction-row';

@observer
export default class ReactionNetworkTable extends React.Component<{reactionNetwork: ReactionNetworkModel}, {}> {
  render() {
    let rn = this.props.reactionNetwork;

    return (
      <div>
        <input value={rn.modelName} onChange={this.updateModelName} placeholder="Unnamed Model" />
        <table>
          <tbody>
            {rn.reactions.map((r, i) =>
              <ReactionRow key={r.reactKey} index={i} reaction={r} />)}
          </tbody>
        </table>
        <button onClick={this.addEmptyReaction}>Add Reaction</button>
        <button onClick={this.clearReactions}>Clear Reactions</button>
      </div>
    );
  }

  updateModelName = (e: Event) => {
    let modelNameInput = e.target as HTMLInputElement;
    let rn = this.props.reactionNetwork;
    rn.modelName = modelNameInput.value;
  }

  addEmptyReaction = () => {
    let rn = this.props.reactionNetwork;
    rn.addEmptyReaction();
  }

  removeReaction = (index: number) => {
    let rn = this.props.reactionNetwork;
    rn.removeReaction(index);
  }

  clearReactions = () => {
    let rn = this.props.reactionNetwork;
    rn.clearReactions();
  }
}
