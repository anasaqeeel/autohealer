/**
 * Organization Routes
 */

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Organization, OrganizationMember } from '../models';
import { Response } from 'express';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/organizations
 * Get all organizations for current user
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const memberships = await OrganizationMember.findAll({
      where: { userId },
    });

    const orgIds = memberships.map((m) => m.organizationId);
    const organizationsData = await Organization.findAll({
      where: { id: orgIds },
    });

    const organizations = organizationsData.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      environment: org.environment,
    }));

    res.json({
      success: true,
      data: organizations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get organizations',
    });
  }
});

/**
 * POST /api/organizations/switch
 * Switch current organization (for now, just returns success)
 */
router.post('/switch', async (req: AuthRequest, res: Response) => {
  try {
    const { organizationId } = req.body;
    const userId = req.user!.id;

    // Verify user belongs to this organization
    const membership = await OrganizationMember.findOne({
      where: { userId, organizationId },
    });

    if (!membership) {
      res.status(403).json({
        success: false,
        message: 'You do not have access to this organization',
      });
      return;
    }

    const org = await Organization.findByPk(organizationId);
    if (!org) {
      res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        environment: org.environment,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to switch organization',
    });
  }
});

export default router;
