import React, { useState, useEffect } from 'react'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { db } from '../services/supabase'
import { BlogPost } from '../types'
import BlogSkeleton from '@/components/BlogSkeleton'
import BlogCard from '@/components/BlogCard'

const pageContent = {
  badge: "Our Blog",
  title: "Dental Health Insights",
  emptyMessage: "No blog posts found."
}

const POSTS_PER_PAGE = 6

const BlogListingPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<
    { name: string; count: number }[]
  >([])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)

      const { data, error, count } =
        await db.blog.getPaginated(page, POSTS_PER_PAGE)

      if (!error && data) {
        setPosts(data)

        if (count) {
          setTotalPages(Math.ceil(count / POSTS_PER_PAGE))
        }
      }

      // 🔥 Fetch Categories
      const { data: categoryData } = await db.blog.getCategoryCounts()

      if (categoryData) {
        // Manual grouping (safe version)
        const counts: Record<string, number> = {}

        categoryData.forEach((item: any) => {
          if (!item.category) return
          counts[item.category] = (counts[item.category] || 0) + 1
        })

        const formatted = Object.entries(counts).map(
          ([name, count]) => ({
            name,
            count,
          })
        )

        setCategories(formatted)
      }

      setLoading(false)
    }

    fetchPosts()
  }, [page])


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
          {pageContent.badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {pageContent.title}
        </h1>
      </div>

      {/* Content State Handling */}
      {loading ? (
        <BlogSkeleton />
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
          <p>{pageContent.emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-wrap items-start justify-between">
            <div className="w-full lg:w-9/12 lg:-mx-4">
              <div className="w-full lg:px-4">
                {/* Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {posts.map((post) => (
                    <div key={post.id ?? post.slug} className="h-full w-full">
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-stretch items-center gap-2 mt-12">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((prev) => prev - 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${page === 1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-primary hover:text-white border-slate-200'
                        }`}
                    >
                      <MdOutlineKeyboardArrowLeft />
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${page === pageNumber
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white hover:bg-primary hover:text-white border-slate-200'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => prev + 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${page === totalPages
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-primary hover:text-white border-slate-200'
                        }`}
                    >
                      <MdOutlineKeyboardArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-3/12 mt-12 lg:mt-0 lg:-mx-4">
              <div className="w-full lg:px-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">
                    Categories
                  </h3>

                  {categories.length > 0 ? (
                    <ul className="space-y-3">
                      {categories.map((category) => (
                        <li
                          key={category.name}
                          className="flex justify-between items-center text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-lg"
                        >
                          <span>{category.name}</span>
                          <span className="text-xs font-bold text-primary">
                            {category.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No categories found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )

}

export default BlogListingPage
