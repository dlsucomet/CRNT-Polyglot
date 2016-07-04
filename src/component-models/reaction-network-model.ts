import {observable} from 'mobx';

import {ReactionModel, Arrow} from '../component-models/reaction-model';

export default class ReactionNetworkModel {
  @observable modelName: string = "";
  @observable reactions: Array<ReactionModel> = [new ReactionModel(this)];

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
      r.arrow = Arrow.Both;
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
    this.reactions = [new ReactionModel(this)];
  }
}
