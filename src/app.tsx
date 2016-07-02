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
      this.reactions = [new Reaction()];
    }

    addReaction() {
      this.reactions.push(new Reaction());
    }

    removeReaction(index: number) {
      this.reactions.splice(index, 1);
      if (this.reactions.length < 1) {
        this.reactions.push(new Reaction());
      }
    }

    clearReactions() {
      this.reactions = [new Reaction()];
    }
  }

  export class Reaction {
    reactKey: number;
    @observable left: string;
    @observable right: string;
    @observable arrow: Arrow;

    constructor() {
      this.reactKey = Math.random(); // TODO: use actual keys
      this.left = "";
      this.right = "";
      this.arrow = Arrow.ToRight;
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
        <button onClick={this.addReaction}>Add Reaction</button>
        <button onClick={this.clearReactions}>Clear Reactions</button>
      </div>
    );
  }

  updateModelName = (e: Event) => {
    let modelNameInput = e.target as HTMLInputElement;
    let rn = this.props.reactionNetwork;
    rn.modelName = modelNameInput.value;
  }

  addReaction = () => {
    let rn = this.props.reactionNetwork;
    rn.addReaction();
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

interface ReactionInputRowProps {
  index: number;
  reaction: Inputs.Reaction;
  onRemove: (index: number) => void;
}

@observer
class ReactionInputRow extends React.Component<ReactionInputRowProps, {}> {
  render() {
    let r = this.props.reaction;

    return (
      <tr>
        <td>{this.props.index + 1}</td>
        <td><input value={r.left} onChange={this.updateLeftInput} placeholder="Ø" /></td>
        <td><button onClick={this.nextArrow}>{Inputs.Arrow.toString(r.arrow)}</button></td>
        <td><input value={r.right} onChange={this.updateRightInput} placeholder="Ø" /></td>
        <td><button onClick={this.remove}>X</button></td>
      </tr>
    );
  }

  updateLeftInput = (e: Event) => {
    let leftInput = e.target as HTMLInputElement;
    let r = this.props.reaction;
    r.left = leftInput.value;
  }

  updateRightInput = (e: Event) => {
    let rightInput = e.target as HTMLInputElement;
    let r = this.props.reaction;
    r.right = rightInput.value;
  }

  nextArrow = () => {
    let r = this.props.reaction;
    r.arrow = Inputs.Arrow.next(r.arrow);
  }

  remove = () => {
    let i = this.props.index;
    this.props.onRemove(i);
  }
}

let rn = new Inputs.ReactionNetwork();
ReactDOM.render(<ReactionNetworkInputTable reactionNetwork={rn} />, document.getElementById('root'));
