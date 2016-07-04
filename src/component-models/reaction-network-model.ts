import {observable, computed} from 'mobx';

import {ReactionModel, Arrow} from '../component-models/reaction-model';
import {ReactionNetwork} from '../reactions';

import ReactKeyGenerator from '../react-key-generator';

export default class ReactionNetworkModel {
  reactionKeyGenerator: ReactKeyGenerator = new ReactKeyGenerator();

  @observable modelName: string = "";
  @observable reactions: Array<ReactionModel> = [new ReactionModel(this)];

  @computed get asReactionNetwork(): ReactionNetwork {
    let modelName = this.modelName || "Unnamed Model";
    let reactions = this.reactions.map(r => r.asReaction);
    return new ReactionNetwork(modelName, reactions);
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
