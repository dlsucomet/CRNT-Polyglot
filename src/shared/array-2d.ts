class Array2D<T> {
  public numRows: number;
  public numCols: number;
  private values: Array<T>;

  constructor(numRows: number, numCols: number, defaultVal: T) {
    this.numRows = numRows;
    this.numCols = numCols;
    let numValues = numRows * numCols;
    this.values = new Array<T>(numValues);

    for (let i = 0; i < numValues; i++) {
      this.values[i] = defaultVal;
    }
  }

  get(row: number, col: number) {
    return this.values[row * this.numCols + col];
  }

  set(row: number, col: number, value: T) {
    this.values[row * this.numCols + col] = value;
  }

  map<U>(f: (x: T) => U): Array2D<U> {
    let numRows = this.numRows;
    let numCols = this.numCols;
    let result = new Array2D(numRows, numCols, null);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        result.set(row, col, f(this.get(row, col)));
      }
    }

    return result;
  }

  transpose(): Array2D<T> {
    let numRows = this.numCols;
    let numCols = this.numRows;
    let result = new Array2D(numRows, numCols, null);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        result.set(row, col, this.get(col, row));
      }
    }

    return result;
  }

  toString(): string {
    let out = "";
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        out += this.get(row, col) + " ";
      }
      out += "\n";
    }
    return out;
  }
}

export default Array2D;
