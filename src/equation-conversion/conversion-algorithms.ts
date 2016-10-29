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
  let reactants = sys.matrix.map(x => x < 0 ? 1 : 0).transpose();
  let products = sys.matrix.map(x => x > 0 ? 1 : 0).transpose();
  let vars = sys.variables.toArray();

  return reactionNetworkFromMatrices(sys.modelName, reactants, products, vars);
}

function totalReactionNetwork(sys: SystemOfEquations): RN.ReactionNetwork {
  let numReactions = sys.terms.length;
  let numVars = sys.variables.length;
  let reactants = new Array2D(numReactions, numVars, 0);
  let products = new Array2D(numReactions, numVars, 0);

  for (let row = 0; row < numReactions; row++) {
    let term = sys.terms.get(row);
    for (let factor of term.factors) {
      let col = sys.variables.indexOf(factor.variable);
      reactants.set(row, col, 1);
      products.set(row, col, 1);
    }
  }

  for (let i = 0; i < numVars; i++) {
    for (let j = 0; j < numReactions; j++) {
      // products.set(j, i, products.get(j, i) + sys.matrix.get(i, j));
      switch(sys.matrix.get(i, j)) {
        case 1:
          products.set(j, i, products.get(j, i) + 1);
          break;
        case -1:
          products.set(j, i, products.get(j, i) - 1);
          break;
      }
    }
  }

  let vars = sys.variables.toArray();
  return reactionNetworkFromMatrices(sys.modelName, reactants, products, vars);
}

function reactionNetworkFromMatrices(
  modelName: string,
  reactants: Array2D<number>,
  products: Array2D<number>,
  variables: Array<string>
): RN.ReactionNetwork {
  if (
    reactants.numRows !== products.numRows ||
    reactants.numCols !== products.numCols ||
    reactants.numCols !== variables.length
  ) {
    throw "ERROR";
  }

  let numReactions = reactants.numRows;
  let reactions: Array<RN.Reaction> = new Array(numReactions);

  for (let i = 0; i < numReactions; i++) {
    let left = getTerms(reactants, variables, i);
    let right = getTerms(products, variables, i);
    reactions[i] = new RN.Reaction(left, right, false);
  }

  return new RN.ReactionNetwork(modelName, reactions);
}

function getTerms(matrix: Array2D<number>, variables: Array<string>, row: number): Array<RN.Term> {
  let result = [];

  for (let col = 0; col < variables.length; col++) {
    let coeff = matrix.get(row, col);
    if (coeff !== 0) {
      let term = new RN.Term(coeff, variables[col]);
      result.push(term);
    }
  }

  return result;
}
