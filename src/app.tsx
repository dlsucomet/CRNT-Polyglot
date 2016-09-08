import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {observable, computed, action, useStrict} from 'mobx';
import {observer} from 'mobx-react';

import {ReactionNetworkModel} from './component-models/reaction-network-model';
import FormModel from './component-models/add-form-model';

import ReactionNetworkTable from './components/reaction-network-table';
import AddIndependentReactionsForm from './components/add-independent-reactions-form';

import {generateFile as controlFile} from './formats/control';
import {generateFile as crntollboxFile} from './formats/crntoolbox';
import {generateFile as ernestFile} from './formats/ernest';

useStrict(true);

class AppModel {
  @observable reactionNetwork: ReactionNetworkModel = new ReactionNetworkModel();
  @observable showForm: boolean = false;
  @observable formModel: FormModel = new FormModel();
  @computed get generatedFiles() {
    let rn = this.reactionNetwork.asReactionNetwork;
    return [
      controlFile(rn),
      crntollboxFile(rn),
      ernestFile(rn),
    ];
  }

  @action hideForm() {
    this.showForm = false;
  }

  @action toggleForm() {
    this.showForm = !this.showForm;
  }
}

@observer
class App extends React.Component<{model: AppModel}, {}> {
  render() {
    let m = this.props.model;
    let rn = m.reactionNetwork;

    return (
      <div>
        <input value={rn.modelName} onChange={this.updateModelName} placeholder="Unnamed Model" />
        <ReactionNetworkTable reactionNetwork={m.reactionNetwork} />
        <button onClick={this.addEmptyReaction}>Add Reaction</button>
        <button onClick={this.showAddForm}>Add Independent Reactions</button>
        <button onClick={this.clearReactions}>Clear Reactions</button>

        {m.showForm
          ? <AddIndependentReactionsForm model={m.formModel} onAdd={this.addIndependentReactions} /> 
          : <div />}

        {m.generatedFiles.map(file =>
          <pre>{file}</pre>)}
      </div>
    );
  }

  updateModelName = (e: Event) => {
    let modelNameInput = e.target as HTMLInputElement;
    let rn = this.props.model.reactionNetwork;
    rn.setModelName(modelNameInput.value);
  }

  addEmptyReaction = () => {
    let rn = this.props.model.reactionNetwork;
    rn.addEmptyReaction();
  }

  showAddForm = () => {
    let m = this.props.model;
    m.toggleForm();
  }

  addIndependentReactions = (variable: string, startIndex: number, endIndex: number) => {
    let m = this.props.model;
    let rn = m.reactionNetwork;
    rn.addIndependentReactions(variable, startIndex, endIndex);
    m.hideForm();
  }

  clearReactions = () => {
    let rn = this.props.model.reactionNetwork;
    rn.clearReactions();
  }
}

let app = new AppModel();
ReactDOM.render(<App model={app} />, document.getElementById('root'));
