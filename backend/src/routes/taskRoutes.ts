/**
 * Task Routes
 */

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Task, Project, OrganizationMember, User, Comment } from '../models';
import { Response } from 'express';
import { Op } from 'sequelize';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * Helper: Get user's organization IDs
 */
async function getUserOrganizationIds(userId: string): Promise<string[]> {
  const memberships = await OrganizationMember.findAll({
    where: { userId },
  });
  return memberships.map((m) => m.organizationId);
}

/**
 * GET /api/tasks
 * Get tasks with filters
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    // Get projects user has access to
    const projects = await Project.findAll({
      where: { organizationId: orgIds },
    });
    const projectIds = projects.map((p) => p.id);

    // Build query filters
    const where: any = { projectId: projectIds };

    if (req.query.assignedTo === 'me') {
      where.assigneeId = userId;
    } else if (req.query.assignedTo) {
      where.assigneeId = req.query.assignedTo;
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.priority) {
      where.priority = req.query.priority;
    }

    if (req.query.projectId) {
      where.projectId = req.query.projectId;
    }

    // Date filters
    if (req.query.dueDate) {
      const now = new Date();
      switch (req.query.dueDate) {
        case 'overdue':
          where.dueDate = { [Op.lt]: now };
          where.status = { [Op.ne]: 'done' };
          break;
        case 'today':
          const startOfDay = new Date(now.setHours(0, 0, 0, 0));
          const endOfDay = new Date(now.setHours(23, 59, 59, 999));
          where.dueDate = { [Op.between]: [startOfDay, endOfDay] };
          break;
        case 'next_7_days':
          const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          where.dueDate = { [Op.between]: [now, in7Days] };
          break;
        case 'next_30_days':
          const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          where.dueDate = { [Op.between]: [now, in30Days] };
          break;
      }
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get tasks',
    });
  }
});

/**
 * GET /api/tasks/:id
 * Get task by ID with comments
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Project,
          as: 'project',
          where: { organizationId: orgIds },
        },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get task',
    });
  }
});

/**
 * PATCH /api/tasks/:id
 * Update task
 */
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Project,
          as: 'project',
          where: { organizationId: orgIds },
        },
      ],
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    await task.update(req.body);

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task',
    });
  }
});

/**
 * POST /api/tasks/:id/comments
 * Add comment to task
 */
router.post('/:id/comments', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
      return;
    }

    const orgIds = await getUserOrganizationIds(userId);

    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Project,
          as: 'project',
          where: { organizationId: orgIds },
        },
      ],
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    const comment = await Comment.create({
      taskId: task.id,
      authorId: userId,
      content,
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
    });

    res.status(201).json({
      success: true,
      data: commentWithAuthor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create comment',
    });
  }
});

export default router;
