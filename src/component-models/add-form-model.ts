import {observable} from 'mobx';

export default class FormModel {
  @observable variable: string = "X";
  @observable startIndex: number = 1;
  @observable endIndex: number = 10;
}
