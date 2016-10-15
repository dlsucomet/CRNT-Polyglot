import * as RN from '../../shared/reaction-network';
import FileGenerator from './file-generator';


export default class ControlFileGenerator implements FileGenerator {
  name = "CoNtRol";
  description = "Upload on the left sidebar";
  fileExtension = ".txt";
  generateFile(reactionNetwork: RN.ReactionNetwork): string {
    return generateFile(reactionNetwork);
  }
}


function generateFile(rn: RN.ReactionNetwork): string {
  return rn.reactions.map(convertReaction).join("");
}

function convertReaction(r: RN.Reaction): string {
  let left = r.reactant.join(" + ") || "0";
  let right = r.product.join(" + ") || "0";
  let arrow = r.reversible ? "<-->" : "-->";
  return left + " " + arrow + " " + right + "\n";
}
