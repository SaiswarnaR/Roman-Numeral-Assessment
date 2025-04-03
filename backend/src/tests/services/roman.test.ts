import toRoman from '../../services/roman.js';

describe('Roman Numeral Service', () => {
  test('should convert 1 to I', () => {
    expect(toRoman(1)).toBe('I');
  });

  test('should convert 4 to IV', () => {
    expect(toRoman(4)).toBe('IV');
  });

  test('should convert 5 to V', () => {
    expect(toRoman(5)).toBe('V');
  });

  test('should convert 9 to IX', () => {
    expect(toRoman(9)).toBe('IX');
  });

  test('should convert 10 to X', () => {
    expect(toRoman(10)).toBe('X');
  });

  test('should convert 40 to XL', () => {
    expect(toRoman(40)).toBe('XL');
  });

  test('should convert 50 to L', () => {
    expect(toRoman(50)).toBe('L');
  });

  test('should convert 90 to XC', () => {
    expect(toRoman(90)).toBe('XC');
  });

  test('should convert 100 to C', () => {
    expect(toRoman(100)).toBe('C');
  });

  test('should convert 400 to CD', () => {
    expect(toRoman(400)).toBe('CD');
  });

  test('should convert 500 to D', () => {
    expect(toRoman(500)).toBe('D');
  });

  test('should convert 900 to CM', () => {
    expect(toRoman(900)).toBe('CM');
  });

  test('should convert 1000 to M', () => {
    expect(toRoman(1000)).toBe('M');
  });

  test('should convert 1984 to MCMLXXXIV', () => {
    expect(toRoman(1984)).toBe('MCMLXXXIV');
  });

  test('should convert 2023 to MMXXIII', () => {
    expect(toRoman(2023)).toBe('MMXXIII');
  });

  test('should convert 3999 to MMMCMXCIX', () => {
    expect(toRoman(3999)).toBe('MMMCMXCIX');
  });

  test('should handle consecutive symbols correctly', () => {
    expect(toRoman(3)).toBe('III');
    expect(toRoman(30)).toBe('XXX');
    expect(toRoman(300)).toBe('CCC');
    expect(toRoman(3000)).toBe('MMM');
  });

  test('should handle complex combinations correctly', () => {
    expect(toRoman(1999)).toBe('MCMXCIX');
    expect(toRoman(2888)).toBe('MMDCCCLXXXVIII');
    expect(toRoman(3549)).toBe('MMMDXLIX');
  });
});