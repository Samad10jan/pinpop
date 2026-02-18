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
import { DownloadIcon } from "lucide-react";

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
                  <DownloadIcon/>
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
