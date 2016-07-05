import * as React from 'react';
import {observer} from 'mobx-react';

import ReactionNetworkModel from '../component-models/reaction-network-model';
import ReactionRow from './reaction-row';

@observer
export default class ReactionNetworkTable extends React.Component<{reactionNetwork: ReactionNetworkModel}, {}> {
  render() {
    let rn = this.props.reactionNetwork;

    return (
      <table>
        <tbody>
          {rn.reactions.map((r, i) =>
            <ReactionRow key={r.reactKey} index={i} reaction={r} />)}
        </tbody>
      </table>
    );
  }
}
