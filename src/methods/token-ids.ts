// credit: https://github.com/firstandthird/combinations/issues/12

// returns a unique and shuffled list of word combinations separated by hyphens
export function getTokenIds (words: string[], minLength?: number, maxLength?: number, maxCount?: number): string[] {
  minLength = minLength || 1;
  maxLength = Math.min(maxLength || words.length, words.length);

  const fn = (n: number, src: string[], got: string[], all: string[][]) => {
    if (n == 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }

    for (let j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
    return;
  };

  let all: string[][] = [];

  for (let i = minLength; i <= maxLength; i++) {
    fn(i, words, [], all);
  }

  // shuffle the array 3 times
  // intended to be run by scripts where performance is of little concern
  let r = 0;
  while (r < 5) {
    all.sort(() => Math.random() - 0.5);
    r++;
  }

  if (maxCount && all.length > maxCount) {
    all = all.splice(0, maxCount);
  }

  return all.map((c) => c.join("-"));
};