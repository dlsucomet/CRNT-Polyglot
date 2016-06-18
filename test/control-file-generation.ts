import { TestFile, Tester } from './test-runner'

import * as R from '../src/reaction';
import { generateFile } from '../src/formats/control';

export class Test implements TestFile {
  name = "CoNtRol File Generation";

  run(t: Tester) {
    let rn: R.ReactionNetwork = [
      new R.Reaction([new R.Term(1, "X1"), new R.Term(1, "X2")], [new R.Term(2, "X2"), new R.Term(1, "X3")]),
      new R.Reaction([new R.Term(1, "X4")], [], true),
    ];

    let str = generateFile(rn);
    t.test(str === [
      "X1 + X2 --> 2X2 + X3",
      "X4 <--> 0",
      "",
    ].join("\n"));


    rn = R.rNetworkFromString([
      "X1 <-> 7X2",
      "C4 -> 2X3 + X2",
      "1A + NC + 7S -> A1 + S7",
      "0 -> X5",
    ].join("\n"));

    str = generateFile(rn);
    t.test(str === [
      "X1 <--> 7X2",
      "C4 --> 2X3 + X2",
      "A + NC + 7S --> A1 + S7",
      "0 --> X5",
      "",
    ].join("\n"));
  }
}
