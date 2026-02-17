type FileType = "PHOTO" | "GIF";


type UserType = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  uploadCount: number;
  createdAt: Date;
} | null;


type CurrentProfileType = {
  user: UserType;
  followersCount?: number;
  followingCount?: number;
  totalLikes?: number;
  lastSavedPins?: PinType[];
};

type ProfileType = {
  user: UserType;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  isFollowing: boolean;
  lastUploadedPins: PinType[];
};





type PinType
 = {
  id: string;
  title: string;
  description: string,
  mediaUrl: string;
  fileType: FileType;
  tagIds: string[];
  createdAt: string;

  user: {
    id: string;
    name: string;
    avatar: string | null;
  };

  isSaved: boolean;
  isLiked: boolean;
};


type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};


type FeedResponseType = {
  items: PinType[];
};



type PinPageResponseType = {
  pin: PinType
;
  relatedPins: PinType[];
  followersCount?: number;
  likesCount: number;
  savesCount: number;
  tags: TagType[],
  isFollowing: boolean;
};



type TagType = {
  id: string;
  name: string;
};

type GetTagsResponseType = {
  tags: TagType[];
  uploadCount: boolean;
};



type ToggleSaveResponseType = {
  saved: boolean;
};

type ToggleLikeResponseType = {
  like: boolean;
};




type AuthPayloadType = {
  user: UserType;
};



type SuggestionType = string;


export type {
  UserType,
  ProfileType,
  CurrentProfileType,
  PinType
,
  CommentType,

  FeedResponseType,
  PinPageResponseType,
  TagType,
  GetTagsResponseType,
  ToggleSaveResponseType,
  ToggleLikeResponseType,
  AuthPayloadType,
  SuggestionType
};
