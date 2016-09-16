import {observable, computed, action} from 'mobx';

import * as R from '../reactions';

import ReactKeyGenerator from '../react-key-generator';

export class ReactionNetworkModel {
  reactionKeyGenerator: ReactKeyGenerator = new ReactKeyGenerator();

  @observable modelName: string = "";
  @observable reactions: Array<ReactionModel> = [new ReactionModel(this)];

  @computed get asReactionNetwork(): R.ReactionNetwork {
    let modelName = this.modelName || "Unnamed Model";
    let reactions = this.reactions.map(r => r.asReaction);
    return new R.ReactionNetwork(modelName, reactions);
  }

  @computed get hasError(): boolean {
    return this.reactions.some(r => r.hasError);
  }

  @action setModelName(name: string) {
    this.modelName = name;
  }

  @action addReaction(r: ReactionModel) {
    this.reactions.push(r);
  }

  @action addEmptyReaction() {
    this.addReaction(new ReactionModel(this));
  }

  @action addIndependentReactions(variable: string, startIndex: number, endIndex: number) {
    for (let i = startIndex; i <= endIndex; i++) {
      let r = new ReactionModel(this);
      r.left = variable + i;
      r.arrow = Arrow.BothWays;
      r.right = "";
      this.addReaction(r);
    }
  }

  @action removeReaction(index: number) {
    this.reactions.splice(index, 1);
    if (this.reactions.length < 1) {
      this.addReaction(new ReactionModel(this));
    }
  }

  @action clearReactions() {
    this.reactionKeyGenerator.reset();
    this.reactions = [new ReactionModel(this)];
  }
}

export class ReactionModel {
  reactKey: number;
  reactionNetwork: ReactionNetworkModel;

  @observable left: string = "";
  @observable right: string = "";
  @observable arrow: Arrow = Arrow.ToRight;

  @observable hasEnteredErrorLeft: boolean = false;
  @observable hasEnteredErrorRight: boolean = false;

  @computed get hasError(): boolean {
    return this.hasErrorLeft || this.hasErrorRight;
  }

  @computed get hasErrorLeft(): boolean {
    return ReactionModel.inputToComplex(this.left) === null;
  }

  @computed get hasErrorRight(): boolean {
    return ReactionModel.inputToComplex(this.right) === null;
  }

  constructor(reactionNetwork: ReactionNetworkModel) {
    this.reactionNetwork = reactionNetwork;
    this.reactKey = reactionNetwork.reactionKeyGenerator.next();
  }

  @computed get asReaction(): R.Reaction {
    let reactant = ReactionModel.inputToComplex(this.left);
    let product = ReactionModel.inputToComplex(this.right);

    if (this.arrow === Arrow.ToLeft) {
      [reactant, product] = [product, reactant];
    }
    let reversible = this.arrow === Arrow.BothWays;

    return new R.Reaction(reactant, product, reversible);
  }

  @action setLeft(inputStr: string) {
    this.left = inputStr;
  }

  @action setRight(inputStr: string) {
    this.right = inputStr;
  }

  @action setArrow(a: Arrow) {
    this.arrow = a;
  }

  @action nextArrow() {
    this.arrow = Arrow.next(this.arrow);
  }

  @action prevArrow() {
    this.arrow = Arrow.prev(this.arrow);
  }

  @action enteredErrorLeft(b: boolean) {
    this.hasEnteredErrorLeft = b;
  }

  @action enteredErrorRight(b: boolean) {
    this.hasEnteredErrorRight = b;
  }

  static inputToComplex(inputString: string): R.Complex {
    inputString = inputString.trim() || "0";
    if (inputString === "0") {
      return [];
    }

    try {
      let terms = (
        inputString
          .split(/\s*\+\s*/)
          .map(str => {
            let g = str.match(/^(\d*)\s*([a-zA-Z_]\w*)$/);
            if (g === null) {
              throw "invalid term: " + str;
            }
            let coeff = g[1] ? parseInt(g[1]) : 1;
            let species = g[2];
            return new R.Term(coeff, species);
          })
      );

      return terms;
    } catch(e) {
      return null;
    }
  }
}

export enum Arrow { ToLeft, ToRight, BothWays }
export namespace Arrow {
  const order = [Arrow.ToRight, Arrow.BothWays, Arrow.ToLeft];

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
      case Arrow.BothWays: return "↔";
    }
  }
}
