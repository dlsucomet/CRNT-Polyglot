import { TestFile, Tester } from './test-runner'

import * as R from '../src/reactions';
import { generateFile } from '../src/formats/ernest';

export class Test implements TestFile {
  name = "ERNEST File Generation";

  run(t: Tester) {
    let rn = R.ReactionNetwork.fromString([
      "# Sample Model",
      "X1 <-> 7X2",
      "C4 -> 2X3 + X2",
      "1A + NC + 7S -> A1 + S7",
      "0 -> X5",
    ].join("\n"));

    let str = generateFile(rn);
    t.test(str === [
      "clear model",
      "",
      "model.id = 'Sample_Model';",
      "model.name = 'Sample Model';",
      "model.species = struct('id', {'A', 'A1', 'C4', 'NC', 'S', 'S7' 'X1', 'X2', 'X3', 'X5'});",
      "model.reaction(1) = struct('id', 'X1<->7X2', 'reactant', struct('species', 'X1', 'stoichiometry', 1), 'product', struct('species', 'X2', 'stoichiometry', 7), 'reversible', true);",
      "model.reaction(2) = struct('id', 'C4->2X3+X2', 'reactant', struct('species', 'C4', 'stoichiometry', 1), 'product', struct('species', {'X3', 'X2'}, 'stoichiometry', {2, 1}), 'reversible', false);",
      "model.reaction(3) = struct('id', 'A+NC+7S->A1+S7', 'reactant', struct('species', {'A', 'NC', 'S'}, 'stoichiometry', {1, 1, 7}), 'product', struct('species', {'A1', 'S7'}, 'stoichiometry', {1, 1}), 'reversible', false);",
      "model.reaction(4) = struct('id', '0->X5', 'reactant', struct([]), 'product', struct('species', 'X5', 'stoichiometry', 1), 'reversible', false);",
      "",
      "disp(['Model: ' model.name]);",
      "model_analysis(model);",
      "",
    ].join("\n"));
  }
}
