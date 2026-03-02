"use client";

import { UserContext } from "@/src/components/contexts/UserContext";
import { CREATE_PIN_MUTATION, GET_TAGS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function CreatePin() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    //   const [uplaodCount,setUploadCount]= useState(false)  // uploadcount--> get from Context

    const context = useContext(UserContext);
    const currentUser = context?.currentUser;


    // get All Tags
    useEffect(() => {
        gqlClient.request(GET_TAGS_QUERY)
            .then(data => setAvailableTags(data.getAllTags.tags))
            .catch(err => {
                console.error("Failed to fetch tags:", err);
                setError("Failed to load tags. Please refresh the page.");
            });
    }, []);

    const toggleTag = (id: string) => {
        // if id already present, then remove, else add 
        setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    // preview of image
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        // get file
        const selectedFile = e.target.files?.[0] || null;

        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            // The FileReader interface lets web applications asynchronously read the contents of files (or raw data buffers) 
            // stored on the user's computer, using File or Blob objects to specify the file or data to read.

            // tbh idk?
            // set url from FileReader.result

            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl(null);
        }
    };

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            if (!title.trim()) throw new Error("Title required");
            if (title.trim().length > 20) throw new Error("Title must be Less Than 20 char");
            if (!file) throw new Error("Image required");
            if (!selectedTags.length) throw new Error("Select at least one tag");
            if (selectedTags.length > 3) throw new Error("At Max only 3 tags Allowed");


            // Check file size
            if (file.size > MAX_SIZE) {
                throw new Error("File size exceeds 10MB limit");
            }

            const form = new FormData();

            form.append("file", file);

            const upload = await fetch("/api/upload/pin", { method: "POST", body: form });

            const uploaded = await upload.json();

            if (!uploaded.url) throw new Error("Image upload failed. Please try again.");

            const fileType = file.type.includes("gif") ? "GIF" : "PHOTO";

            const res = await gqlClient.request(CREATE_PIN_MUTATION, {
                title,
                description,
                mediaUrl: uploaded.url,
                fileType,
                tagIds: selectedTags
            });
            // console.log(res);

            if (res.createPin) {
                setSuccess(true);
            }

        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };



    // Handle redirect after success
    useEffect(() => {
        if (success) {

            const timer = setTimeout(() => {

                setTitle("");
                setDescription("");
                setFile(null);
                setPreviewUrl(null);
                setSelectedTags([]);
                router.push("/");

            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [success, router]);



    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all duration-200";

    return (
        <main className="scale-95 bg-linear-to-br py-5 px-4 transition-all duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="relative text-center mx-auto mb-5">

                    <div className="text-6xl font-black tracking-tighter">
                        Create
                        <span className="italic text-yellow-500 ml-4">Pin</span>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-1 w-12 bg-black rounded-full" />
                        <div className="h-1 w-4 bg-(--orange) rounded-full" />
                        <div className="h-1 w-2 bg-(--teal) rounded-full" />
                    </div>
                </div>

                {success && <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-center animate-pulse">✓ Pin created successfully!</div>}
                {error && <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-center">⚠ {error}</div>}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    <div className="flex flex-col gap-8 p-8" >


                        <div className="flex flex-col md:flex-row gap-8 p-8">

                            <div className="flex-1 space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Upload Image *</span>
                                    <input type="file" className="hidden" id="file-upload" accept="image/*" onChange={handleFileChange} />
                                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all duration-200">
                                        {previewUrl ? (
                                            <div className="relative w-full h-full">
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-medium">Change Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-6">
                                                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                    </label>
                                </label>
                                {file && <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg"><span className="font-medium">Selected:</span> {file.name}</div>}
                            </div>

                            <div className="flex-1 space-y-6">
                                <label className="block">
                                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Title *</span>
                                    <input type="text" placeholder="Give your pin a title, max 20 chars" className={inputClass} value={title} onChange={e => setTitle(e.target.value)} maxLength={20} />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Description</span>
                                    <textarea placeholder="Tell everyone what your pin is about, max 50 chars" className={`${inputClass} resize-none h-22`} value={description} maxLength={50} onChange={e => setDescription(e.target.value)} />
                                </label>
                            </div>

                        </div>

                        <div className="-mt-4 mb-4">
                            <label className="text-sm font-semibold text-gray-700 block">Tags * ({selectedTags.length} selected)  <span className="flex justify-end">* Select Only 3</span></label>

                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-xl">

                                {availableTags.map((t) => {

                                    const isSelected = selectedTags.includes(t.id);
                                    const isMaxReached = selectedTags.length === 3;

                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => toggleTag(t.id)}
                                            disabled={!isSelected && isMaxReached}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                                                    ${isSelected
                                                    ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md"
                                                    : "bg-white text-gray-700 border border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                                                } 
                                                    ${!isSelected && isMaxReached
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                } `}  >

                                            {t.name}
                                        </button>
                                    );
                                })}
                            </div>


                        </div>
                    </div>
                    <div className="px-8 pb-8">
                        <button type="submit" disabled={loading}
                            className={`w-full py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${loading ? "bg-gray-400 cursor-not-allowed" : "btn-rect from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                }`}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    Uploading...
                                </span>
                            ) : "Create Pin"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}