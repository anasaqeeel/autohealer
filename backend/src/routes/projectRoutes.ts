/**
 * Project Routes
 */

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Project, OrganizationMember, Task, User } from '../models';
import { Response } from 'express';

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
 * GET /api/projects
 * Get all projects for current user's organizations
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    const projects = await Project.findAll({
      where: { organizationId: orgIds },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
      order: [['updatedAt', 'DESC']],
    });

    // Get task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.count({ where: { projectId: project.id } });
        const openTaskCount = await Task.count({
          where: { projectId: project.id, status: { [require('sequelize').Op.ne]: 'done' } },
        });

        return {
          id: project.id,
          organizationId: project.organizationId,
          name: project.name,
          description: project.description,
          ownerId: project.ownerId,
          owner: project.owner,
          status: project.status,
          taskCount,
          openTaskCount,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      })
    );

    res.json({
      success: true,
      data: projectsWithCounts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get projects',
    });
  }
});

/**
 * GET /api/projects/:id
 * Get project by ID
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    const project = await Project.findOne({
      where: { id: req.params.id, organizationId: orgIds },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      });
      return;
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get project',
    });
  }
});

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
      return;
    }

    // Get user's first organization (or you can pass organizationId in body)
    const memberships = await OrganizationMember.findAll({
      where: { userId },
      limit: 1,
    });

    if (memberships.length === 0) {
      res.status(400).json({
        success: false,
        message: 'User must belong to an organization',
      });
      return;
    }

    const project = await Project.create({
      organizationId: memberships[0].organizationId,
      name,
      description,
      ownerId: userId,
      status: 'active',
    });

    const projectWithOwner = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    });

    res.status(201).json({
      success: true,
      data: projectWithOwner,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create project',
    });
  }
});

/**
 * PATCH /api/projects/:id
 * Update project
 */
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    const project = await Project.findOne({
      where: { id: req.params.id, organizationId: orgIds },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      });
      return;
    }

    await project.update(req.body);

    const updatedProject = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    });

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update project',
    });
  }
});

/**
 * GET /api/projects/:id/tasks
 * Get tasks for a specific project
 */
router.get('/:id/tasks', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    const project = await Project.findOne({
      where: { id: req.params.id, organizationId: orgIds },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      });
      return;
    }

    const tasks = await Task.findAll({
      where: { projectId: project.id },
      include: [
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
      message: error.message || 'Failed to get project tasks',
    });
  }
});

/**
 * POST /api/projects/:id/tasks
 * Create task in project
 */
router.post('/:id/tasks', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orgIds = await getUserOrganizationIds(userId);

    const project = await Project.findOne({
      where: { id: req.params.id, organizationId: orgIds },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      });
      return;
    }

    const { title, description, priority, assigneeId, dueDate } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
      return;
    }

    const task = await Task.create({
      projectId: project.id,
      title,
      description,
      priority: priority || 'medium',
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: 'todo',
    });

    // Track business metric
    const { tasksCreatedCounter } = require('../utils/metrics');
    tasksCreatedCounter.inc({
      organization_id: project.organizationId,
      project_id: project.id,
    });

    const taskWithAssignee = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
    });

    res.status(201).json({
      success: true,
      data: taskWithAssignee,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task',
    });
  }
});

export default router;
