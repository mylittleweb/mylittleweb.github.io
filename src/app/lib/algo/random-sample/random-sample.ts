export type RandomSampleAlgorithmName = keyof typeof RandomSampleAlgorithms;

export const RandomSampleAlgorithms = {
  Uniform: uniform,
  Bernoulli: bernoulli,
  Normal: normal,
  Exponential: exponential,
  Poisson: poisson
};

function uniform(expectedValue: number): () => number {
  return () => {
    return Math.floor(Math.random() * expectedValue);
  };
}

function bernoulli(p: number): () => number {
  return () => {
    return Math.random() > p ? 1 : 0;
  };
}

function normal(mean: number, stdDev: number) {
  return () => {
    // Generate u1 in (0, 1] to avoid taking the log of 0
    const u1 = 1 - Math.random();
    const u2 = Math.random();
    // Box-Muller transform to get a standard normal value
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.floor(z0 * stdDev + mean);
  };
}

function exponential(lambda: number) {
  return () => {
    // Generate a uniform random number between 0 and 1
    const u = Math.random();
    // Use the inverse transform sampling method
    return Math.floor(-Math.log(1 - u) / lambda);
  };
}

function poisson(lambda: number) {
  return () => {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;

    do {
      k++;
      p *= Math.random();
    } while (p > L);

    return k - 1;
  };
}
