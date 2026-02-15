/**
 * Dashboard Routes
 */

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Project, Task, OrganizationMember, Activity, User } from '../models';
import { Response } from 'express';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/dashboard/summary
 * Get dashboard summary data
 */
router.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get user's organization IDs
    const memberships = await OrganizationMember.findAll({
      where: { userId },
    });
    const orgIds = memberships.map((m) => m.organizationId);

    // Get projects
    const projects = await Project.findAll({
      where: { organizationId: orgIds },
    });

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'active').length;

    // Get tasks
    const projectIds = projects.map((p) => p.id);
    const tasks = await Task.findAll({
      where: { projectId: projectIds },
    });

    const totalTasks = tasks.length;
    const openTasks = tasks.filter((t) => t.status !== 'done').length;
    const openTasksAssignedToMe = tasks.filter(
      (t) => t.status !== 'done' && t.assigneeId === userId
    ).length;

    // Get recent activity
    const recentActivity = await Activity.findAll({
      where: { organizationId: orgIds },
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        totalTasks,
        openTasks,
        openTasksAssignedToMe,
        recentActivity,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get dashboard summary',
    });
  }
});

export default router;
