export interface UserProfile {
    id: number,
    email: string,
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    phoneNumber?: string;
    company?: string;
    totalUrls: number;
    totalClicks: number;
    createdAt: string;
}