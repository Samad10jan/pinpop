import { login, signup } from "@/lib/gql/resolvers/auth";
import { createPin, deleteComment, getAllTags, getPinComments, getPinPageResponse, getSavedPins, getSearchPagePins, getSugg, getTagsForPin, getUserFeed, sendComment, toggleLike, toggleSave } from "@/lib/gql/resolvers/pin.resolver";
import { getCurrentProfile, getFollowingCount, getFollwersCount, getProfile, getTotalLikes, isFollowing, toggleFollow, updateProfile, user } from "@/lib/gql/resolvers/user.resolver";
import typeDefs from "@/lib/gql/typeDefs/typeDefs";
import { context } from "@/utils/helper/context";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

// import resolvers from "@/lib/gql/resolvers/auth";

// const resolvers = {
//     Query: {
//         hello: () => "Hello world!"

//     },

// };

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
// });

// const handler = startServerAndCreateNextHandler<NextRequest>(server, {
//     context: async req => ({ req }),
// });

// export { handler as GET, handler as POST };
// import prisma from "@/lib/services/prisma";
// import { hashPassword, verifyPassword, signAccess, signRefresh } from "@/utils/helper/auth";
// import { cookies } from "next/headers";
// import { ApiError } from "@/utils/ApiError";

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
    
    // isFollowing:isFollowing
  },
  ProfileResponse: {
    followersCount: getFollwersCount,
    followingCount: getFollowingCount,
    totalLikes: getTotalLikes,
    isFollowing:isFollowing
  },
  PinPageResponse: {
    tags: getTagsForPin
  },

  Mutation: {

    signup: signup,
    login: login,

    createPin: createPin,
    sendComment: sendComment,
    toggleSave: toggleSave,
    toggleLike: toggleLike,
    deleteComment: deleteComment,
    updateProfile:updateProfile,
    toggleFollow: toggleFollow,
    
    // addTags:addTags
  }

};



const server = new ApolloServer({
  typeDefs,
  resolvers
});

const handler = startServerAndCreateNextHandler(server, {
  context
});

export { handler as GET, handler as POST };
