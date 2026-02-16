
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/supabase';
import { BlogPost } from '../../types';
import { Plus, Edit, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { getOptimizedImage } from '../../utils/image';

const BlogEditor: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await db.blog.getAll();
    if (data) setPosts(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this article from blog?')) {
      await db.blog.delete(id);
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Health Blog Articles</h2>
          <p className="text-slate-500 text-sm">Educational content for your patients</p>
        </div>
        <Link to="/admin/blog/new" className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Create Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse"></div>)
        ) : posts.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <BookOpen className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold">No articles yet.</p>
            <p className="text-sm">Start educating your patients today.</p>
          </div>
        ) : posts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={getOptimizedImage(post.featured_image_url || `https://picsum.photos/seed/${post.id}/600/400`, 600, 400)}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-primary/90 text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest">{post.category}</div>
            </div>
            <div className="p-5 flex flex-col flex-1 item-start justify-start gap-3">
              <div className="flex flex-col items-start justify-start gap-2">
                <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
              </div>
              <div className="flex flex-col items-start justify-start gap-3 mt-auto">
                <p className="w-full text-xs text-slate-400 flex justify-between border-t border-slate-50">
                  <span className="font-bold uppercase tracking-widest text-primary">{post.author_name}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </p>
                <div className="w-full flex items-center justify-between">
                  <div className="flex gap-2">
                    <Link to={`/admin/blog/edit/${post.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="w-5 h-5" /></Link>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <Link to={`/blog/${post.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                    Preview <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogEditor;
