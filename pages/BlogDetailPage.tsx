import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '../services/supabase'
import { BlogPost, RecentPost } from '../types'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { getOptimizedImage } from '../utils/image'
import { setPageMetadata } from '../utils/seo'

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const [post, setPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      if (!slug) {
        setLoading(false)
        return
      }

      const { data, error } = await db.blog.getBySlug(slug)

      if (!error && data && isMounted) {
        setPost(data)

        setPageMetadata({
          title: data.seo_title ?? data.title,
          description: data.seo_description ?? data.excerpt,
          image: data.featured_image_url ?? '',
          type: 'article',
          url: window.location.href,
        })

        // Fetch recent posts
        const { data: allPosts } = await db.blog.getAll()

        if (allPosts) {
          const filtered = allPosts
            .filter((p) => p.slug !== slug)
            .slice(0, 4)

          setRecentPosts(filtered)
        }
      }

      if (isMounted) setLoading(false)
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [slug])

  const formattedDate = useMemo(() => {
    if (!post?.created_at) return ''
    return new Date(post.created_at).toLocaleDateString()
  }, [post?.created_at])

  const imageUrl = useMemo(() => {
    return getOptimizedImage(
      post?.featured_image_url ||
      `https://picsum.photos/seed/${post?.id ?? 'default'}/1200/800`,
      1600,
      900
    )
  }, [post?.featured_image_url, post?.id])

  if (loading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-slate-400">
        Loading article...
      </div>
    )

  if (!post)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-slate-400">
        Article not found.
      </div>
    )

  return (
    <article className="pb-20">
      {/* HERO */}
      <div className="relative h-[400px] md:h-[600px] overflow-hidden">
        <img
          alt={post.title ?? 'Blog image'}
          className="w-full h-full object-cover"
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
              {post.title ?? 'Untitled'}
            </h1>

            <div className="flex items-center gap-6 text-white/70 text-sm font-medium uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>

              <span className="flex items-center gap-2 text-primary font-bold">
                By {post.author_name ?? 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT + SIDEBAR */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="prose prose-lg prose-primary max-w-none">
            {post.excerpt && (
              <p className="text-xl font-medium text-slate-600 mb-12 italic border-l-4 border-primary pl-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.content && (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                {post.content}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {recentPosts && recentPosts.length > 0 &&
          <aside>
            <h3 className="text-lg font-bold mb-6 text-slate-800">
              Recent Posts
            </h3>

            <div className="flex flex-col items-start justify-start gap-2">
              {recentPosts.map((recent: RecentPost) => (
                <Link
                  key={recent.id}
                  to={`/blog/${recent.slug}`}
                  className="group flex gap-4 hover:bg-slate-200 rounded-lg p-2.5 transition-colors"
                >
                  <img
                    src={getOptimizedImage(
                      recent.featured_image_url ||
                      `https://picsum.photos/seed/${recent.id}/200/200`,
                      200,
                      200
                    )}
                    alt={recent.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex flex-col items-start justify-start gap-1">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                      {recent.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {recent.excerpt ? recent.excerpt.slice(0, 60) + '...' : ''}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {new Date(recent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        }
      </div>
    </article>
  )
}

export default BlogDetailPage
