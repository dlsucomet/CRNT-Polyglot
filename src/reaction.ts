type ReactionNetwork = Array<Reaction>;

class Reaction {
  reactant: Complex;
  product: Complex;
  reversible: boolean;

  constructor(reactant: Complex, product: Complex, reversible: boolean = false) {
    this.reactant = reactant;
    this.product = product;
    this.reversible = reversible;
  }
}

type Complex = Array<Term>;

class Term {
  coefficient: number;
  species: string;

  constructor(coefficient: number, species: string) {
    this.coefficient = coefficient;
    this.species = species;
  }
}


export { ReactionNetwork, Reaction, Complex, Term };
