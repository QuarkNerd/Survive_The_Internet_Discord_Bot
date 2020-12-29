export function get_subsection_random_order<T>(options: T[], num: number): T[] {
  if (num > options.length) {
    console.error("Function called with number larger than array length");
    return [];
  }

  const rand_nums = generate_n_random_numbers(num, 0, options.length);

  return rand_nums.map((x) => options[x]);
}

export function get_random_element<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generate_n_random_numbers(
  n: number,
  min: number,
  max: number
): number[] {
  const nums: Set<number> = new Set();
  while (nums.size !== n) {
    nums.add(Math.floor(Math.random() * (max - min)) + min);
  }
  return [...nums];
}
