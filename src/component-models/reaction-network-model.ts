import {observable, computed} from 'mobx';

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

  addReaction(r: ReactionModel) {
    this.reactions.push(r);
  }

  addEmptyReaction() {
    this.addReaction(new ReactionModel(this));
  }

  addIndependentReactions(variable: string, startIndex: number, endIndex: number) {
    for (let i = startIndex; i <= endIndex; i++) {
      let r = new ReactionModel(this);
      r.left = variable + i;
      r.arrow = Arrow.BothWays;
      r.right = "";
      this.addReaction(r);
    }
  }

  removeReaction(index: number) {
    this.reactions.splice(index, 1);
    if (this.reactions.length < 1) {
      this.addReaction(new ReactionModel(this));
    }
  }

  clearReactions() {
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

  constructor(reactionNetwork: ReactionNetworkModel) {
    this.reactionNetwork = reactionNetwork;
    this.reactKey = reactionNetwork.reactionKeyGenerator.next();
  }

  @computed get asReaction(): R.Reaction {
    let reactant = ReactionModel.inputToComplex(this.left || "0");
    let product = ReactionModel.inputToComplex(this.right || "0");

    if (this.arrow === Arrow.ToLeft) {
      [reactant, product] = [product, reactant];
    }
    let reversible = this.arrow === Arrow.BothWays;

    return new R.Reaction(reactant, product, reversible);
  }

  static inputToComplex(inputString: string): R.Complex {
    inputString = inputString.trim();
    if (inputString === "0") {
      return [];
    }

    let terms = (
      inputString
        .split(/\s*\+\s*/)
        .map(str => {
          let g = str.match(/^(\d*)\s*(\S+)$/);
          // TODO: Check if match fails
          let coeff = g[1] ? parseInt(g[1]) : 1;
          let species = g[2];
          return new R.Term(coeff, species);
        })
    );

    return terms;
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
