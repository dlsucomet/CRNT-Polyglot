import { ReactionNetwork, Reaction, Complex, Term } from './reaction';

import * as ControlFormat from './formats/control';

let R: ReactionNetwork = new ReactionNetwork("Test Model", [
  new Reaction([new Term(1, "X1"), new Term(1, "X2")], [new Term(2, "X2"), new Term(1, "X3")]),
  new Reaction([new Term(1, "X4")], [], true),
]);

console.log("Reaction:");
console.log(R.toString());

console.log("Control:");
console.log(ControlFormat.generateFile(R));
