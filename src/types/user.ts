export type Role = string;

export interface User {
    id?: number;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    role?: string;
    roles?: string[];
    permissions?: string[];
}
