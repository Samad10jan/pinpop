"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

import { PIN_PAGE_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { getGraphQLError } from "@/src/helper/ApiError";

import FollowBtn from "@/src/components/buttons/FollowBtn";
import LikeBtn from "@/src/components/buttons/LikeBtn";
import SaveBtn from "@/src/components/buttons/SaveBtn";
import PinCard from "@/src/components/cards/PinCard";
import CommentArea from "@/src/components/commons/CommentsArea";
import {
  PinType
} from "@/src/types/types";
import Link from "next/link";
import { DownloadIcon, MessageCircleIcon } from "lucide-react";
import { UserContext } from "@/src/components/contexts/UserContext";
import ShareButton from "@/src/components/buttons/ShareBtn";
import { Tag } from "@/generated/prisma/client";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";

export default function PinPage() {
  const { pinId } = useParams();

  // split states
  const [pin, setPin] = useState<PinType | null>(null);
  const [relatedPins, setRelatedPins] = useState<PinType[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const context = useContext(UserContext)
  const user = context?.currentUser
  const toast = useToast();


  // The useCallback hook in React is used to memoize (cache) a function so that it isn’t recreated on every render.
  // This can help improve performance, especially when passing callbacks to child components that rely on reference 
  // equality to avoid unnecessary re-renders.

  //  optimistic update
  const handleFollowChange = useCallback((val: boolean) => {
    setIsFollowing(val);
    setFollowersCount(prev => (val ? prev + 1 : Math.max(0, prev - 1)));
  }, []);

  useEffect(() => {

    if (!pinId) return;

    async function fetchPin() {
      try {
        const res = await gqlClient.request(PIN_PAGE_QUERY, {
          getPinPageResponseId: pinId,
        });

        const d = res.getPinPageResponse;

        setPin(d.pin);
        setRelatedPins(d.relatedPins || []);
        setFollowersCount(d.followersCount || 0);
        setLikesCount(d.likesCount);
        setSavesCount(d.savesCount);
        setTags(d.tags || []);
        setIsFollowing(d.isFollowing);

      } catch (e: any) {
        const errorMsg = getGraphQLError(e);
        setError(errorMsg);
        toast.error(getGraphQLError(e));
      } finally {
        setLoading(false);
      }
    }

    fetchPin();
  }, [pinId]);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="card max-w-md mx-auto mt-20 text-center bg-cyan-600 text-white">
            <p className="text-xl font-bold">Loading pin...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        NO Pin
      </div>
    );
  }

  if (!pin) return null;


  return (
    <>
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      <div className="flex flex-col md:flex-row gap-8 ">

      <div className="w-full md:w-[45%]">

        <Image
          src={pin.mediaUrl}
          alt={pin.title}
          width={400}
          height={1000}
          className="rounded-2xl shadow w-full h-auto"
          priority
        />

        <div className="mt-6 p-3">

          <div className="flex flex-col md:flex-row md:justify-between gap-4">

            <div>
              <p className="font-semibold text-md md:text-xl line-clamp-2">
                {pin.title}
              </p>

              <p className="font-semibold text-xs text-gray-500 line-clamp-2">
                {pin.description}
              </p>

              <div className="flex flex-wrap gap-2 my-3">
                {tags.map((t) => (
                  <div
                    key={t.id}
                    className="outline text-gray-500 text-[8px] md:text-xs rounded-2xl px-3 py-1"
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <SaveBtn pinId={pin.id} isSaved={pin.isSaved} />
              <LikeBtn pinId={pin.id} isLiked={pin.isLiked} />


              <button
                title="comments"
                onClick={() => setShowComments((prev) => !prev)}
                className={`btn-circle size-10! relative overflow-hidden! group ${showComments ? "bg-orange-400" : "bg-white"} active:bg-orange-400 active:text-white `}
              >
                <MessageCircleIcon />
                <div className="absolute inset-0 w-2 h-full  bg-amber-300 transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-2500" />

              </button>

              <ShareButton />
            </div>
          </div>

          <div className="mt-8 pb-6 border-b">
            <div className="flex justify-between items-center">

              <div className="flex gap-4 items-center">
                <Link
                  href={`/main/profile/${pin.user.id}`}
                  className="btn-circle relative overflow-hidden flex justify-center items-center size-10! bg-green-300"
                >
                  {pin.user.avatar ?
                    <Image
                      src={pin.user.avatar}
                      alt={pin.user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    :
                    <div className=" capitalize p-5">{pin.user.name[0]}</div>

                  }
                </Link>

                <div>
                  <h3 className="font-semibold">{pin.user.name}</h3>
                  <p className="md:text-sm text-xs text-gray-500">
                    {followersCount} followers
                  </p>
                </div>
              </div>
              {user?.id !== pin.user.id

                &&

                <FollowBtn
                  targetUserId={pin.user.id}
                  initiallyFollowing={isFollowing}
                  onFollowChange={handleFollowChange}
                />
              }
            </div>
          </div>
          <div>


            <CommentArea
              pinId={pin.id}
              showComments={showComments}
              setShowComments={setShowComments}
            />
          </div>

        </div>
      </div>

      <div className="w-full md:w-[50%]">
        <h2 className="font-semibold text-lg mb-4">Related Pins</h2>

        <div className=" columns-2 gap-4">
          {relatedPins.map((pin: PinType) => (
            <div key={pin.id} className="mb-4 break-inside-avoid">
              <PinCard data={pin} />
            </div>
          ))}
        </div>
      </div>

    </div>
    </>
  );
}
