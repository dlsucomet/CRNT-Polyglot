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

  toString(): string {
    let left = this.reactant.length ? this.reactant.join(" + ") : "0";
    let right = this.product.length ? this.product.join(" + ") : "0";
    let arrow = this.reversible ? " <-> " : " -> ";    
    return left + arrow + right;
  }

  static fromString(s: string): Reaction {
    let sides = s.split(/ (<->|->) /);
    let left = sides[0], right = sides[2];
    let reactant = left === "0" ? [] : left.split(" + ").map(Term.fromString);
    let product = right === "0" ? [] : right.split(" + ").map(Term.fromString);
    let reversible = sides[1] ===  "<->";
    return new Reaction(reactant, product, reversible);
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

  toString(): string {
    if (this.coefficient === 1) {
      return this.species;
    } else {
      return this.coefficient + this.species; 
    }
  }

  static fromString(s: string): Term {
    let m = s.match(/(\d+)?(\w+)/);
    let coeff = m[1] ? parseInt(m[1]) : 1;
    let species = m[2];
    return new Term(coeff, species);
  }
}

function rNetworkToString(rn: ReactionNetwork) {
  return rn.join("\n");
}

function rNetworkFromString(s: String) {
  return s.split("\n").map(Reaction.fromString);
}


export { ReactionNetwork, Reaction, Complex, Term, rNetworkToString, rNetworkFromString };
