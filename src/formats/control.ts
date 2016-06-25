import {ReactionNetwork, Reaction} from '../reactions';

export function generateFile(rn: ReactionNetwork): string {
  return rn.reactions.map(convertReaction).join("");
}

function convertReaction(r: Reaction): string {
  let left = r.reactant.join(" + ") || "0";
  let right = r.product.join(" + ") || "0";
  let arrow = r.reversible ? "<-->" : "-->";
  return left + " " + arrow + " " + right + "\n";
}
