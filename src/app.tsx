import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ReactionNetworkModel from './component-models/reaction-network-model';
import ReactionNetworkTable from './components/reaction-network-table';

let rn = new ReactionNetworkModel();
ReactDOM.render(<ReactionNetworkTable reactionNetwork={rn} />, document.getElementById('root'));
