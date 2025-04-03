import express from 'express';
import toRoman from '../services/roman.js';

const router = express.Router();

/**
 * Convert an integer to a Roman numeral
 * @route GET /romannumeral?query={integer}
 * @param {number} query.query.required - The integer to convert
 * @returns {object} 200 - Success response with Roman numeral
 * @returns {object} 400 - Bad request if query is invalid or missing
 */
router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const queryParam = req.query.query;
    
    // Check if query parameter exists
    if (!queryParam) {
      res.status(400).json({
        error: 'Missing required query parameter: query'
      });
      return;
    }
    
    const num = parseInt(queryParam as string, 10);
    
    // Validate the input
    if (isNaN(num) || num <= 0 || num > 3999) {
      res.status(400).json({
        error: 'Invalid input. Please provide a positive integer between 1 and 3999.'
      });
      return;
    }
    
    // Get Roman numeral from service
    const output = toRoman(num);
    
    // Return the result
    res.json({
      input: num,
      output
    });
  } catch (error) {
    next(error);
  }
});

export default router;