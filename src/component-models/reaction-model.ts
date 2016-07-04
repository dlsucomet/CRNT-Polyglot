import {observable, computed} from 'mobx';

import ReactionNetworkModel from './reaction-network-model';
import {Reaction, Complex, Term} from '../reactions';

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

  @computed get asReaction(): Reaction {
    let reactant = toComplex(this.left || "0");
    let product = toComplex(this.right || "0");

    if (this.arrow === Arrow.ToLeft) {
      [reactant, product] = [product, reactant];
    }
    let reversible = this.arrow === Arrow.BothWays;

    return new Reaction(reactant, product, reversible);
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

function toComplex(inputString: string): Complex {
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
        return new Term(coeff, species);
      })
  );

  return terms;
}
