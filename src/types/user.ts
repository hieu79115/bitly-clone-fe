export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
    id?: number;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    role: Role;
}
