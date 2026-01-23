import { useAuth } from "../context/authContext";

export const useRoleCheck = () => {
    const { user } = useAuth();

    return {
        isAdmin: user?.role === 'Employee',
        isClient: user?.role === 'Client',
        isGuest: !user,

        hasRole: (role: string | string[]) => {
            if (!user) return false;
            if (Array.isArray(role)) {
                return role.includes(user.role);
            }
            return user.role === role;
        }
    };
};
