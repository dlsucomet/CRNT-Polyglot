class ReactionNetwork {
  constructor(
    public modelName: string, 
    public reactions: Array<Reaction>
  ) { }

  getSpecies(): Array<string> {
    let resultSet = Object.create(null);
    for (let r of this.reactions) {
      r.reactant.forEach(term => resultSet[term.species] = true);
      r.product.forEach(term => resultSet[term.species] = true);
    }
    return Object.keys(resultSet);
  }

  toString(): string {
    return "# " + this.modelName + "\n" + this.reactions.join("\n");
  }

  static fromString(s: string): ReactionNetwork {
    let lines = s.split("\n");
    let modelName = lines[0].substring(2);
    let reactions = lines.slice(1).map(Reaction.fromString);
    return new ReactionNetwork(modelName, reactions);
  }
}

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

type Complex = Array<Term>;

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


export { ReactionNetwork, Reaction, Complex, Term };
