"use client";

import { CREATE_PIN_MUTATION, GET_TAGS_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    //   const [uplaodCount,setUploadCount]= useState(false)  // upload exceded


    const toggleTag = (id: string) => {
        setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    // preview of image
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // get file
        const selectedFile = e.target.files?.[0] || null;
        
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            // set url from FileReader.result
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            if (!title.trim()) throw new Error("Title required");
            if (!file) throw new Error("Image required");
            if (!selectedTags.length) throw new Error("Select at least one tag");

            // Check file size BEFORE uploading
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
            console.log(res);

            if (res.createPin) {
                setSuccess(true);
            }

        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch tags with error handling
    useEffect(() => {
        gqlClient.request(GET_TAGS_QUERY)
            .then(data => setAvailableTags(data.getTags.tags))
            .catch(err => {
                console.error("Failed to fetch tags:", err);
                setError("Failed to load tags. Please refresh the page.");
            });
    }, []);

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

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all duration-200";

    return (
        <main className="scale-95 bg-linear-to-br py-5 px-4 transition-all duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Pin</h1>
                </div>

                {success && <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-center animate-pulse">✓ Pin created successfully!</div>}
                {error && <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-center">⚠ {error}</div>}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
                                <input type="text" placeholder="Give your pin a title" className={inputClass} value={title} onChange={e => setTitle(e.target.value)} />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-gray-700 mb-2 block">Description</span>
                                <textarea placeholder="Tell everyone what your pin is about" className={`${inputClass} resize-none h-32`} value={description} onChange={e => setDescription(e.target.value)} />
                            </label>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">Tags * ({selectedTags.length} selected)</label>
                                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-xl">
                                    {availableTags.map(t => (
                                        <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(t.id) ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md transform scale-105" : "bg-white text-gray-700 border border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                                                }`}>
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
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