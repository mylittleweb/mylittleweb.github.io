import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Map, MapConfig} from "./map";


@Injectable()
export class MapService {

  mapObservable = new BehaviorSubject<Map | undefined>(undefined);

  constructor() { }

  newMap(config: MapConfig) {
    const p = new Map(config);
    this.mapObservable.next(p);
  }
}
