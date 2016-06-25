import { TestFile, Tester } from './test-runner'

import * as R from '../src/reaction';
import { generateFile } from '../src/formats/crntoolbox';

export class Test implements TestFile {
  name = "CRNToolbox File Generation";

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
      "{Sample Model}{}#3",
      "{X1,X2,C4,X3,A,NC,S,A1,S7,X5}",
      "{X1,7X2,C4,2X3 + X2,A + NC + 7S,A1 + S7,0,X5}",
      "{1,2,R3,4,N5,6,N7,8,N}",
    ].join(""));
  }
}
