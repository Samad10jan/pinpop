import { Share2Icon } from "lucide-react";

export default function ShareButton() {
    const shareData = {
        title: "PinPop",
        text: "Check out this Pix!",
        url: window.location.href,
    };

    const handleShare = async () => {

        try {
            await navigator.share(shareData);
            // console.log("Shared successfully!");
        } catch (err) {
            console.error("Error sharing:", err);
        }

    };

    return (
        <button
            title="share"
            onClick={handleShare}
            className="btn-circle size-10!   relative overflow-hidden! group"
        >
            {typeof navigator.share === "function" && (
                <>
                    <Share2Icon size={20} />
                </>
            )}
            <div className="absolute inset-0 w-2 h-full  bg-amber-300 transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-2500" />

        </button>
    );
}
