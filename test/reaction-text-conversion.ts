let numTests = 0;
let numPass = 0;

function test(bool: boolean, description: string = null) {
  numTests++;
  if (bool) {
    numPass++;
  } else {
    console.error("FAILED: " + (description || "test #" + numTests));
  }
}

console.log("==== TESTING: Reaction Text Conversion ====");
let startTime = new Date().getTime();

import { ReactionNetwork, Reaction, Complex, Term, rNetworkToString, rNetworkFromString } from '../src/reaction';

let rn: ReactionNetwork = [
  new Reaction([new Term(1, "X1"), new Term(1, "X2")], [new Term(2, "X2"), new Term(1, "X3")]),
  new Reaction([new Term(1, "X4")], [], true),
];

let str = rNetworkToString(rn);
test(str === `
X1 + X2 -> 2X2 + X3
X4 <-> 0
`.trim());

let undoRedo = rNetworkToString(rNetworkFromString(str));
test(str === undoRedo, "toString and fromString must be inverses of each other");

let endTime = new Date().getTime();
console.log(`==== RESULT: ${numPass}/${numTests} cases passed (took ${(endTime - startTime)/1000}s) ====\n`);
