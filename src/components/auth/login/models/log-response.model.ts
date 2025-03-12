export interface LoginResponse{
    token: string;
    email: string;
    refreshToken: string;
    roles: string[];
}