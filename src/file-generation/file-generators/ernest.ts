import * as RN from '../../shared/reaction-network';
import FileGenerator from './file-generator';


export default class ErnestFileGenerator implements FileGenerator {
  name = "ERNEST";
  description = "Open in MATLAB";
  fileExtension = ".m";
  generateFile(reactionNetwork: RN.ReactionNetwork): string {
    return generateFile(reactionNetwork);
  }
}


function generateFile(rn: RN.ReactionNetwork): string {
  let outputLines = [];
  function addLine(...args) {
    outputLines.push(fillBlanks.apply(null, args));
  }

  addLine("clear model");
  addLine("");
  
  let name = rn.modelName;
  addLine("model.id = '__';", name.replace(/\s+/g, '_'));
  addLine("model.name = '__';", name);
  
  let speciesList = rn.getSpecies().sort().map(enquote);
  addLine("model.species = struct('id', __);", speciesList);
  let reactions = rn.reactions;
  reactions.forEach((r, i) =>
    addLine("model.reaction(__) = __;", (i+1), convertReaction(r))
  );
  
  addLine("");
  addLine("disp(['Model: ' model.name]);");
  addLine("model_analysis(model);");
  addLine("");
  
  return outputLines.join("\n");
}

function convertReaction(r: RN.Reaction): string {
  let id = reactionString(r);
  let reactant = convertComplex(r.reactant);
  let product = convertComplex(r.product);
  return fillBlanks(
    "struct('id', __, 'reactant', __, 'product', __, 'reversible', __)",
      enquote(id), reactant, product, r.reversible
  );
}

function reactionString(r: RN.Reaction): string {
  let left = r.reactant.join("+") || "0";
  let right = r.product.join("+") || "0";
  let arrow = r.reversible ? "<->" : "->";
  return left + arrow + right;
}

function convertComplex(complex: RN.Complex): string {
  if (complex.length === 0) {
    return "struct([])";
  }

  let species = complex.map(term => enquote(term.species));
  let stoich = complex.map(term => term.coefficient);
  return fillBlanks("struct('species', __, 'stoichiometry', __)", species, stoich);
}

function fillBlanks(template: string, ...replacements): string {
  let i = 0;
  return template.replace(/__/g, () => {
    let r = replacements[i++];
    return r instanceof Array ? encodeArray(r) : r;
  });
}

function enquote(str: string): string {
  return "'" + str + "'";
}

function encodeArray(arr: Array<any>): string {
  if (arr.length === 1) {
      return arr[0];
  } else {
      return "{" + arr.join(", ") + "}";
  }
}
