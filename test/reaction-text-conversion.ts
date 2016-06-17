import { TestFile, Tester } from './test-runner'

import * as R from '../src/reaction';

export class Test implements TestFile {
  name = "Reaction Text Conversion";

  run(t: Tester) {
    let rn: R.ReactionNetwork = [
      new R.Reaction([new R.Term(1, "X1"), new R.Term(1, "X2")], [new R.Term(2, "X2"), new R.Term(1, "X3")]),
      new R.Reaction([new R.Term(1, "X4")], [], true),
    ];

    let str = R.rNetworkToString(rn);
    t.test(str === [
      "X1 + X2 -> 2X2 + X3",
      "X4 <-> 0",
    ].join("\n"));

    let undoRedo = R.rNetworkToString(R.rNetworkFromString(str));
    t.test(str === undoRedo, "toString and fromString must be inverses of each other");
  }
}
