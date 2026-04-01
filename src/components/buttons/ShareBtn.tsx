import { Share2Icon } from "lucide-react";
import { useToast } from "@/src/components/commons/Toast";

export default function ShareButton() {
    const toast = useToast();
    const shareData = {
        title: "PinPop",
        text: "Check out this Pix!",
        url: window.location.href,
    };

    const handleShare = async () => {

        try {
            await navigator.share(shareData);
            toast.success("Shared successfully!");
        } catch (err: any) {
            // User dismissed share dialog or other error
            if (err.name !== "AbortError") {
                toast.error("Failed to share");
            }
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
