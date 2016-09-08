import {observable, action} from 'mobx';

export default class FormModel {
  @observable variable: string = "X";
  @observable startIndex: number = 1;
  @observable endIndex: number = 10;
  
  @action setVariable(varName: string) {
    this.variable = varName;
  }

  @action setStartIndex(n: number) {
    this.startIndex = n;
  }

  @action setEndIndex(n: number) {
    this.endIndex = n;
  }
}
