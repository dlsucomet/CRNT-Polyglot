import { ReactionNetwork, Reaction, Complex, Term } from './reaction';

let R: ReactionNetwork = [
  new Reaction([new Term(1, "X1"), new Term(1, "X2")], [new Term(2, "X2"), new Term(1, "X3")]),
  new Reaction([new Term(1, "X4")], [], true),
];

console.log(R);
