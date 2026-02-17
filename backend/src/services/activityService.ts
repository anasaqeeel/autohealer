/**
 * Activity Service
 * 
 * Centralized service for creating activity/audit log entries.
 * This ensures all actions are tracked for observability.
 */

import { Activity, Project, Task, Comment } from '../models';

interface CreateActivityParams {
  organizationId: string;
  userId: string;
  type: string;
  entityType: 'task' | 'project' | 'comment' | 'user';
  entityId: string;
  entityName?: string;
  description: string;
  metadata?: any;
}

export async function createActivity(params: CreateActivityParams): Promise<void> {
  try {
    await Activity.create({
      organizationId: params.organizationId,
      userId: params.userId,
      type: params.type,
      entityType: params.entityType,
      entityId: params.entityId,
      entityName: params.entityName,
      description: params.description,
      metadata: params.metadata,
    });
  } catch (error) {
    // Don't fail the main operation if activity logging fails
    console.error('Failed to create activity:', error);
  }
}

/**
 * Helper: Create activity for task creation
 */
export async function logTaskCreated(
  task: Task,
  userId: string,
  organizationId: string
): Promise<void> {
  const project = await task.getProject();
  await createActivity({
    organizationId,
    userId,
    type: 'task_created',
    entityType: 'task',
    entityId: task.id,
    entityName: task.title,
    description: `Task "${task.title}" created in project "${project.name}"`,
    metadata: {
      projectId: project.id,
      projectName: project.name,
      taskStatus: task.status,
      taskPriority: task.priority,
    },
  });
}

/**
 * Helper: Create activity for task update
 */
export async function logTaskUpdated(
  task: Task,
  userId: string,
  organizationId: string,
  changes: any
): Promise<void> {
  const project = await task.getProject();
  const changeDescriptions: string[] = [];
  
  if (changes.status) {
    changeDescriptions.push(`status changed to ${changes.status}`);
  }
  if (changes.priority) {
    changeDescriptions.push(`priority changed to ${changes.priority}`);
  }
  if (changes.assigneeId) {
    changeDescriptions.push(`assignee changed`);
  }
  if (changes.title) {
    changeDescriptions.push(`title changed`);
  }
  
  const description = changeDescriptions.length > 0
    ? `Task "${task.title}" ${changeDescriptions.join(', ')}`
    : `Task "${task.title}" updated`;

  await createActivity({
    organizationId,
    userId,
    type: changes.status ? 'task_status_changed' : 'task_updated',
    entityType: 'task',
    entityId: task.id,
    entityName: task.title,
    description,
    metadata: {
      projectId: project.id,
      projectName: project.name,
      changes,
    },
  });
}

/**
 * Helper: Create activity for project creation
 */
export async function logProjectCreated(
  project: Project,
  userId: string,
  organizationId: string
): Promise<void> {
  await createActivity({
    organizationId,
    userId,
    type: 'project_created',
    entityType: 'project',
    entityId: project.id,
    entityName: project.name,
    description: `Project "${project.name}" created`,
    metadata: {
      projectStatus: project.status,
    },
  });
}

/**
 * Helper: Create activity for comment creation
 */
export async function logCommentAdded(
  comment: Comment,
  userId: string,
  organizationId: string
): Promise<void> {
  const task = await comment.getTask();
  const project = await task.getProject();
  
  await createActivity({
    organizationId,
    userId,
    type: 'comment_added',
    entityType: 'comment',
    entityId: comment.id,
    entityName: `Comment on "${task.title}"`,
    description: `Comment added to task "${task.title}"`,
    metadata: {
      taskId: task.id,
      taskTitle: task.title,
      projectId: project.id,
      projectName: project.name,
    },
  });
}
