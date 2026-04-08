

/* ---------------- ENUMS ---------------- */

export type FileType = "PHOTO" | "GIF";

export type ResourceType = "IMAGE" | "VIDEO" | "RAW";


/* ---------------- USER ---------------- */

export type UserType = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  uploadCount: number;
  // createdAt: string;
} | null;

export type AuthPayloadType = {
  user: UserType;
  uploadCount: boolean;
};

/* ---------------- PIN ---------------- */

export type PinUserType = {
  id: string;
  name: string;
  avatar: string | null;
};

export type PinType = {
  id: string;
  title: string;
  description?: string | null;

  mediaUrl: string;
  publicId: string;

  fileType: FileType;
  resourceType?: ResourceType;

  tagIds: string[];

  createdAt: string;

  user: PinUserType;

  isSaved: boolean;
  isLiked: boolean;
};


/* ---------------- COMMENTS ---------------- */

export type CommentType = {
  id: string;
  content: string;
  createdAt: string;

  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};


/* ---------------- TAG ---------------- */

export type TagType = {
  id: string;
  name: string;
};


/* ---------------- PROFILE ---------------- */

export type CurrentProfileType = {
  user: UserType;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  lastSavedPins: PinType[];
};

export type ProfileType = {
  user: UserType;

  followersCount: number;
  followingCount: number;
  totalLikes: number;

  isFollowing: boolean;

  lastUploadedPins: PinType[];
};


/* ---------------- FEED / PAGINATION ---------------- */

export type FeedResponseType = {
  pins: PinType[];

  page: number;
  limit: number;

  totalPins: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPrevPage: boolean;
};


/* ---------------- PIN PAGE ---------------- */

export type PinPageResponseType = {
  pin: PinType;

  relatedPins: PinType[];

  followersCount?: number;

  likesCount: number;
  savesCount: number;

  tags: TagType[];

  isFollowing: boolean;
};


/* TAG RESPONSE*/

export type GetTagsResponseType = {
  tags: TagType[];
  uploadCount: boolean;
};


/* ---------------- TOGGLE RESPONSES ---------------- */

export type ToggleSaveResponseType = {
  saved: boolean;
};

export type ToggleLikeResponseType = {
  like: boolean;
};

export type BooleanResponseType = {
  success: boolean;
};

export type MessageResponseType = {
  message: string;
};





/* ---------------- SUGGESTIONS ---------------- */

export type SuggestionType = string[];


/* ---------------- ANALYTICS ---------------- */

// One user Pin's analytics data contains
export type UserPinAnalyticsType = {
  id: string;
  title: string;
  description?: string | null;

  mediaUrl: string;
  publicId: string;

  fileType: FileType;
  tagIds: string[];

  createdAt: string;

  likesCount: number;
  savesCount: number;
  commentsCount: number;

  engagementScore: number;
};

export type CurrentUserAnalyticsResponseType = {
  pins: UserPinAnalyticsType[];

  totalPins: number;
  totalLikes: number;
  totalSaves: number;
  totalComments: number;

  followersCount: number;
  followingCount: number;

  avgEngagementPerPin: number;

  topPins: UserPinAnalyticsType[];
};

//
export type ToastType = "success" | "error" | "info";

export interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}