export default class ReactKeyGenerator {
  nextKey: number;

  constructor() {
    this.reset();
  }

  next(): number {
    return this.nextKey++;
  }

  reset(start: number = 0) {
    this.nextKey = start;
  }
}
