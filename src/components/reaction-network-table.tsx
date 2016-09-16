import * as React from 'react';
import {observer} from 'mobx-react';

import {ReactionNetworkModel, ReactionModel, Arrow} from '../component-models/reaction-network-model';
import AutoResizingInput from './auto-resizing-input';

@observer
export default class ReactionNetworkTable extends React.Component<{reactionNetwork: ReactionNetworkModel}, {}> {
  render() {
    let rn = this.props.reactionNetwork;

    return (
      <ol className="reaction-table">
        {rn.reactions.map((r, i) =>
          <ReactionRow key={r.reactKey} index={i} reaction={r} />)}
      </ol>
    );
  }
}

@observer
class ReactionRow extends React.Component<{index: number, reaction: ReactionModel}, {}> {
  render() {
    let r = this.props.reaction;
    let leftErr = r.hasEnteredErrorLeft && r.hasErrorLeft;
    let rightErr = r.hasEnteredErrorRight && r.hasErrorRight;

    return (
      <li className="reaction-row" data-index={this.props.index}>
        <span className="row-number">{this.props.index + 1}</span>
        <AutoResizingInput className={"left-input" + (leftErr ? " has-error" : "")} value={r.left} onChange={this.updateLeft} onBlur={this.enteredLeft} placeholder="Ø" />
        <button className="arrow-button" onClick={this.nextArrow} onKeyDown={this.handleButtonKeyDown}>{Arrow.toString(r.arrow)}</button>
        <AutoResizingInput className={"right-input" + (rightErr ? " has-error" : "")} value={r.right} onChange={this.updateRight} onBlur={this.enteredRight} placeholder="Ø" />
        <button className="remove-button" onClick={this.remove}>X</button>
      </li>
    );
  }

  enteredLeft = (e: Event) => {
    let r= this.props.reaction;
    r.enteredErrorLeft(r.hasErrorLeft);
  }

  enteredRight = (e: Event) => {
    let r= this.props.reaction;
    r.enteredErrorRight(r.hasErrorRight);
  }

  updateLeft = (e: Event) => {
    let leftInput = e.target as HTMLTextAreaElement;
    let r = this.props.reaction;
    r.setLeft(leftInput.value);
  }

  updateRight = (e: Event) => {
    let rightInput = e.target as HTMLTextAreaElement;
    let r = this.props.reaction;
    r.setRight(rightInput.value);
  }

  nextArrow = () => {
    let r = this.props.reaction;
    r.nextArrow();
  }

  prevArrow = () => {
    let r = this.props.reaction;
    r.prevArrow();
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
