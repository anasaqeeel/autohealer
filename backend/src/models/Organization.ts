/**
 * Organization Model (Tenant)
 * 
 * Represents a tenant/organization in the multi-tenant system.
 * Each organization has its own projects, tasks, and members.
 * This is the core of multi-tenancy - data isolation happens at this level.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrganizationAttributes {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier (e.g., "acme-corp")
  environment: 'production' | 'staging' | 'development';
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrganizationCreationAttributes extends Optional<OrganizationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Organization extends Model<OrganizationAttributes, OrganizationCreationAttributes> implements OrganizationAttributes {
  public id!: string;
  public name!: string;
  public slug!: string;
  public environment!: 'production' | 'staging' | 'development';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Organization.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isLowercase: true,
        is: /^[a-z0-9-]+$/, // Only lowercase letters, numbers, and hyphens
      },
    },
    environment: {
      type: DataTypes.ENUM('production', 'staging', 'development'),
      allowNull: false,
      defaultValue: 'development',
    },
  },
  {
    sequelize,
    tableName: 'organizations',
    timestamps: true,
  }
);
