/**
 * Activity Model
 * 
 * Represents activity/events in the system (audit log).
 * This is crucial for:
 * - Observability (what happened, when, by whom)
 * - Debugging (trace user actions)
 * - Compliance (audit trail)
 * 
 * In DevOps: This feeds into your monitoring/logging stack (ELK, etc.)
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ActivityAttributes {
  id: string;
  organizationId: string;
  userId: string;
  type: string; // e.g., 'task_status_changed', 'task_created', 'comment_added'
  entityType: string; // 'task', 'project', 'comment', etc.
  entityId: string;
  entityName?: string; // Human-readable name for the entity
  description: string;
  metadata?: any; // JSON field for additional data
  createdAt?: Date;
}

interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id' | 'entityName' | 'metadata' | 'createdAt'> {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> implements ActivityAttributes {
  public id!: string;
  public organizationId!: string;
  public userId!: string;
  public type!: string;
  public entityType!: string;
  public entityId!: string;
  public entityName?: string;
  public description!: string;
  public metadata?: any;
  public readonly createdAt!: Date;
}

Activity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    entityName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'activities',
    timestamps: true,
    updatedAt: false, // Activities are immutable - never updated, only created
    indexes: [
      {
        fields: ['organizationId'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['entityType', 'entityId'],
      },
      {
        fields: ['createdAt'], // For time-based queries
      },
    ],
  }
);
