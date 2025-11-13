import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { CompetitorPrice, MarketTrend, InventoryLevel } from '../models';
import { AI_PRICING_SERVICE } from '../services';
import { AuthenticatedRequest } from '../middlewares';

export type QueryParams = {
  competitorIds?: string[];
  productIds?: string[];
};

export const getDynamicPrices = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { businessId } = req.user;
    const queryParams: QueryParams = req.query;

    if (!queryParams || !queryParams.competitorIds || !Array.isArray(queryParams.competitorIds) || !queryParams.productIds || !Array.isArray(queryParams.productIds)) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const validationErrors = await validate(
      queryParams,
      {
        competitorIds: {
          name: 'competitorIds',
          constraints: [isArray],
        },
        productIds: {
          name: 'productIds',
          constraints: [isArray],
        },
      }
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const competitorPrices = await CompetitorPrice.findAll({ where: { businessId, competitorId: queryParams.competitorIds } });
    const marketTrends = await MarketTrend.findAll({ where: { businessId, productId: queryParams.productIds } });
    const inventoryLevels = await InventoryLevel.findAll({ where: { businessId, productId: queryParams.productIds } });

    const prices = await AI_PRICING_SERVICE.getDynamicPrices(competitorPrices, marketTrends, inventoryLevels);

    res.json(prices);
  } catch (error) {
    next(error);
  }
};

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { CompetitorPrice, MarketTrend, InventoryLevel } from '../models';
import { AI_PRICING_SERVICE } from '../services';
import { AuthenticatedRequest } from '../middlewares';

export type QueryParams = {
  competitorIds?: string[];
  productIds?: string[];
};

export const getDynamicPrices = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { businessId } = req.user;
    const queryParams: QueryParams = req.query;

    if (!queryParams || !queryParams.competitorIds || !Array.isArray(queryParams.competitorIds) || !queryParams.productIds || !Array.isArray(queryParams.productIds)) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const validationErrors = await validate(
      queryParams,
      {
        competitorIds: {
          name: 'competitorIds',
          constraints: [isArray],
        },
        productIds: {
          name: 'productIds',
          constraints: [isArray],
        },
      }
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const competitorPrices = await CompetitorPrice.findAll({ where: { businessId, competitorId: queryParams.competitorIds } });
    const marketTrends = await MarketTrend.findAll({ where: { businessId, productId: queryParams.productIds } });
    const inventoryLevels = await InventoryLevel.findAll({ where: { businessId, productId: queryParams.productIds } });

    const prices = await AI_PRICING_SERVICE.getDynamicPrices(competitorPrices, marketTrends, inventoryLevels);

    res.json(prices);
  } catch (error) {
    next(error);
  }
};

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}