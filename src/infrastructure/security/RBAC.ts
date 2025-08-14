/**
 * Role-Based Access Control (RBAC) System
 * Provides comprehensive role and permission management
 */

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inherits?: string[]; // Roles that this role inherits from
}

export interface User {
  id: string;
  email: string;
  roles: string[];
  customPermissions?: string[]; // Direct permissions assigned to user
}

export class RBACManager {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  /**
   * Initialize default roles and permissions
   */
  private initializeDefaultRoles(): void {
    // Define default permissions
    const permissions: Permission[] = [
      // User management
      { id: 'user.read', name: 'Read Users', description: 'View user information', resource: 'user', action: 'read' },
      { id: 'user.create', name: 'Create Users', description: 'Create new users', resource: 'user', action: 'create' },
      { id: 'user.update', name: 'Update Users', description: 'Update user information', resource: 'user', action: 'update' },
      { id: 'user.delete', name: 'Delete Users', description: 'Delete users', resource: 'user', action: 'delete' },
      
      // Content management
      { id: 'content.read', name: 'Read Content', description: 'View content', resource: 'content', action: 'read' },
      { id: 'content.create', name: 'Create Content', description: 'Create new content', resource: 'content', action: 'create' },
      { id: 'content.update', name: 'Update Content', description: 'Update content', resource: 'content', action: 'update' },
      { id: 'content.delete', name: 'Delete Content', description: 'Delete content', resource: 'content', action: 'delete' },
      { id: 'content.publish', name: 'Publish Content', description: 'Publish content', resource: 'content', action: 'publish' },
      
      // Event management
      { id: 'event.read', name: 'Read Events', description: 'View events', resource: 'event', action: 'read' },
      { id: 'event.create', name: 'Create Events', description: 'Create new events', resource: 'event', action: 'create' },
      { id: 'event.update', name: 'Update Events', description: 'Update events', resource: 'event', action: 'update' },
      { id: 'event.delete', name: 'Delete Events', description: 'Delete events', resource: 'event', action: 'delete' },
      
      // Analytics
      { id: 'analytics.read', name: 'Read Analytics', description: 'View analytics data', resource: 'analytics', action: 'read' },
      
      // System administration
      { id: 'system.settings', name: 'System Settings', description: 'Manage system settings', resource: 'system', action: 'settings' },
      { id: 'system.logs', name: 'System Logs', description: 'View system logs', resource: 'system', action: 'logs' },
      { id: 'system.maintenance', name: 'System Maintenance', description: 'Perform system maintenance', resource: 'system', action: 'maintenance' },
      
      // Profile management
      { id: 'profile.read', name: 'Read Profile', description: 'View own profile', resource: 'profile', action: 'read' },
      { id: 'profile.update', name: 'Update Profile', description: 'Update own profile', resource: 'profile', action: 'update' }
    ];

    // Register permissions
    permissions.forEach(permission => {
      this.permissions.set(permission.id, permission);
    });

    // Define default roles
    const roles: Role[] = [
      {
        id: 'user',
        name: 'User',
        description: 'Basic user with read access to content',
        permissions: [
          this.permissions.get('content.read')!,
          this.permissions.get('event.read')!,
          this.permissions.get('profile.read')!,
          this.permissions.get('profile.update')!
        ]
      },
      {
        id: 'moderator',
        name: 'Moderator',
        description: 'Moderator with content management capabilities',
        inherits: ['user'],
        permissions: [
          this.permissions.get('content.create')!,
          this.permissions.get('content.update')!,
          this.permissions.get('content.publish')!,
          this.permissions.get('event.create')!,
          this.permissions.get('event.update')!,
          this.permissions.get('user.read')!
        ]
      },
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system administrator',
        inherits: ['moderator'],
        permissions: [
          this.permissions.get('user.create')!,
          this.permissions.get('user.update')!,
          this.permissions.get('user.delete')!,
          this.permissions.get('content.delete')!,
          this.permissions.get('event.delete')!,
          this.permissions.get('analytics.read')!,
          this.permissions.get('system.settings')!,
          this.permissions.get('system.logs')!,
          this.permissions.get('system.maintenance')!
        ]
      }
    ];

