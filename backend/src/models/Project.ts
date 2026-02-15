/**
 * Project Model
 * 
 * Represents a project within an organization.
 * Projects contain tasks and belong to a specific organization (tenant isolation).
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProjectAttributes {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  ownerId: string;
  status: 'active' | 'archived' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'description' | 'status' | 'createdAt' | 'updatedAt'> {}

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public organizationId!: string;
  public name!: string;
  public description?: string;
  public ownerId!: string;
  public status!: 'active' | 'archived' | 'completed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'archived', 'completed'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true,
    indexes: [
      // Index for faster queries: "get all projects for this org"
      {
        fields: ['organizationId'],
      },
      {
        fields: ['ownerId'],
      },
    ],
  }
);
