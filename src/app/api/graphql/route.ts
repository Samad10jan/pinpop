import { login, logout, sendSignupOtp, signup } from "@/src/lib/gql/resolvers/auth.resolver";
import { deleteComment, getPinComments, sendComment } from "@/src/lib/gql/resolvers/comments.resolver";
import { createPin, deletePin, getCurrentUserPins, getPinPageResponse, getPinsByTag, getSearchPagePins, getSugg, getTagsForPin, getUserAllPins, getUserFeed } from "@/src/lib/gql/resolvers/pin.resolver";
import { getAllTags, getSavedPins, toggleFollow, toggleLike, toggleSave } from "@/src/lib/gql/resolvers/toggles.resolver";
import { getCurrentProfile, getFollowingCount, getFollwersCount, getProfile, getTotalLikes, isFollowing, updateProfile, user } from "@/src/lib/gql/resolvers/user.resolver";

import { context } from "@/src/helper/context";
import typeDefs from "@/src/lib/gql/typeDefs/typeDefs";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";


export const resolvers = {
  Query: {
    user: user,

    getCurrentProfile: getCurrentProfile,

    getProfile: getProfile,

    getAllTags: getAllTags,

    getUserFeed: getUserFeed,

    getSugg: getSugg,

    getSearchPagePins: getSearchPagePins,

    getPinPageResponse: getPinPageResponse,

    getPinComments: getPinComments,

    getSavedPins: getSavedPins,
    getCurrentUserPins: getCurrentUserPins,

    getUserAllPins: getUserAllPins,

    getPinsByTag: getPinsByTag
    // isFollowing:isFollowing
  },
  ProfileResponse: {
    followersCount: getFollwersCount,
    followingCount: getFollowingCount,
    totalLikes: getTotalLikes,
    isFollowing: isFollowing
  },
  PinPageResponse: {
    tags: getTagsForPin
  },

  Mutation: {
    sendSignupOtp: sendSignupOtp,
    signup: signup,
    login: login,
    logout: logout,
    createPin: createPin,
    sendComment: sendComment,
    toggleSave: toggleSave,
    toggleLike: toggleLike,
    deleteComment: deleteComment,
    updateProfile: updateProfile,
    toggleFollow: toggleFollow,
    deletePin: deletePin,
    // addTags:addTags
  }

};



const server = new ApolloServer({
  typeDefs,
  resolvers
});

// const handler = startServerAndCreateNextHandler(server, {
//   context
// });

const handler = startServerAndCreateNextHandler(server, {
  context,
});


export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
// export { handler as GET, handler as POST };
