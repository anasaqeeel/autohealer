/**
 * Models Index
 * 
 * This file imports all Sequelize models and sets up relationships between them.
 * 
 * WHY centralize models here?
 * - Prevents circular dependency issues
 * - Makes it easy to see all models at a glance
 * - Standard pattern in Sequelize projects
 */

import sequelize from '../config/database';
import { User } from './User';
import { Organization } from './Organization';
import { Project } from './Project';
import { Task } from './Task';
import { Comment } from './Comment';
import { Activity } from './Activity';
import { OrganizationMember } from './OrganizationMember';

// Define relationships between models
// This is how Sequelize knows how tables relate to each other

// User <-> Organization (Many-to-Many through OrganizationMember)
User.belongsToMany(Organization, {
  through: OrganizationMember,
  foreignKey: 'userId',
  as: 'organizations',
});

Organization.belongsToMany(User, {
  through: OrganizationMember,
  foreignKey: 'organizationId',
  as: 'members',
});

// OrganizationMember relationships
OrganizationMember.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

OrganizationMember.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

// Organization -> Projects (One-to-Many)
Organization.hasMany(Project, {
  foreignKey: 'organizationId',
  as: 'projects',
});

Project.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

// User -> Projects (One-to-Many, owner)
Project.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

User.hasMany(Project, {
  foreignKey: 'ownerId',
  as: 'ownedProjects',
});

// Project -> Tasks (One-to-Many)
Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
});

Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});

// User -> Tasks (One-to-Many, assignee)
Task.belongsTo(User, {
  foreignKey: 'assigneeId',
  as: 'assignee',
});

User.hasMany(Task, {
  foreignKey: 'assigneeId',
  as: 'assignedTasks',
});

// Task -> Comments (One-to-Many)
Task.hasMany(Comment, {
  foreignKey: 'taskId',
  as: 'comments',
});

Comment.belongsTo(Task, {
  foreignKey: 'taskId',
  as: 'task',
});

// User -> Comments (One-to-Many, author)
Comment.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

User.hasMany(Comment, {
  foreignKey: 'authorId',
  as: 'comments',
});

// Activity relationships
Activity.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

Activity.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Export all models
export {
  sequelize,
  User,
  Organization,
  Project,
  Task,
  Comment,
  Activity,
  OrganizationMember,
};
