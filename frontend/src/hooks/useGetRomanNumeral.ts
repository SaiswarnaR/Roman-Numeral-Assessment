import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface RomanNumeralResponse {
  input: number;
  output: string;
}

/**
 * Fetches Roman numeral conversion from API
 * @param number The integer to convert to a Roman numeral
 * @returns Response containing input and roman numeral
 */
export const fetchRomanNumeral = async (number: number): Promise<RomanNumeralResponse> => {
  const { data } = await axios.get<RomanNumeralResponse>('http://localhost:8080/romannumeral', {
    params: {
      query: number,
    },
  });
  return data;
};

/**
 * Hook for converting an integer to Roman numeral
 * @param number The integer to convert
 * @returns Query result with Roman numeral data
 */
export const useGetRomanNumeral = (number?: number) => {
  return useQuery({
    queryKey: ['romanNumeral', number],
    queryFn: () => fetchRomanNumeral(number as number),
    enabled: !!number && number > 0 && number < 4000,
    retry: false,
  });
};
