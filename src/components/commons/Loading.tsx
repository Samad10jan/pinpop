export default function Loading() {
    const heights = [
        220, 320, 260, 560, 240,
        320, 280, 340, 230, 310,
        250, 250, 250, 430, 290,
        360, 240, 320, 260, 300
    ];

    return (
        <main className="page px-5 py-8 ">

            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {heights.map((h, i) => (
                    <div
                        key={i}
                        className={`relative break-inside-avoid mb-4 rounded-2xl overflow-hidden shadow transition-all bg-black/20 animate-pulse border-0 backdrop-blur-sm`}
                        style={{ height: `${h}px` }}

                    />
                ))}
            </div>
        </main>
    );
}
