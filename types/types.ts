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

type FeedPinType = {
  id: string;
  title: string;
  // description: string | null;
  mediaUrl: string;
  fileType: string;
  tagIds: string[];
  createdAt: Date;
  // user: UserType;
}

type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
};

export type { UserType, ProfileType, ContextType, FeedPinType,CommentType };