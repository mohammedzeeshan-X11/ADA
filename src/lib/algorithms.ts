/**
 * Manual implementation of Searching and Sorting Algorithms
 * for DSA Project Analysis.
 */

export interface Vehicle {
  id: string;
  ownerName: string;
  plateNumber: string;
  vehicleType: string;
  city: string;
  registrationDate: string;
}

export interface BenchmarkResult {
  algorithm: string;
  timeMs: number;
  comparisons: number;
  iterations: number;
  complexity: string;
  spaceComplexity: string;
}

// --- SEARCHING ALGORITHMS ---

/**
 * Linear Search: O(n)
 */
export function linearSearch(arr: Vehicle[], targetPlate: string): { index: number; comparisons: number; iterations: number } {
  let comparisons = 0;
  let iterations = 0;
  for (let i = 0; i < arr.length; i++) {
    iterations++;
    comparisons++;
    if (arr[i].plateNumber === targetPlate) {
      return { index: i, comparisons, iterations };
    }
  }
  return { index: -1, comparisons, iterations };
}

/**
 * Binary Search: O(log n)
 * Requires sorted array by plateNumber
 */
export function binarySearch(arr: Vehicle[], targetPlate: string): { index: number; comparisons: number; iterations: number } {
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;
  let iterations = 0;

  while (low <= high) {
    iterations++;
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    if (arr[mid].plateNumber === targetPlate) {
      return { index: mid, comparisons, iterations };
    }
    comparisons++;
    if (arr[mid].plateNumber < targetPlate) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return { index: -1, comparisons, iterations };
}

/**
 * Jump Search: O(√n)
 * Requires sorted array
 */
export function jumpSearch(arr: Vehicle[], targetPlate: string): { index: number; comparisons: number; iterations: number } {
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  let comparisons = 0;
  let iterations = 0;

  while (arr[Math.min(step, n) - 1].plateNumber < targetPlate) {
    iterations++;
    comparisons++;
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return { index: -1, comparisons, iterations };
  }

  while (arr[prev].plateNumber < targetPlate) {
    iterations++;
    comparisons++;
    prev++;
    if (prev === Math.min(step, n)) return { index: -1, comparisons, iterations };
  }

  comparisons++;
  if (arr[prev].plateNumber === targetPlate) return { index: prev, comparisons, iterations };

  return { index: -1, comparisons, iterations };
}

/**
 * Interpolation Search: O(log log n) average
 * Requires sorted array and uniform distribution
 */
export function interpolationSearch(arr: Vehicle[], targetPlate: string): { index: number; comparisons: number; iterations: number } {
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;
  let iterations = 0;

  const plateToNum = (plate: string) => {
    // Take first 4 characters and convert to a number for interpolation
    // This is a heuristic for string interpolation
    let num = 0;
    for (let i = 0; i < Math.min(plate.length, 4); i++) {
      num = num * 256 + plate.charCodeAt(i);
    }
    return num;
  };

  const targetNum = plateToNum(targetPlate);

  while (low <= high && targetPlate >= arr[low].plateNumber && targetPlate <= arr[high].plateNumber) {
    iterations++;
    comparisons++;
    if (low === high) {
      if (arr[low].plateNumber === targetPlate) return { index: low, comparisons, iterations };
      return { index: -1, comparisons, iterations };
    }

    const lowNum = plateToNum(arr[low].plateNumber);
    const highNum = plateToNum(arr[high].plateNumber);

    // Position formula: pos = low + [(target - arr[low]) * (high - low) / (arr[high] - arr[low])]
    let pos = low + Math.floor(((targetNum - lowNum) * (high - low)) / (highNum - lowNum || 1));

    if (pos < low) pos = low;
    if (pos > high) pos = high;

    comparisons++;
    if (arr[pos].plateNumber === targetPlate) return { index: pos, comparisons, iterations };

    comparisons++;
    if (arr[pos].plateNumber < targetPlate) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }
  return { index: -1, comparisons, iterations };
}
