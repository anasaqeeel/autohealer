/**
 * OrganizationMember Model (Join Table)
 * 
 * This is a "join table" that connects Users and Organizations.
 * It represents the many-to-many relationship: a user can belong to multiple orgs,
 * and an org can have multiple members.
 * 
 * This table also stores the user's role WITHIN that specific organization
 * (a user might be admin in one org, but member in another).
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrganizationMemberAttributes {
  id: string;
  userId: string;
  organizationId: string;
  role: 'org_admin' | 'member'; // Role within THIS organization
  joinedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrganizationMemberCreationAttributes extends Optional<OrganizationMemberAttributes, 'id' | 'joinedAt' | 'createdAt' | 'updatedAt'> {}

export class OrganizationMember extends Model<OrganizationMemberAttributes, OrganizationMemberCreationAttributes> implements OrganizationMemberAttributes {
  public id!: string;
  public userId!: string;
  public organizationId!: string;
  public role!: 'org_admin' | 'member';
  public joinedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrganizationMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('org_admin', 'member'),
      allowNull: false,
      defaultValue: 'member',
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'organization_members',
    timestamps: true,
    indexes: [
      // Composite unique index: a user can only be in an org once
      {
        unique: true,
        fields: ['userId', 'organizationId'],
      },
    ],
  }
);
