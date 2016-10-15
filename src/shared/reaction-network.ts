/***************************************************************
  Data Structures for Reaction Networks

  This file implements the data structures used to represent
  a reaction network. The data structures include the ff:
    1. Reaction Network
    2. Reaction
    3. Complex
    4. Term

***************************************************************/
export { ReactionNetwork, Reaction, Complex, Term };


/***************************************************************
  Reaction Network

  A reaction network is simply a list of reactions with a name.

***************************************************************/
class ReactionNetwork {
  constructor(
    public modelName: string, 
    public reactions: Array<Reaction>
  ) { }

  // returns an array containing all the species in the
  // reaction network without any duplicates
  getSpecies(): Array<string> {
    let resultSet = Object.create(null);
    for (let r of this.reactions) {
      r.reactant.forEach(term => resultSet[term.species] = true);
      r.product.forEach(term => resultSet[term.species] = true);
    }
    return Object.keys(resultSet);
  }

  // returns a simple string representation of the reaction network
  toString(): string {
    let output = "";
    output += "Model Name: " + this.modelName + "\n";
    output += this.reactions.join("\n") + "\n";
    return output;
  }

  // creates a reaction network from the simple string representation
  static fromString(s: string): ReactionNetwork {
    let lines = s.trim().split("\n");
    let modelName = lines[0].substring("Model Name: ".length);
    let reactions = lines.slice(1).map(Reaction.fromString);
    return new ReactionNetwork(modelName, reactions);
  }
}


/***************************************************************
  Reaction

  A reaction consists of two parts: the reactant (on the left)
  and the product (on the right). A reaction is reversible if
  the two parts can be interchanged.

  Examples:

    2X1 -> X2 + X3
      `2X1` is the reactant and `X2 + X3` is the product.
      This reaction is NOT reversible.

    X4 + X5 <-> 0
      `X4 + X5` is the reactant and the product is empty.
      This reaction is reversible.

***************************************************************/
class Reaction {
  constructor(
    public reactant: Complex, 
    public product: Complex, 
    public reversible: boolean = false
  ) { }

  toString(): string {
    let left = this.reactant.join(" + ") || "0";
    let right = this.product.join(" + ") || "0";
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


/***************************************************************
  Complex

  A complex is a list of terms that are summed. For example,
  the complex `X1 + X2 + X3` consists of the terms `X1`, `X2`,
  and `X3`.

***************************************************************/
type Complex = Array<Term>;


/***************************************************************
  Term

  A term consists of a species (or variable) and a coefficient.
  For example, the term `2X1` has a coefficeint of 2 and
  has `X1` as its species. Like in algebra, if no coefficient
  is specified, it is assumed to be 1. Therefore the term `X2`
  has a coefficient of 1.

***************************************************************/
class Term {
  constructor(
    public coefficient: number, 
    public species: string
  ) { }

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
