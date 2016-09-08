import * as React from 'react';
import {observer} from 'mobx-react';

import {ReactionNetworkModel, ReactionModel, Arrow} from '../component-models/reaction-network-model';
import AutoResizingInput from './auto-resizing-input';

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

@observer
class ReactionRow extends React.Component<{index: number, reaction: ReactionModel}, {}> {
  render() {
    let r = this.props.reaction;

    return (
      <tr>
        <td>{this.props.index + 1}</td>
        <td><AutoResizingInput value={r.left} onChange={this.updateLeft} placeholder="Ø" /></td>
        <td><button onClick={this.nextArrow} onKeyDown={this.handleButtonKeyDown}>{Arrow.toString(r.arrow)}</button></td>
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
    r.arrow = Arrow.next(r.arrow);
  }

  prevArrow = () => {
    let r = this.props.reaction;
    r.arrow = Arrow.prev(r.arrow);
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
