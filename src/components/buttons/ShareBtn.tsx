import { useState } from "react";
import { Share2, Copy, Share, Share2Icon } from "lucide-react"; // optional icons

function ShareButton() {
    const [copied, setCopied] = useState(false);

    const shareData = {
        title: "Fixel",
        text: "Check out this Fix!",
        url: window.location.href,
    };

    const handleShare = async () => {

        try {
            await navigator.share(shareData);
            console.log("Shared successfully!");
        } catch (err) {
            console.error("Error sharing:", err);
        }

    };

    return (
        <button
            onClick={handleShare}
            className="btn-circle  relative overflow-hidden! group"
        >
            {typeof navigator.share === "function" && (
                <>
                    <Share2Icon size={18} />
                </>
            )}
            <div className="absolute inset-0 w-2 h-full  bg-amber-300 transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-2500" />

        </button>
    );
}

export default ShareButton;