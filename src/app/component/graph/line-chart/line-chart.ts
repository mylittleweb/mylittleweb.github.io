import {BehaviorSubject} from "rxjs";

export type Point = {
  x: number;
  y: number;
};

export class ChartDef {
  private _data = new BehaviorSubject<Point[]>([]);

  constructor(public name: string) {
  }

  addData(data: Point[]) {
    const d = this._data.getValue();
    d.push(...data);
    this._data.next(d);
  }

  setData(data: Point[]) {
    this._data.next(data);
  }

  obData() {
    return this._data;
  }
}
