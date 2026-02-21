export default function Loading() {
    const heights = [
        220, 320, 260, 560, 240,
        320, 280, 340, 230, 310,
        250, 250, 250, 430, 290,
        360, 240, 320, 260, 300
    ];

    return (
        <main className="page px-5 py-8 ">

            <div className="px-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {heights.map((h, i) => (
                    <div
                        key={i}
                        className={`w-full mb-4 break-inside-avoid rounded-2xl bg-black/20 animate-pulse`}
                        style={{ height: `${h}px` }}

                    />
                ))}
            </div>
        </main>
    );
}


/*
   <main className="page">
        <div className="container">
          <div className="card max-w-md mx-auto mt-20 text-center bg-cyan-600 text-white">
            <p className="text-xl font-bold">Loading profile...</p>
          </div>
        </div>
      </main>

*/