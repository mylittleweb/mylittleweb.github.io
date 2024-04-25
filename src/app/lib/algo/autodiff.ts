export class Value {
  grad = 0.0;
  _backward = () => undefined;
  _forward = () => undefined;
  label: string = "";

  constructor(public data: number, public children: Value[] = []) {}

  add(other: Value | number) {
    if (!(other instanceof Value)) {
      other = new Value(other);
    }
    const out = new Value(this.data + other.data, [this, other]);
    out._backward = () => {
      this.grad += out.grad;
      other.grad += out.grad;
    };
    out._forward = () => {
      out.children.forEach(c => c._forward());
      out.data = out.children.reduce((acc, cur) => acc + cur.data, 0);
    };
    return out;
  }

  sub(other: Value | number) {
    if (!(other instanceof Value)) {
      other = new Value(other);
    }
    const out = new Value(this.data - other.data, [this, other]);
    out._backward = () => {
      this.grad += out.grad;
      other.grad += out.grad;
    };
    out._forward = () => {
      out.children.forEach(c => c._forward());
      out.data = out.children.reduce((acc, cur) => acc - cur.data, 0);
    };
    return out;
  }

  mul(other: Value | number) {
    if (!(other instanceof Value)) {
      other = new Value(other);
    }
    const out = new Value(this.data * other.data, [this, other]);
    out._backward = () => {
      this.grad += other.data * out.grad;
      other.grad += this.data * out.grad;
    };
    out._forward = () => {
      out.children.forEach(c => c._forward());
      out.data = out.children.reduce((acc, cur) => acc * cur.data, 1);
    };
    return out;
  }

  pow(other: number) {
    const out = new Value(this.data ** other, [this]);
    out._backward = () => {
      this.grad += other * (this.data ** (other - 1)) * out.grad;
    };
    out._forward = () => {
      this._forward();
      out.data = this.data ** other;
    };
    return out;
  }

  div(other: Value | number) {
    if (!(other instanceof Value)) {
      other = new Value(other);
    }
    const out = new Value(this.data * other.data ** -1, [this, other]);
    out._backward = () => {
      this.grad += 1.0 / other.data * out.grad;
      other.grad += -this.data / (other.data ** 2) * out.grad;
    };
    out._forward = () => {
      out.children.forEach(c => c._forward());
      out.data = this.data * other.data ** -1;
    };
    return out;
  }

  tanh() {
    // Write tanh in terms of e exp
    const x = this.data;
    const t = (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
    const out = new Value(t, [this]);
    out._backward = () => {
      this.grad += (1 - t ** 2) * out.grad;
    };
    out._forward = () => {
      this._forward();
      const x = this.data;
      out.data = (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
    };
    return out;
  }

  exp() {
    const t = Math.exp(this.data);
    const out = new Value(t, [this]);
    out._backward = () => {
      this.grad += out.data * out.grad;
    };
    out._forward = () => {
      this._forward();
      out.data =  Math.exp(this.data);
    };
    return out;
  }

  backward() {
    const topo: Value[] = [];

    const seen = new Set();
    const build_topo = (node: Value) => {
      if (seen.has(node)) {
        return;
      }
      seen.add(node);
      for (const child of node.children) {
        build_topo(child);
      }
      topo.push(node);
    };
    build_topo(this);

    this.grad = 1.0;
    for (const node of topo.reverse()) {
      node._backward();
    }
  }

  zero_grad() {
    this.grad = 0;
    this.children.forEach(c => c.zero_grad());
  }

  forward() {
    this._forward();
  }
}


export class Neuron {
  w: Value[] = [];
  b = new Value(Math.random() * 2 - 1);

  constructor(nin: number) {
    for (let i = 0; i < nin; i++) {
      this.w.push(new Value(Math.random() * 2 - 1));
    }
  }

  forward(x: Value[] | number[]) {
    let act = new Value(0.0);
    // wx + b
    for (let i = 0; i < this.w.length; i++) {
      act = act.add(this.w[i].mul(x[i]));
    }
    return act.add(this.b).tanh();
  }

  parameters() {
    return this.w.concat([this.b]);
  }
}

export class Layer {
  neurons: Neuron[] = [];

  constructor(nin: number, nout: number) {
    for (let i = 0; i < nout; i++) {
      this.neurons.push(new Neuron(nin));
    }
  }

  forward(x: Value[] | number[]) {
    const outs = [];
    for (let i = 0; i < this.neurons.length; i++) {
      outs.push(this.neurons[i].forward(x));
    }
    return outs;
  }

  parameters() {
    let params: Value[] = [];
    this.neurons.forEach(neuron => {
      params = params.concat(neuron.parameters());
    });
    return params;
  }
}

export class MLP {
  layers: Layer[] = [];

  constructor(nin: number, nouts: number[]) {
    const nz = [nin].concat(nouts);

    for (let i = 0; i < nouts.length; i++) {
      this.layers.push(new Layer(nz[i], nz[i + 1]));
    }
  }

  forward(x: Value[] | number[]) {

    this.layers.forEach(layer => {
      x = layer.forward(x);
    });
    return x as Value[];
  }

  parameters() {
    let params: Value[] = [];
    this.layers.forEach(layer => {
      params = params.concat(layer.parameters());
    });
    return params;
  }
}
