"use client";

import { UserContext } from "@/src/components/contexts/UserContext";
import { getGraphQLError } from "@/src/helper/ApiError";
import { CREATE_PIN_MUTATION } from "@/src/lib/gql/mutations/mutations";
import { GET_TAGS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ImagePlus, Sparkles } from "lucide-react";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";

const MAX_SIZE = 10 * 1024 * 1024;

export default function CreatePin() {
    const router = useRouter();
    const toast = useToast();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const context = useContext(UserContext);

    useEffect(() => {
        gqlClient.request(GET_TAGS_QUERY)
            .then(data => setAvailableTags(data.getAllTags.tags))
            .catch(() => toast.error("Failed to load tags. Please refresh the page."));
    }, []);

    const toggleTag = (id: string) => {
        setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl(null);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!title.trim()) throw new Error("Title required");
            if (title.trim().length > 20) throw new Error("Title must be less than 20 chars");
            if (!file) throw new Error("Image required");
            if (!selectedTags.length) throw new Error("Select at least one tag");
            if (selectedTags.length > 3) throw new Error("At max only 3 tags allowed");

            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) throw new Error("Only JPEG, PNG, or GIF images are allowed");
            if (file.size > MAX_SIZE) throw new Error("File size exceeds 10MB limit");

            const form = new FormData();
            form.append("file", file);

            const upload = await fetch("/api/upload/pin", { method: "POST", body: form });
            const uploaded = await upload.json();

            if (!uploaded.secure_url) throw new Error("Image upload failed. Please try again.");

            const fileType = file.type.includes("gif") ? "GIF" : "PHOTO";

            const res = await gqlClient.request(CREATE_PIN_MUTATION, {
                title,
                description,
                mediaUrl: uploaded.secure_url,
                fileType,
                tagIds: selectedTags,
                publicId: uploaded.public_id,
                resourceType: uploaded.resource_type.toUpperCase()
            });

            if (res.createPin) {
                toast.success("Pin created! Redirecting...");
                setTimeout(() => {
                    setTitle(""); setDescription(""); setFile(null);
                    setPreviewUrl(null); setSelectedTags([]);
                    router.push("/");
                }, 2000);
            }

        } catch (e: any) {
            toast.error(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 text-sm";

    return (
        <main className="min-h-screen bg-[#f7f5f2] py-8 px-4">
            <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

            <div className="max-w-5xl mx-auto">

                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase mb-1">New Creation</p>
                        <h1 className="text-5xl font-black tracking-tighter leading-none">
                            Create <span className="italic text-yellow-500">Pin</span>
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 mb-1">
                        <div className="h-2 w-2 rounded-full bg-amber-400" />
                        <div className="h-2 w-8 rounded-full bg-black" />
                        <div className="h-2 w-2 rounded-full bg-(--teal)" />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:flex-row gap-5">

                        {/* LEFT — Image Upload */}
                        <div className="lg:w-[42%] flex flex-col gap-4">
                            <input type="file" className="hidden" id="file-upload" accept="image/jpeg,image/png,image/gif" onChange={handleFileChange} />
                            <label
                                htmlFor="file-upload"
                                className="group relative flex flex-col items-center min-h-110 justify-center w-full rounded-3xl cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-amber-400 transition-all duration-300 bg-white"
                            >
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0 rounded-3xl min-h-110" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl flex flex-col items-center justify-center gap-2">
                                            <ImagePlus className="text-white" size={32} />
                                            <span className="text-white font-semibold text-sm">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-10 flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 flex items-center justify-center group-hover:bg-amber-100 transition-all">
                                            <ImagePlus className="text-amber-400" size={28} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700 text-sm">Drop your image here</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF · Max 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </label>

                            {file && (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                                    <p className="text-xs text-gray-600 truncate"><span className="font-semibold">Selected:</span> {file.name}</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT — Form */}
                        <div className="flex-1 flex flex-col gap-4">

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <label className="block">
                                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 block">Title *</span>
                                    <input type="text" placeholder="A great title, max 20 chars" className={inputClass} value={title} onChange={e => setTitle(e.target.value)} maxLength={20} />
                                    <div className="flex justify-end mt-1.5">
                                        <span className={`text-xs font-medium ${title.length >= 18 ? "text-red-400" : "text-gray-300"}`}>{title.length}/20</span>
                                    </div>
                                </label>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <label className="block">
                                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 block">Description</span>
                                    <textarea placeholder="Tell everyone what your pin is about..." className={`${inputClass} resize-none h-24`} value={description} maxLength={50} onChange={e => setDescription(e.target.value)} />
                                    <div className="flex justify-end mt-1.5">
                                        <span className={`text-xs font-medium ${description.length >= 45 ? "text-red-400" : "text-gray-300"}`}>{description.length}/50</span>
                                    </div>
                                </label>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Tags *</span>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${selectedTags.length === 3 ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"}`}>
                                        {selectedTags.length}/3 selected
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                                    {availableTags.map((t) => {
                                        const isSelected = selectedTags.includes(t.id);
                                        const isMaxReached = selectedTags.length === 3;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => toggleTag(t.id)}
                                                disabled={!isSelected && isMaxReached}
                                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 
                                                    ${isSelected
                                                        ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md scale-105"
                                                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-amber-400 hover:bg-amber-50"
                                                    } 
                                                    ${!isSelected && isMaxReached ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                            >
                                                {isSelected && <Sparkles size={10} className="inline mr-1 mb-0.5" />}
                                                {t.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 
                                    ${loading
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "btn-rect from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <ImagePlus size={18} /> Publish Pin
                                    </span>
                                )}
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}