export interface Problem<State, Action> {
  initialState(): Node<State, Action>;
  isGoal(node: Node<State, Action>): boolean;
  expand(node: Node<State, Action>): Node<State, Action>[];
}

export class Node<State, Action> {
  constructor(
    private state: State,
    private action: Action,
    private cost: number,
    private parent: Node<State, Action>
  ) {}

  static getInstance<State, Action>(s: State, a: Action, cost: number, parent: Node<State, Action>) {
    return new Node<State, Action>(s, a, cost, parent);
  }

  getParent() {
    return this.parent;
  }

  getCost() {
    return this.cost;
  }

  getAction() {
    return this.action;
  }

  getState() {
    return this.state;
  }
}
