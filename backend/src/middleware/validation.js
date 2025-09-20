const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const validateUser = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validateProject = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Project name required'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  handleValidationErrors
];

const validateTask = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Task title required'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional().isISO8601().withMessage('Invalid date format'),
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateProject,
  validateTask,
  handleValidationErrors
};
