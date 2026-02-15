import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { BlogPost } from '@/types'
import { getOptimizedImage } from '@/utils/image'

interface BlogCardProps {
    post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
    if (!post) return null

    return (
        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group h-full flex flex-col">
            <div className="relative h-56 overflow-hidden">
                <img
                    alt={post.title ?? 'Blog image'}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    src={getOptimizedImage(
                        post.featured_image_url || `https://picsum.photos/seed/${post.id ?? 'default'}/600/400`,
                        600,
                        400
                    )}
                    loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-primary/90 px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                    {post.category ?? 'General'}
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-4 font-semibold">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        {post.created_at
                            ? new Date(post.created_at).toLocaleDateString()
                            : '—'}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-primary" />
                        {post.author_name ?? 'Unknown Author'}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title ?? 'Untitled'}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt ?? ''}
                </p>

                {post.slug && (
                    <Link
                        to={`/blog/${post.slug}`}
                        className="text-primary font-bold hover:text-primary-dark inline-flex items-center mt-auto text-sm"
                    >
                        Read Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                )}
            </div>
        </article>
    )
}
