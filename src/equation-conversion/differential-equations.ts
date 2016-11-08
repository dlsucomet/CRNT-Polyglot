/***************************************************************
  Data Structures for Reaction Networks

  This file implements the data structures used to represent
  a reaction network. The data structures include the ff:
    1. Reaction Network
    2. Reaction
    3. Complex
    4. Term

***************************************************************/
export { SystemOfEquations, DifferentialEquation, Term, Sign, Factor };
import Array2D from '../shared/array-2d';
import IndexedSet from '../shared/indexed-set';

import { naturalSort } from '../shared/utils';

/***************************************************************
  Reaction Network

  A reaction network is simply a list of reactions with a name.

***************************************************************/
class SystemOfEquations {
  public modelName: string;
  public variables: IndexedSet<string>;
  public terms: IndexedSet<Term>;
  public matrix: Array2D<number>;
  public equations: Array<DifferentialEquation>;

  constructor(
    modelName: string, 
    equations: Array<DifferentialEquation>
  ) {
    let eqVars = flatMap(equations, eq => eq.getVariables());
    let eqTerms = flatMap(equations, eq => eq.getTerms());

    let vars = new IndexedSet<string>();
    naturalSort(eqVars);
    vars.putAll(eqVars);
    let terms = new IndexedSet<Term>();
    terms.putAll(eqTerms);

    let m = new Array2D(vars.length, terms.length, 0);

    for (let eq of equations) {
      let v = vars.indexOf(eq.variable);
      for (let elem of eq.derivative) {
        let t = terms.indexOf(elem.term);
        m.set(v, t, signum(elem.sign));
      }
    }

    this.modelName = modelName;
    this.terms = terms;
    this.variables = vars;
    this.matrix = m;
    this.equations = equations;
  }

  toString(): string {
    return "TODO";
  }
}

function flatMap<T, U>(arr: Array<T>, f: (x: T) => Array<U>): Array<U> {
  return flatten(arr.map(f));
}

function flatten<T>(arr: Array<Array<T>>): Array<T> {
  // OR arr.reduce((a, b) => a.concat(b))
  return [].concat.apply([], arr);
}

function signum(n: number): number {
  if (n > 0) {
    return 1;
  } else if (n < 0) {
    return -1;
  } else {
    return 0;
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
class DifferentialEquation {
  constructor(
    public variable: string,
    public derivative: Array<SignedTerm>
  ) { }

  toString(): string {
    return this.variable + " = " + "TODO";
  }

  getVariables(): Array<string> {
    let vars = flatMap(this.derivative, st => st.term.getVariables());
    vars.push(this.variable);
    return vars;
  }

  getTerms(): Array<Term> {
    return this.derivative.map(st => st.term);
  }
}

type SignedTerm = { sign: Sign, term: Term };

enum Sign { Positive = 1, Negative = -1, Zero = 0 }; // TODO: zero or no zero?

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
    public coefficient: string,
    public factors: Array<Factor>
  ) { }

  toString(): string {
    if (this.coefficient === "1") {
      return this.factors.join("*");
    }

    return this.coefficient + "*" + this.factors.join("*");
  }

  static fromString(s: string): Term {
    let factors = s.split(" ");
    let coeff = "1";
    if (/^\d+$|^[a-z][a-zA-Z_0-9]*$/.test(factors[0])) {
      coeff = factors[0];
      factors.shift();
    }

    return new Term(coeff, factors.map(Factor.fromString));
  }

  getVariables(): Array<string> {
    return this.factors.map(f => f.variable);
  }
}



class Factor {
  constructor(
    public variable: string,
    public exponent: string,
  ) {}

  toString(): string {
    if (this.exponent === "1") {
      return this.variable;
    }

    return this.variable + "^" + this.exponent;
  }

  static fromString(s: string): Factor {
    let match = s.match(/([A-Z][a-zA-Z_0-9]*)(\^\-?\d+(\.\d+)?)?/);
    return new Factor(match[1], match[2] ? match[2].substring(1) : "1");
  }
}
