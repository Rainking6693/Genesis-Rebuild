import { Request, Response, NextFunction } from 'express';
import { validate, Joi } from 'express-validation';
import { EcoScoreAnalyticsService } from '../services/ecoscoreAnalyticsService';
import { isEmpty } from 'lodash';

interface RequestBody {
  businessId: string;
}

interface ErrorResponse {
  status: number;
  message: string;
}

const validateRequestBody = Joi.object({
  businessId: Joi.string().required().alphanum().min(1).max(255),
});

const getEcoScore = async (
  req: Request<{}, {}, RequestBody, NextFunction>,
  res: Response,
  next: NextFunction
) => {
  try {
    validate(req);

    const { businessId } = req.body;
    const ecoScoreAnalyticsService = new EcoScoreAnalyticsService();

    let ecoScore;
    try {
      ecoScore = await ecoScoreAnalyticsService.getEcoScore(businessId);
    } catch (error) {
      return handleError(res, error);
    }

    if (isEmpty(ecoScore)) {
      return res.status(404).json({ message: 'EcoScore not found for the provided businessId.' });
    }

    res.status(200).json({ ecoScore });
  } catch (error) {
    return handleError(res, error);
  }
};

const handleError = (res: Response, error: Error) => {
  if (error.name === 'ValidationError') {
    const errorResponse: ErrorResponse = {
      status: 400,
      message: error.message,
    };
    return res.status(errorResponse.status).json(errorResponse);
  }

  const errorResponse: ErrorResponse = {
    status: error.status || 500,
    message: error.message || 'An unexpected error occurred.',
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.message = `Error: ${error.message}`;
  }

  console.error(error);
  return res.status(errorResponse.status).json(errorResponse);
};

export { getEcoScore };

import { Request, Response, NextFunction } from 'express';
import { validate, Joi } from 'express-validation';
import { EcoScoreAnalyticsService } from '../services/ecoscoreAnalyticsService';
import { isEmpty } from 'lodash';

interface RequestBody {
  businessId: string;
}

interface ErrorResponse {
  status: number;
  message: string;
}

const validateRequestBody = Joi.object({
  businessId: Joi.string().required().alphanum().min(1).max(255),
});

const getEcoScore = async (
  req: Request<{}, {}, RequestBody, NextFunction>,
  res: Response,
  next: NextFunction
) => {
  try {
    validate(req);

    const { businessId } = req.body;
    const ecoScoreAnalyticsService = new EcoScoreAnalyticsService();

    let ecoScore;
    try {
      ecoScore = await ecoScoreAnalyticsService.getEcoScore(businessId);
    } catch (error) {
      return handleError(res, error);
    }

    if (isEmpty(ecoScore)) {
      return res.status(404).json({ message: 'EcoScore not found for the provided businessId.' });
    }

    res.status(200).json({ ecoScore });
  } catch (error) {
    return handleError(res, error);
  }
};

const handleError = (res: Response, error: Error) => {
  if (error.name === 'ValidationError') {
    const errorResponse: ErrorResponse = {
      status: 400,
      message: error.message,
    };
    return res.status(errorResponse.status).json(errorResponse);
  }

  const errorResponse: ErrorResponse = {
    status: error.status || 500,
    message: error.message || 'An unexpected error occurred.',
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.message = `Error: ${error.message}`;
  }

  console.error(error);
  return res.status(errorResponse.status).json(errorResponse);
};

export { getEcoScore };