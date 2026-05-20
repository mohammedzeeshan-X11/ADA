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

// --- SORTING ALGORITHMS ---

/**
 * Bubble Sort: O(n^2)
 */
export function bubbleSort(arr: Vehicle[]): { sorted: Vehicle[]; comparisons: number; swaps: number } {
  const newArr = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = newArr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (newArr[j].plateNumber > newArr[j + 1].plateNumber) {
        // Swap
        [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
        swaps++;
      }
    }
  }
  return { sorted: newArr, comparisons, swaps };
}

/**
 * Quick Sort: O(n log n) average, O(n^2) worst
 */
export function quickSort(arr: Vehicle[]): { sorted: Vehicle[]; comparisons: number; swaps: number } {
  const newArr = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function partition(low: number, high: number): number {
    const pivot = newArr[high].plateNumber;
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      if (newArr[j].plateNumber < pivot) {
        i++;
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        swaps++;
      }
    }
    [newArr[i + 1], newArr[high]] = [newArr[high], newArr[i + 1]];
    swaps++;
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, newArr.length - 1);
  return { sorted: newArr, comparisons, swaps };
}

/**
 * Merge Sort: O(n log n)
 */
export function mergeSort(arr: Vehicle[]): { sorted: Vehicle[]; comparisons: number; swaps: number } {
  let comparisons = 0;
  let swaps = 0;

  function merge(left: Vehicle[], right: Vehicle[]): Vehicle[] {
    const result: Vehicle[] = [];
    let l = 0;
    let r = 0;
    while (l < left.length && r < right.length) {
      comparisons++;
      if (left[l].plateNumber < right[r].plateNumber) {
        result.push(left[l]);
        l++;
      } else {
        result.push(right[r]);
        r++;
      }
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
  }

  function sort(data: Vehicle[]): Vehicle[] {
    if (data.length <= 1) return data;
    const mid = Math.floor(data.length / 2);
    const left = sort(data.slice(0, mid));
    const right = sort(data.slice(mid));
    return merge(left, right);
  }

  return { sorted: sort(arr), comparisons, swaps: 0 /* Merge sort uses auxiliary space, doesn't 'swap' in place */ };
}

/**
 * Selection Sort: O(n^2)
 */
export function selectionSort(arr: Vehicle[]): { sorted: Vehicle[]; comparisons: number; swaps: number } {
  const newArr = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = newArr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      if (newArr[j].plateNumber < newArr[minIdx].plateNumber) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [newArr[i], newArr[minIdx]] = [newArr[minIdx], newArr[i]];
      swaps++;
    }
  }
  return { sorted: newArr, comparisons, swaps };
}

/**
 * Insertion Sort: O(n^2)
 */
export function insertionSort(arr: Vehicle[]): { sorted: Vehicle[]; comparisons: number; swaps: number } {
  const newArr = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = newArr.length;

  for (let i = 1; i < n; i++) {
    const key = newArr[i];
    let j = i - 1;
    comparisons++;
    while (j >= 0 && newArr[j].plateNumber > key.plateNumber) {
      comparisons++;
      newArr[j + 1] = newArr[j];
      j = j - 1;
      swaps++;
    }
    newArr[j + 1] = key;
  }
  return { sorted: newArr, comparisons, swaps };
}

/**
 * Heap Sort: O(n log n)
 */
export function heapSort(arr: Vehicle[]): { sorted: Vehicle[]; comparisons: number; swaps: number } {
  const newArr = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = newArr.length;

  function heapify(sz: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < sz) {
      comparisons++;
      if (newArr[l].plateNumber > newArr[largest].plateNumber) {
        largest = l;
      }
    }

    if (r < sz) {
      comparisons++;
      if (newArr[r].plateNumber > newArr[largest].plateNumber) {
        largest = r;
      }
    }

    if (largest !== i) {
      [newArr[i], newArr[largest]] = [newArr[largest], newArr[i]];
      swaps++;
      heapify(sz, largest);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [newArr[0], newArr[i]] = [newArr[i], newArr[0]];
    swaps++;
    heapify(i, 0);
  }

  return { sorted: newArr, comparisons, swaps };
}