    // Register roles
    roles.forEach(role => {
      this.roles.set(role.id, role);
    });
  }

  /**
   * Add a new permission
   */
  addPermission(permission: Permission): void {
    this.permissions.set(permission.id, permission);
  }

  /**
   * Add a new role
   */
  addRole(role: Role): void {
    this.roles.set(role.id, role);
  }

  /**
   * Get all permissions for a role (including inherited)
   */
  getRolePermissions(roleId: string): Permission[] {
    const role = this.roles.get(roleId);
    if (!role) {
      return [];
    }

    const permissions = new Map<string, Permission>();

    // Add direct permissions
    role.permissions.forEach(permission => {
      permissions.set(permission.id, permission);
    });

    // Add inherited permissions
    if (role.inherits) {
      role.inherits.forEach(inheritedRoleId => {
        const inheritedPermissions = this.getRolePermissions(inheritedRoleId);
        inheritedPermissions.forEach(permission => {
          permissions.set(permission.id, permission);
        });
      });
    }

    return Array.from(permissions.values());
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(user: User): Permission[] {
    const permissions = new Map<string, Permission>();

    // Add permissions from roles
    user.roles.forEach(roleId => {
      const rolePermissions = this.getRolePermissions(roleId);
      rolePermissions.forEach(permission => {
        permissions.set(permission.id, permission);
      });
    });

    // Add custom permissions
    if (user.customPermissions) {
      user.customPermissions.forEach(permissionId => {
        const permission = this.permissions.get(permissionId);
        if (permission) {
          permissions.set(permission.id, permission);
        }
      });
    }

    return Array.from(permissions.values());
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: User, permissionId: string): boolean {
    const userPermissions = this.getUserPermissions(user);
    return userPermissions.some(permission => permission.id === permissionId);
  }

  /**
   * Check if user has permission for resource and action
   */
  hasResourcePermission(user: User, resource: string, action: string): boolean {
    const userPermissions = this.getUserPermissions(user);
    return userPermissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(user: User, permissionIds: string[]): boolean {
    return permissionIds.some(permissionId => this.hasPermission(user, permissionId));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(user: User, permissionIds: string[]): boolean {
    return permissionIds.every(permissionId => this.hasPermission(user, permissionId));
  }

  /**
   * Check if user has specific role
   */
  hasRole(user: User, roleId: string): boolean {
    return user.roles.includes(roleId);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user: User, roleIds: string[]): boolean {
    return roleIds.some(roleId => this.hasRole(user, roleId));
  }

  /**
   * Get role hierarchy level (higher number = higher privilege)
   */
  getRoleLevel(roleId: string): number {
    const roleLevels: Record<string, number> = {
      'user': 1,
      'moderator': 2,
      'admin': 3
    };

    return roleLevels[roleId] || 0;
  }

  /**
   * Check if user role level meets minimum requirement
   */
  meetsMinimumRoleLevel(user: User, minimumLevel: number): boolean {
    const userLevel = Math.max(...user.roles.map(roleId => this.getRoleLevel(roleId)));
    return userLevel >= minimumLevel;
  }

  /**
   * Get permission by ID
   */
  getPermission(permissionId: string): Permission | undefined {
    return this.permissions.get(permissionId);
  }

  /**
   * Get role by ID
   */
  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  /**
   * Get all permissions
   */
  getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  /**
   * Get all roles
   */
  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Filter permissions by resource
   */
  getPermissionsByResource(resource: string): Permission[] {
    return Array.from(this.permissions.values()).filter(
      permission => permission.resource === resource
    );
  }

  /**
   * Create a permission check function for React components
   */
  createPermissionCheck(user: User) {
    return {
      hasPermission: (permissionId: string) => this.hasPermission(user, permissionId),
      hasResourcePermission: (resource: string, action: string) => 
        this.hasResourcePermission(user, resource, action),
      hasAnyPermission: (permissionIds: string[]) => this.hasAnyPermission(user, permissionIds),
      hasAllPermissions: (permissionIds: string[]) => this.hasAllPermissions(user, permissionIds),
      hasRole: (roleId: string) => this.hasRole(user, roleId),
      hasAnyRole: (roleIds: string[]) => this.hasAnyRole(user, roleIds),
      meetsMinimumRoleLevel: (level: number) => this.meetsMinimumRoleLevel(user, level)
    };
  }
}

/**
 * Singleton RBAC manager instance
 */
export const rbacManager = new RBACManager();

/**
 * Permission checking decorators and HOCs
 */

/**
 * HOC for protecting React components with permission checks
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: string,
  fallbackComponent?: React.ComponentType
) {
  return function PermissionProtectedComponent(props: P) {
    // This would be implemented with actual user context
    // For now, this is a placeholder structure
    const user = null; // Get from context
    
    if (!user || !rbacManager.hasPermission(user, requiredPermission)) {
      if (fallbackComponent) {
        return React.createElement(fallbackComponent);
      }
      return null;
    }

    return React.createElement(WrappedComponent, props);
  };
}

/**
 * Hook for permission checking in React components
 */
export function usePermissions(user: User | null) {
  if (!user) {
    return {
      hasPermission: () => false,
      hasResourcePermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      hasRole: () => false,
      hasAnyRole: () => false,
      meetsMinimumRoleLevel: () => false
    };
  }

  return rbacManager.createPermissionCheck(user);
}