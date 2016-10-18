class IndexedSet<T> {
  private indices: {[key: string]: number} = Object.create(null);
  private objects: Array<T> = [];

  put(obj: T) {
    let index = this.indices[obj.toString()];
    if (index !== undefined) {
      return;
    }

    index = this.objects.length;
    this.objects.push(obj);
    this.indices[obj.toString()] = index;
  }

  putAll(array: Array<T>) {
    for (let elem of array) {
      this.put(elem);
    }
  }

  get(index: number): T {
    return this.objects[index];
  }

  indexOf(obj: T): number {
    return this.indices[obj.toString()];
  }

  get length(): number {
    return this.objects.length;
  }

  toArray(): Array<T> {
    // slice to clone the array
    return this.objects.slice();
  }
}

export default IndexedSet;
