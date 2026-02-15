/**
 * Authentication Controller
 * 
 * Handles login, registration, and user info endpoints
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, Organization, OrganizationMember } from '../models';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';

/**
 * Generate JWT token
 */
function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'member',
    });

    // Create default organization for the user
    const org = await Organization.create({
      name: `${name}'s Organization`,
      slug: `${email.split('@')[0]}-org`,
      environment: 'development',
    });

    // Add user as admin of their organization
    await OrganizationMember.create({
      userId: user.id,
      organizationId: org.id,
      role: 'org_admin',
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    // Get user's organizations
    const memberships = await OrganizationMember.findAll({
      where: { userId: user.id },
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

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        organizations,
        currentOrganizationId: org.id,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
}

/**
 * POST /api/auth/login
 * Login user
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Get user's organizations
    const memberships = await OrganizationMember.findAll({
      where: { userId: user.id },
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

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        organizations,
        currentOrganizationId: organizations[0]?.id,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
}

/**
 * GET /api/auth/me
 * Get current user info
 */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get user's organizations
    const memberships = await OrganizationMember.findAll({
      where: { userId: user.id },
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
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        organizations,
        currentOrganizationId: organizations[0]?.id,
      },
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user info',
    });
  }
}
