"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PIN_PAGE_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { getGraphQLError } from "@/utils/ApiError";

import FollowBtn from "@/components/buttons/FollowBtn";
import LikeBtn from "@/components/buttons/LikeBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import PinCard from "@/components/cards/PinCard";
import CommentArea from "@/components/commons/CommentsArea";
import { PinType
 } from "@/types/types";
import Link from "next/link";

export default function PinPage() {
  const { pinId } = useParams();

  // split states
  const [pin, setPin] = useState<PinType
 | null>(null);
  const [relatedPins, setRelatedPins] = useState<PinType[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [tags, setTags] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

      } catch (e) {
        setError(getGraphQLError(e));
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

  //  optimistic update
  const handleFollowChange = (val: boolean) => {
    setIsFollowing(val);
    setFollowersCount(prev => (val ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
    <div className="flex gap-4 space-y-4 m-5 flex-wrap">
      <div className=" m-5">
        <div className="max-w-130 mx-auto">
          <Image
            src={pin.mediaUrl}
            alt={pin.title}
            width={700}
            height={1000}
            className=" rounded-2xl shadow"
            priority
          />
        </div>

        <div className="">
          <div className=" p-3 w-full">
            <div className="flex justify-between">
              <div className="">
                <p className="font-semibold text-xl line-clamp-2">
                  {pin.title}
                </p>
                <p className="font-semibold text-sm text-gray-500  line-clamp-2">
                  {pin.description}
                </p>

                <div className="flex gap-3 my-2 justify-start">
                  {tags.map(t => (
                    <div key={t.id} className="outline-2 text-gray-500 text-sm rounded-2xl px-2 py-1">
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-self-end mb-8 gap-3">
                <SaveBtn pinId={pin.id} isSaved={pin.isSaved} />
                <LikeBtn pinId={pin.id} isLiked={pin.isLiked} />

                <a
                  href={pin.mediaUrl}
                  download
                  target="_blank"
                  title={pin.title}
                  className="btn-circle bg-orange-400 active:bg-red-500! active:text-white"
                >
                 <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>

            <div className="mb-10 pb-8 border-b">
              <div className="flex justify-between items-center p-3 rounded-2xl ">
                <div className="flex gap-4 items-center ">
                  <Link href={`/main/profile/${pin.user.id}`} className="btn-circle group relative overflow-hidden transition-all duration-300">
                    <Image
                      src={pin.user.avatar || "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3"}
                      alt={pin.user.name}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                  </Link>

                  <div>
                    <h3 className="font-semibold">{pin.user.name}</h3>
                    <p className="text-sm text-gray-500">
                      {followersCount} followers
                    </p>
                  </div>
                </div>

                <FollowBtn
                  targetUserId={pin.user.id}
                  initiallyFollowing={isFollowing}
                  onFollowChange={handleFollowChange}
                />
              </div>
            </div>

            <CommentArea pinId={pin.id} />
          </div>
        </div>
      </div>

      <div className="columns-2 gap-4 w-[40%] space-y-4 m-5">

        {
        relatedPins.map((pin: PinType
) => (
          <PinCard data={pin} key={pin.id} />
        ))}
      </div>
    </div>
  );
}
