/**
 * Roman Numeral Service
 * Converts integers to Roman numerals
 */

/**
 * Convert a number to Roman numeral string
 * @param num Integer to convert
 * @returns Roman numeral representation
 */

const romanNumeralMappings: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/**
 * Converts an integer to a Roman numeral using a recursive functional approach
 * @param num The integer to convert (must be between 1 and 3999)
 * @returns The Roman numeral as a string
 */
const toRoman = (num: number): string => {

  // Base case: if num is 0, return empty string
  if (num === 0) {
    return '';
  }

  // Find the largest mapping that fits into the current number
  const [value, symbol] = romanNumeralMappings.find(([value]) => value <= num) || [0, ''];
  // Recursively convert the remainder and concatenate the result
  return symbol + toRoman(num - value);
};

export default toRoman;
