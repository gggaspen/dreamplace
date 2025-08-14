/**
 * User Domain Entity
 * Represents a user in the domain layer following clean architecture principles
 */

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  roles: UserRole[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  events: boolean;
  artists: boolean;
}

export type UserRole = 'user' | 'admin' | 'moderator' | 'artist';

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  profile: UserProfile;
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly emailVerified: boolean,
    public readonly profile: UserProfile,
    public readonly createdAt: Date,
    public readonly lastLoginAt: Date,
    public readonly isActive: boolean = true
  ) {}

  hasRole(role: UserRole): boolean {
    return this.profile.roles.includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  canAccess(resource: string, action: string): boolean {
    // Basic RBAC implementation
    if (this.isAdmin()) return true;
    
    // Add more sophisticated permission logic here
    switch (resource) {
      case 'events':
        return action === 'read' || this.hasAnyRole(['moderator', 'artist']);
      case 'artists':
        return action === 'read' || this.hasRole('artist');
      default:
        return false;
    }
  }

  updateProfile(updates: Partial<UserProfile>): User {
    return new User(
      this.id,
      this.email,
      this.emailVerified,
      { ...this.profile, ...updates },
      this.createdAt,
      this.lastLoginAt,
      this.isActive
    );
  }

  updateLastLogin(): User {
    return new User(
      this.id,
      this.email,
      this.emailVerified,
      this.profile,
      this.createdAt,
      new Date(),
      this.isActive
    );
  }
}