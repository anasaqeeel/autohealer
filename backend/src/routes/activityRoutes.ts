/**
 * Activity Routes
 */

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Activity, OrganizationMember, User } from '../models';
import { Response } from 'express';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/activity/recent
 * Get recent activity
 */
router.get('/recent', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get user's organization IDs
    const memberships = await OrganizationMember.findAll({
      where: { userId },
    });
    const orgIds = memberships.map((m) => m.organizationId);

    const activities = await Activity.findAll({
      where: { organizationId: orgIds },
      order: [['createdAt', 'DESC']],
      limit: Math.min(limit, 100), // Max 100
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get recent activity',
    });
  }
});

/**
 * GET /api/activity
 * Get activity with pagination
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Get user's organization IDs
    const memberships = await OrganizationMember.findAll({
      where: { userId },
    });
    const orgIds = memberships.map((m) => m.organizationId);

    const { count, rows: activities } = await Activity.findAndCountAll({
      where: { organizationId: orgIds },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total: count,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get activity',
    });
  }
});

export default router;
