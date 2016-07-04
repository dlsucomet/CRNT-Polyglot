import {observable} from 'mobx';

import ReactionNetworkModel from './reaction-network-model';

export class ReactionModel {
  reactKey: number;
  reactionNetwork: ReactionNetworkModel;

  @observable left: string = "";
  @observable right: string = "";
  @observable arrow: Arrow = Arrow.ToRight;

  constructor(reactionNetwork: ReactionNetworkModel) {
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
