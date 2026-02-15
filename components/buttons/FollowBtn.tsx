export default function FollowBtn() {
    return (
        <button title="follow" className="btn-rect relative  bg-white group text-black border-black border px-5! py-2! rounded-xl!">
            Follow
            <div className="absolute inset-0 w-2 h-full  bg-white transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-1500" />

        </button>
    )
}