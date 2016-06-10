import { ReactionNetwork, Reaction, Complex, Term, rNetworkToString, rNetworkFromString } from './reaction';

let R: ReactionNetwork = [
  new Reaction([new Term(1, "X1"), new Term(1, "X2")], [new Term(2, "X2"), new Term(1, "X3")]),
  new Reaction([new Term(1, "X4")], [], true),
];

console.log(rNetworkToString(R));
console.log(rNetworkToString(rNetworkFromString(rNetworkToString(R))));
console.log(rNetworkToString(rNetworkFromString(rNetworkToString(R))) === rNetworkToString(R));
