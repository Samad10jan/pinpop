"use client";

import FollowBtn from "@/components/buttons/FollowBtn";
import { PROFILE_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { ProfileType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function getData() {
      try {
        const data = await gqlClient.request(PROFILE_QUERY, {
          userId,
        });

        setProfile(data?.getProfile || null);
      } catch (err: any) {
        console.error("GraphQL error:", err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [userId]);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="card max-w-md mx-auto mt-20 text-center bg-cyan-600 text-white">
            <p className="text-xl font-bold">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page">
        <div className="container">
          <div className="card max-w-md mx-auto mt-20 text-center bg-red-500 text-white">
            <h2 className="text-2xl font-bold mb-2">User not found</h2>
          </div>
        </div>
      </main>
    );
  }

  const user = profile?.user || {};
  const name = profile.user?.name || "Anonymous";
  const email = profile.user?.email || "No email";
  const avatar = profile?.user?.avatar ||
    "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3";

  const followers = profile?.followersCount || 0;
  const following = profile?.followingCount || 0;
  const totalPins = profile?.user?.uploadCount || 0;
  const likes = profile?.totalLikes || 0;

  const lastUploadedPins = profile.lastUploadedPins || []

  return (
    <main className="page">
      <div className="container py-8">


        <div className="my-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Profile View</h1>
        </div>


        <div className="grid lg:grid-cols-12 gap-6">


          <div className="lg:col-span-4">
            <div className="card sticky top-8 bg-white">


              <div className="flex justify-center mb-6 ">
                <div className=" relative w-32! h-32! btn-circle overflow-hidden! ">
                  <div className=" absolute w-full h-full ">

                    <Image
                      src={avatar}
                      alt={`${name}'s avatar`}
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-1">{name}</h2>
                <p className="text-sm opacity-70 mb-4">{email}</p>

                <FollowBtn />

              </div>


              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg mb-4 bg-[#F0E7D6] border-2 border-black">
                <div className="text-center">
                  <div className="text-2xl font-bold">{followers}</div>
                  <div className="text-xs opacity-70">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{following}</div>
                  <div className="text-xs opacity-70">Following</div>
                </div>
              </div>


            </div>
          </div>

          <div className="lg:col-span-8">

            <div className="grid md:grid-cols-2 gap-4 mb-6">

              <div className="card text-center btn-rect bg-orange-500! text-white">
                <div className="text-3xl font-bold">{totalPins}</div>
                <div className="text-sm mt-1">Total Pins</div>
              </div>

              <div className="card text-center btn-rect bg-purple-600! text-white">
                <div className="text-3xl font-bold">{likes}</div>
                <div className="text-sm mt-1">Likes</div>
              </div>
            </div>


            <div className="card mb-6 bg-white">
              <h3 className="text-xl font-bold mb-4">{name}'s Pins</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {lastUploadedPins.map((u: any) => (
                  <div key={u.id} className="relative w-62 h-40 mb-4 group rounded-2xl overflow-hidden hover:shadow-xl transition-all">

                    <div className=" absolute w-full h-full">

                      <Image
                        src={u.mediaUrl}
                        alt={u.title}
                        fill
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />


                      <Link href={`/main/pin/${u.id}`}>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40">
                          <div className="absolute bottom-0 p-3 w-full">
                            <p className="font-semibold text-sm text-white line-clamp-2">
                              {u.title}
                            </p>
                          </div>
                        </div>
                      </Link>




                    </div>

                  </div>
                ))}
              </div>

              <Link href="/main/" className="btn-rect w-full text-center block">
                View All {name.split(' ')[0]}'s Pins
              </Link>


            </div>






          </div>
        </div>
      </div>
    </main>
  );
}
