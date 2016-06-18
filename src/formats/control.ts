import {ReactionNetwork, Reaction} from '../reaction';

export function generateFile(rn: ReactionNetwork, modelName?: string): string {
  return rn.map(convertReaction).join("\n");
}

function convertReaction(r: Reaction): string {
  let left = r.reactant.length ? r.reactant.join(" + ") : "0";
  let right = r.product.length ? r.product.join(" + ") : "0";
  var arrow = r.reversible ? "<-->" : "-->";
  return left + " " + arrow + " " + right;
}
