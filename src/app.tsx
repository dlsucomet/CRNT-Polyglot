import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

import ReactionNetworkModel from './component-models/reaction-network-model';
import FormModel from './component-models/add-form-model';

import ReactionNetworkTable from './components/reaction-network-table';
import AddIndependentReactionsForm from './components/add-independent-reactions-form';

class AppModel {
  @observable reactionNetwork: ReactionNetworkModel = new ReactionNetworkModel();
  @observable showForm: boolean = false;
  @observable formModel: FormModel = new FormModel(this.reactionNetwork);
  @computed get generatedFiles() {
    return null;
  }
}

@observer
class App extends React.Component<{model: AppModel}, {}> {
  render() {
    let m = this.props.model;
    return (
      <div>
        <ReactionNetworkTable reactionNetwork={m.reactionNetwork} />
        <AddIndependentReactionsForm model={m.formModel} />
      </div>
    );
  }
}

let app = new AppModel();
ReactDOM.render(<App model={app} />, document.getElementById('root'));
