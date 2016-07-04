import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

namespace Inputs {
  export class ReactionNetwork {
    @observable modelName: string = "";
    @observable reactions: Array<Reaction> = [new Reaction(this)];

    addReaction(r: Reaction) {
      this.reactions.push(r);
    }

    addEmptyReaction() {
      this.addReaction(new Reaction(this));
    }

    addIndepReaction(variable: string, startIndex: number, endIndex: number) {
      for (let i = startIndex; i <= endIndex; i++) {
        let r = new Reaction(this);
        r.left = variable + i;
        r.arrow = Arrow.Both;
        r.right = "";
        this.addReaction(r);
      }
    }

    removeReaction(index: number) {
      this.reactions.splice(index, 1);
      if (this.reactions.length < 1) {
        this.addReaction(new Reaction(this));
      }
    }

    clearReactions() {
      this.reactions = [new Reaction(this)];
    }
  }

  export class Reaction {
    reactKey: number;
    reactionNetwork: ReactionNetwork;
    @observable left: string = "";
    @observable right: string = "";
    @observable arrow: Arrow = Arrow.ToRight;

    constructor(reactionNetwork: ReactionNetwork) {
      this.reactKey = Math.random(); // TODO: use actual keys
      this.reactionNetwork = reactionNetwork;
    }
  }

  export enum Arrow { ToLeft, ToRight, Both }
  export namespace Arrow {
    const order = [Arrow.ToRight, Arrow.Both, Arrow.ToLeft];

    export function next(a: Arrow): Arrow {
      let i = order.indexOf(a);
      let isLast = i + 1 === order.length;
      let nextI = isLast ? 0 : i + 1;
      return order[nextI];
    }

    export function prev(a: Arrow): Arrow {
      let i = order.indexOf(a);
      let isFirst = i === 0;
      let prevI = isFirst ? order.length - 1 : i - 1;
      return order[prevI];
    }

    export function toString(a: Arrow): string {
      switch (a) {
        case Arrow.ToLeft: return "←";
        case Arrow.ToRight: return "→";
        case Arrow.Both: return "↔";
      }
    }
  }
}

@observer
class ReactionNetworkTable extends React.Component<{ reactionNetwork: Inputs.ReactionNetwork }, {}> {
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
        <AddIndependentReactionsForm onAdd={this.addIndependentReactions}/>
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

  addIndependentReactions = (variable: string, startIndex: number, endIndex: number) => {
    let rn = this.props.reactionNetwork;
    rn.addIndepReaction(variable, startIndex, endIndex);
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

function resizeToFitText(elem: HTMLElement, padding: number = 0) {
  elem.style.height = "0";
  elem.style.height = (elem.scrollHeight - padding) + "px";
}

class AutoResizingInput extends React.Component<any, {}> {
  textArea: HTMLTextAreaElement;
  textAreaRef = (ref) => { this.textArea = ref; };
  padding: number;

  componentDidMount() {
    let topPadding = getComputedStyle(this.textArea).getPropertyValue("padding-top"); 
    let bottomPadding = getComputedStyle(this.textArea).getPropertyValue("padding-bottom");
    this.padding = parseInt(topPadding) + parseInt(bottomPadding);
    resizeToFitText(this.textArea, this.padding);
  }

  render() {
    return (
      <textarea {...this.props} onChange={this.handleChange} ref={this.textAreaRef} />
    );
  }

  handleChange = (e: Event) => {
    this.textArea.value = this.textArea.value.replace(/\r?\n/g, "");

    let onChangeFunc = this.props.onChange;
    if (onChangeFunc) { onChangeFunc(e); }

    resizeToFitText(this.textArea, this.padding);
  }
}

@observer
class ReactionRow extends React.Component<{ index: number, reaction: Inputs.Reaction }, {}> {
  render() {
    let r = this.props.reaction;

    return (
      <tr>
        <td>{this.props.index + 1}</td>
        <td><AutoResizingInput value={r.left} onChange={this.updateLeft} placeholder="Ø" /></td>
        <td><button onClick={this.nextArrow} onKeyDown={this.handleButtonKeyDown}>{Inputs.Arrow.toString(r.arrow)}</button></td>
        <td><AutoResizingInput value={r.right} onChange={this.updateRight} placeholder="Ø" /></td>
        <td><button onClick={this.remove}>X</button></td>
      </tr>
    );
  }

  updateLeft = (e: Event) => {
    let leftInput = e.target as HTMLTextAreaElement;
    let r = this.props.reaction;
    r.left = leftInput.value;
  }

  updateRight = (e: Event) => {
    let rightInput = e.target as HTMLTextAreaElement;
    let r = this.props.reaction;
    r.right = rightInput.value;
  }

  nextArrow = () => {
    let r = this.props.reaction;
    r.arrow = Inputs.Arrow.next(r.arrow);
  }

  prevArrow = () => {
    let r = this.props.reaction;
    r.arrow = Inputs.Arrow.prev(r.arrow);
  }

  handleButtonKeyDown = (e: KeyboardEvent) => {
    switch(e.key) {
      case "ArrowDown": case "ArrowRight":
        this.nextArrow();
        return;
      case "ArrowUp": case "ArrowLeft":
        this.prevArrow();
        return;
    }
  }

  remove = () => {
    let r = this.props.reaction;
    let i = this.props.index;
    r.reactionNetwork.removeReaction(i);
  }
}

interface AddIndependentReactionsFormProps {
  onAdd: (species: string, startIndex: number, endIndex: number) => void;
}

class AddIndependentReactionsForm extends React.Component<AddIndependentReactionsFormProps, {}> {
  speciesInput: HTMLInputElement;
  startIndexInput: HTMLInputElement;
  endIndexInput: HTMLInputElement;
  
  render() {
    return (
      <div>
        <h2>Add Independent Reactions</h2>
        <label>Species</label>
        <input ref={(ref) => this.speciesInput= ref} />
        <label>Start Index</label>
        <input type="number" ref={(ref) => this.startIndexInput= ref} />
        <label>End Index</label>
        <input type="number" ref={(ref) => this.endIndexInput= ref} />
        <button onClick={this.add}>Add</button>
      </div>
    );
  }

  add = () => {
    let species = this.speciesInput.value;
    let startIndex = Number(this.startIndexInput.value);
    let endIndex = Number(this.endIndexInput.value);
    this.props.onAdd(species, startIndex, endIndex);
  }
}

let rn = new Inputs.ReactionNetwork();
ReactDOM.render(<ReactionNetworkTable reactionNetwork={rn} />, document.getElementById('root'));
