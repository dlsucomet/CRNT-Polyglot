import { TestFile, Tester } from './test-runner'

import * as R from '../src/reaction';

export class Test implements TestFile {
  name = "Reaction Text Conversion";

  run(t: Tester) {
    let rn = new R.ReactionNetwork("Test Model", [
      new R.Reaction([new R.Term(1, "X1"), new R.Term(1, "X2")], [new R.Term(2, "X2"), new R.Term(1, "X3")]),
      new R.Reaction([new R.Term(1, "X4")], [], true),
    ]);

    let str = rn.toString();
    t.test(str === [
      "# Test Model",
      "X1 + X2 -> 2X2 + X3",
      "X4 <-> 0",
    ].join("\n"));

    let undoRedo = R.ReactionNetwork.fromString(str).toString();
    t.test(str === undoRedo, "toString and fromString must be inverses of each other");
  }
}
