import {ReactionNetwork, Reaction, Complex} from '../reaction';

export function generateFile(rn: ReactionNetwork): string {
  let buffer = "";
  buffer += braces(rn.modelName);
  buffer += braces("");  // model description
  buffer += "#3";  // custom species
  buffer += braces(rn.getSpecies());

  // TODO: create a better abstraction for this  
  let complexList = [];
  function complexId(complex: Complex): number {
    // TODO: fix such that the order of the species does not matter
    let complexString = complex.length ? complex.join(" + ") : "0";
    let id = complexList.indexOf(complexString);
    if (id !== -1) {
      return id + 1;
    } else {
      complexList.push(complexString);
      return complexList.length;
    }
  }

  let reactionsOutput = [];
  for (let r of rn.reactions) {
    let left = complexId(r.reactant);
    let right = complexId(r.product);
    let reversible = r.reversible ? "R" : "N";
    reactionsOutput.push([left, right, reversible].join(","));
  }

  buffer += braces(complexList);
  buffer += braces(reactionsOutput, "");
  return buffer;
}

function braces(item: string|Array<any>, separator: string = ",") {
  if (typeof item === "string") {
    return "{" + item + "}";
  } else {
    return "{" + item.join(separator) + "}";
  }
}
