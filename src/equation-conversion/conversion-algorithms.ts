import { SystemOfEquations, Term } from './differential-equations';
import * as RN from '../shared/reaction-network';
import Array2D from '../shared/array-2d';

export {complexVector, kineticOrderMatrix, stoichiometricMatrix, stoicReactionNetwork, totalReactionNetwork};

function complexVector(sys: SystemOfEquations): Array<Term> {
  return sys.terms.toArray();
}

function kineticOrderMatrix(sys: SystemOfEquations): Array2D<string> {
  let numRows = sys.terms.length;
  let numCols = sys.variables.length;
  let matrix = new Array2D(numRows, numCols, "0");

  for (let row = 0; row < numRows; row++) {
    let term = sys.terms.get(row);
    for (let factor of term.factors) {
      let col = sys.variables.indexOf(factor.variable);
      matrix.set(row, col, factor.exponent);
    }
  }

  return matrix;
}

function stoichiometricMatrix(sys: SystemOfEquations): Array2D<string> {
  let numRows = sys.variables.length;
  let numCols = sys.terms.length;
  let matrix = new Array2D<string>(numRows, numCols, "0");

  for (let col = 0; col < numCols; col++) {
    let coeff = sys.terms.get(col).coefficient;
    for (let row = 0; row < numRows; row++) {
      let sign = sys.matrix.get(row, col);
      if (sign !== 0) {
        let val = multiply(sign, coeff);
        matrix.set(row, col, val);
      }
    }
  }

  return matrix;
}

function multiply(sign: number, coeff: string): string {
    switch(sign) {
      case 1: return coeff;
      case 0: return "0";
      case -1: return "-" + coeff;
    }
}

function stoicReactionNetwork(sys: SystemOfEquations): RN.ReactionNetwork {
  let reactions = [];

  for (let col = 0; col < sys.terms.length; col++) {
    let reactant = [];
    let product = [];

    for (let row = 0; row < sys.variables.length; row++) {
      let sign = sys.matrix.get(row, col);
      if (sign === 0) {
        continue;
      }

      let species = sys.variables.get(row);
      let term = new RN.Term(1, species);
      if (sign < 0) {
        reactant.push(term);
      } else {
        product.push(term);
      }
    }

    reactions.push(new RN.Reaction(reactant, product));
  }

  return new RN.ReactionNetwork(sys.modelName, reactions);
}

function totalReactionNetwork(sys: SystemOfEquations): RN.ReactionNetwork {
  let numTerms = sys.terms.length;
  let numVars = sys.variables.length;
  let reactions = [];

  for (let i = 0; i < numTerms; i++) {
    let variables = [];
    for (let factor of sys.terms.get(i).factors) {
      variables.push(new RN.Term(1, factor.variable));
    }
    let baseReaction = new RN.Reaction(variables, variables);

    let positives = [];
    let negatives = [];
    for (let j = 0; j < numVars; j++) {
      let sign = sys.matrix.get(j, i);
      if (sign === 0) {
        continue;
      }

      let v = sys.variables.get(j);
      if (sign > 0) {
        positives.push(v);
      } else {
        negatives.push(v);
      }
    }

    if (positives.length === 0) {
      for (let v of negatives) {
        let r = baseReaction.addProduct(new RN.Term(-1, v));
        reactions.push(r);
      }
    } else if (negatives.length === 0) {
      for (let v of positives) {
        let r = baseReaction.addProduct(new RN.Term(1, v));
        reactions.push(r);
      }
    } else {
      for (let p of positives) {
        for (let n of negatives) {
          let r = baseReaction
            .addProduct(new RN.Term(1, p))
            .addProduct(new RN.Term(-1, n))
          ;
          reactions.push(r);
        }
      }
    }
  }

  return new RN.ReactionNetwork(sys.modelName, reactions);
}
