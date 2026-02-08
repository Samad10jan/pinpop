type UserType = {

    id: string;
    email: string;
    name: string;
    passwordHash: string;
    avatar: string | null;
    refreshToken: string | null;
    uploadCount: number;
    createdAt: Date;
 
}|null;

type ProfileType = {
  user?: UserType;
  followersCount?: number;
  followingCount?: number;
};

type ContextType = {
  profile: ProfileType | null;
  loading: boolean;
  refetch: () => void;
};

export type { UserType, ProfileType, ContextType };