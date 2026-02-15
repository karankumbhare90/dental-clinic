export default function BlogSkeleton() {
    return (
        <div className="w-full lg:w-9/12 grid grid-cols-1 md:grid-cols-2 gap-10">
            {Array.from({ length: 9 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse"
                >
                    {/* Image */}
                    <div className="h-56 bg-slate-200" />

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow">
                        {/* Meta */}
                        <div className="flex gap-4 mb-4">
                            <div className="h-4 w-24 bg-slate-200 rounded" />
                            <div className="h-4 w-20 bg-slate-200 rounded" />
                        </div>

                        {/* Title */}
                        <div className="h-6 w-full bg-slate-200 rounded mb-3" />
                        <div className="h-6 w-3/4 bg-slate-200 rounded mb-6" />

                        {/* Excerpt */}
                        <div className="h-4 w-full bg-slate-200 rounded mb-2" />
                        <div className="h-4 w-full bg-slate-200 rounded mb-2" />
                        <div className="h-4 w-2/3 bg-slate-200 rounded mb-6" />

                        {/* Button */}
                        <div className="h-4 w-24 bg-slate-200 rounded mt-auto" />
                    </div>
                </div>
            ))}
        </div>
    )
}
