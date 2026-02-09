"use client";

import { UserContext } from "@/components/contexts/UserContext";
import { PROFILE_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function UserPage() {
    const params = useParams();
    const userId = params.userId;
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext)
    // console.log("here user:",currentUser,userId);

    if (!currentUser || currentUser.id !== userId) return <p className="p-10">Unauthorized</p>;

    useEffect(() => {
        async function getData() {


            try {
                const data = await gqlClient.request(PROFILE_QUERY);
                setProfile(data?.getProfile || null);
            } catch (err) {
                console.error("GraphQL error:", err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        }
        getData()
    }, []);

    if (loading) return <p className="p-10">Loading...</p>;

    const user = profile?.user || {};
    // console.log(user);


    const name = user?.name || "Anonymous";
    const email = user?.email || "No email";
    const avatar = user?.avatar || "/as";
    // console.log(user);


    const followers = profile?.followersCount || 0;
    const following = profile?.followingCount || 0;

    return (
        <main className="page">
            <div className="container mt-10">

                <div className="card flex items-center gap-6 max-w-xl mx-auto my-10">


                    <div className=" relative w-22.5 h-22.5 rounded-full border-2 border-black shadow-[4px_4px_0_black] overflow-hidden bg-gray-200 shrink-0">
                        <div className=" absolute w-full h-full">

                            <Image
                                src={avatar || "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3"}
                                alt="avatar"
                                fill
                                className="w-full h-full object-cover"
                            />

                        </div>
                    </div>


                    <div className="flex-1">

                        <h2 className="text-xl font-bold">
                            {name}
                        </h2>

                        <p className="text-sm opacity-70">
                            {email}
                        </p>


                        <div className="flex gap-6 mt-3 text-sm font-bold justify-end">

                            <div>
                                {followers}
                                <span className="ml-1 font-normal">Followers</span>
                            </div>

                            <div>
                                {following}
                                <span className="ml-1 font-normal">Following</span>
                            </div>

                        </div>
                    </div>

                </div>
                <div className="card max-h-screen">
                    <div className="card my-5 px-8">
                        <div className="flex justify-between items-center">
                            <div className="font-bold">
                                Saved Pins
                            </div>
                            <Link href={`/main/saved`} className="btn-rect ">
                                More
                            </Link >
                        </div>

                    </div>

                    <div className="card my-5 p-8">
                        <div className="flex justify-between items-center">
                            <div className="font-bold">
                                Liked Pins
                            </div>
                            {/* <Link href={`/main/liked`} className="btn-rect ">
                                More
                            </Link > */}
                        </div>

                    </div>

                </div>

            </div>
        </main>
    );
}
