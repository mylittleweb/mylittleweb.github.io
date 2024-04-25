import {BehaviorSubject} from "rxjs";

export type ChartDataDef = {
  label: number;
  data: number[];
};

export class ChartDef {
  private _data = new BehaviorSubject<ChartDataDef[]>([]);

  constructor(public name: string) {
  }

  addData(data: ChartDataDef[]) {
    const d = this._data.getValue();
    d.push(...data);
    this._data.next(d);
  }

  obData() {
    return this._data;
  }
}
