/**
 * Database Seeding Script
 * 
 * This script creates test data so you can actually use the application:
 * - Creates a test organization
 * - Creates a test user (admin@taskmaster.com / admin123)
 * - Creates sample projects and tasks
 * 
 * WHY this script?
 * - DevOps principle: automate everything, including test data setup
 * - Makes it easy to reset and recreate test data
 * - Can be run in CI/CD for testing
 * 
 * Usage:
 *   npx ts-node scripts/seed-database.ts
 */

import dotenv from 'dotenv';
import { connectDatabase } from '../src/config/database';
import { User, Organization, OrganizationMember, Project, Task } from '../src/models';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDatabase();
    
    // Create test organization
    const [org, orgCreated] = await Organization.findOrCreate({
      where: { slug: 'acme-corp' },
      defaults: {
        name: 'ACME Corp',
        slug: 'acme-corp',
        environment: 'development',
      },
    });
    
    if (orgCreated) {
      console.log('✅ Created organization: ACME Corp');
    } else {
      console.log('ℹ️  Organization already exists: ACME Corp');
    }
    
    // Create test user (admin)
    // Note: We pass plain password - the User model hooks will hash it automatically
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@taskmaster.com' },
      defaults: {
        email: 'admin@taskmaster.com',
        password: 'admin123', // Plain password - will be hashed by model hook
        name: 'Admin User',
        role: 'org_admin',
      },
    });
    
    if (adminCreated) {
      console.log('✅ Created admin user: admin@taskmaster.com');
    } else {
      console.log('ℹ️  Admin user already exists: admin@taskmaster.com');
      // Update password - model hook will hash it
      await adminUser.update({ password: 'admin123' });
    }
    
    // Create test user (member)
    // Note: We pass plain password - the User model hooks will hash it automatically
    const [memberUser, memberCreated] = await User.findOrCreate({
      where: { email: 'member@taskmaster.com' },
      defaults: {
        email: 'member@taskmaster.com',
        password: 'member123', // Plain password - will be hashed by model hook
        name: 'Member User',
        role: 'member',
      },
    });
    
    if (memberCreated) {
      console.log('✅ Created member user: member@taskmaster.com');
    } else {
      console.log('ℹ️  Member user already exists: member@taskmaster.com');
    }
    
    // Add users to organization
    await OrganizationMember.findOrCreate({
      where: {
        userId: adminUser.id,
        organizationId: org.id,
      },
      defaults: {
        userId: adminUser.id,
        organizationId: org.id,
        role: 'org_admin',
      },
    });
    
    await OrganizationMember.findOrCreate({
      where: {
        userId: memberUser.id,
        organizationId: org.id,
      },
      defaults: {
        userId: memberUser.id,
        organizationId: org.id,
        role: 'member',
      },
    });
    
    console.log('✅ Added users to organization');
    
    // Create sample project
    const [project, projectCreated] = await Project.findOrCreate({
      where: {
        organizationId: org.id,
        name: 'Website Redesign',
      },
      defaults: {
        organizationId: org.id,
        name: 'Website Redesign',
        description: 'Complete redesign of the company website',
        ownerId: adminUser.id,
        status: 'active',
      },
    });
    
    if (projectCreated) {
      console.log('✅ Created sample project: Website Redesign');
      
      // Create sample tasks
      await Task.create({
        projectId: project.id,
        title: 'Design new homepage',
        description: 'Create mockups for the new homepage design',
        status: 'in_progress',
        priority: 'high',
        assigneeId: memberUser.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });
      
      await Task.create({
        projectId: project.id,
        title: 'Implement responsive navigation',
        description: 'Make the navigation menu work on mobile devices',
        status: 'todo',
        priority: 'medium',
        assigneeId: adminUser.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      });
      
      await Task.create({
        projectId: project.id,
        title: 'Write documentation',
        description: 'Document the new website features',
        status: 'done',
        priority: 'low',
        assigneeId: memberUser.id,
      });
      
      console.log('✅ Created sample tasks');
    } else {
      console.log('ℹ️  Sample project already exists');
    }
    
    console.log('');
    console.log('🎉 Database seeding complete!');
    console.log('');
    console.log('📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin User:');
    console.log('  Email:    admin@taskmaster.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('Member User:');
    console.log('  Email:    member@taskmaster.com');
    console.log('  Password: member123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  Note: Authentication endpoints need to be implemented');
    console.log('   before you can actually login. But the users are created!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
