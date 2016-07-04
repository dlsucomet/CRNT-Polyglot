import {observable} from 'mobx';

import ReactionNetworkModel from './reaction-network-model';

export default class FormModel {
  reactionNetwork: ReactionNetworkModel;

  @observable variable: string = "X";
  @observable startIndex: number = 1;
  @observable endIndex: number = 10;

  constructor(reactionNetwork: ReactionNetworkModel) {
    this.reactionNetwork = reactionNetwork;
  }
}
