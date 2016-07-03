import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

namespace Inputs {
  export class ReactionNetwork {
    @observable modelName: string;
    @observable reactions: Array<Reaction>;

    constructor() {
      this.modelName = "";
      this.reactions = [Reaction.newEmpty()];
    }

    addReaction(r: Reaction) {
      this.reactions.push(r);
    }

    addEmptyReaction() {
      this.addReaction(Reaction.newEmpty());
    }

    removeReaction(index: number) {
      this.reactions.splice(index, 1);
      if (this.reactions.length < 1) {
        this.addReaction(Reaction.newEmpty());
      }
    }

    clearReactions() {
      this.reactions = [Reaction.newEmpty()];
    }
  }

  export class Reaction {
    reactKey: number;
    @observable left: string;
    @observable right: string;
    @observable arrow: Arrow;

    constructor(left: string, arrow: Arrow, right: string) {
      this.reactKey = Math.random(); // TODO: use actual keys
      this.left = left;
      this.right = right;
      this.arrow = arrow;
    }

    static newEmpty() {
      return new Reaction("", Arrow.ToRight, "");
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
class ReactionNetworkInputTable extends React.Component<{ reactionNetwork: Inputs.ReactionNetwork }, {}> {
  render() {
    let rn = this.props.reactionNetwork;

    return (
      <div>
        <input value={rn.modelName} onChange={this.updateModelName} placeholder="Unnamed Model" />
        <table>
          <tbody>
            {rn.reactions.map((r, i) =>
              <ReactionInputRow key={r.reactKey} index={i} reaction={r} onRemove={this.removeReaction} />)}
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

  addIndependentReactions = (species: string, startIndex: number, endIndex: number) => {
    for (let i = startIndex; i <= endIndex; i++) {
      rn.addReaction(new Inputs.Reaction(species + i, Inputs.Arrow.ToRight, ""));
    }
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

interface ReactionInputRowProps {
  index: number;
  reaction: Inputs.Reaction;
  onRemove: (index: number) => void;
}

@observer
class ReactionInputRow extends React.Component<ReactionInputRowProps, {}> {
  leftTextArea: HTMLTextAreaElement;
  rightTextArea: HTMLTextAreaElement;

  leftTextAreaRef = (ref) => { this.leftTextArea = ref; }
  rightTextAreaRef = (ref) => { this.rightTextArea = ref; }

  textAreaPadding: number;

  componentDidMount() {
    let topPadding = getComputedStyle(this.leftTextArea).getPropertyValue("padding-top"); 
    let bottomPadding = getComputedStyle(this.leftTextArea).getPropertyValue("padding-bottom");
    this.textAreaPadding = parseInt(topPadding) + parseInt(bottomPadding);
    resizeToFitText(this.leftTextArea, this.textAreaPadding);
    resizeToFitText(this.rightTextArea, this.textAreaPadding);
  }

  render() {
    let r = this.props.reaction;

    return (
      <tr>
        <td>{this.props.index + 1}</td>
        <td><textarea value={r.left} onChange={this.updateLeft} ref={this.leftTextAreaRef} placeholder="Ø" /></td>
        <td><button onClick={this.nextArrow} onKeyDown={this.handleButtonKeyDown}>{Inputs.Arrow.toString(r.arrow)}</button></td>
        <td><textarea value={r.right} onChange={this.updateRight} ref={this.rightTextAreaRef} placeholder="Ø" /></td>
        <td><button onClick={this.remove}>X</button></td>
      </tr>
    );
  }

  updateLeft = () => {
    let r = this.props.reaction;
    r.left = this.leftTextArea.value;
    resizeToFitText(this.leftTextArea, this.textAreaPadding);
  }

  updateRight = () => {
    let r = this.props.reaction;
    r.right = this.rightTextArea.value;
    resizeToFitText(this.rightTextArea, this.textAreaPadding);
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
    let i = this.props.index;
    this.props.onRemove(i);
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
ReactDOM.render(<ReactionNetworkInputTable reactionNetwork={rn} />, document.getElementById('root'));
