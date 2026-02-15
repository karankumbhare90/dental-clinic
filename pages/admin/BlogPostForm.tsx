
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { db } from '../../services/supabase';
import { ChevronLeft, Save, ImageIcon, Type, Layout, Globe, Search, Sparkles } from 'lucide-react';
import { getOptimizedImage } from '../../utils/image';

const QUICK_PICK_IMAGES = [
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1460676746866-c5b8df709d03?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&q=80&w=800'
];

const BlogPostForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Hygiene',
    author_name: 'Dr. Sarah Smith',
    featured_image_url: '',
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    if (id) {
      db.blog.getAll().then(({ data }) => {
        const post = data?.find(p => p.id === id);
        if (post) setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || 'Hygiene',
          author_name: post.author_name || 'Dr. Sarah Smith',
          featured_image_url: post.featured_image_url || '',
          seo_title: post.seo_title || '',
          seo_description: post.seo_description || ''
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const finalSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await db.blog.upsert(id ? { id, ...formData, slug: finalSlug } : { ...formData, slug: finalSlug });
    navigate('/admin/blog');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/blog" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold">{id ? 'Edit Health Article' : 'Write New Article'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/blog" className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
            Discard
          </Link>
          <button 
            onClick={() => {
              const form = document.getElementById('blog-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={loading} 
            className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Publish Now'}
          </button>
        </div>
      </div>

      <form id="blog-form" onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Article Title</label>
              <input 
                required 
                className="w-full text-2xl font-bold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="How to maintain pearly whites..." 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Brief Excerpt</label>
              <textarea 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all h-24 outline-none resize-none" 
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                placeholder="A short summary for the listing page..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Main Content</label>
              <textarea 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all min-h-[500px] outline-none" 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder="Start sharing your dental expertise..."
              ></textarea>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> SEO Optimization
              </h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">SEO Title</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary transition-all outline-none" 
                  value={formData.seo_title} 
                  onChange={e => setFormData({...formData, seo_title: e.target.value})} 
                  placeholder="Meta title..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">SEO Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary transition-all h-24 outline-none resize-none" 
                  value={formData.seo_description} 
                  onChange={e => setFormData({...formData, seo_description: e.target.value})} 
                  placeholder="Meta description..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-4 h-4" /> Publication
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Hygiene</option>
                <option>Cosmetic</option>
                <option>Nutrition</option>
                <option>Orthodontics</option>
                <option>Surgery</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Featured Image
              </label>
              <div className="relative">
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary text-sm outline-none" 
                  value={formData.featured_image_url} 
                  onChange={e => setFormData({...formData, featured_image_url: e.target.value})} 
                  placeholder="Paste URL or pick below..." 
                />
                <ImageIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-primary" /> Quick Pick Gallery
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_PICK_IMAGES.map((img, i) => (
                    <button 
                      key={i} 
                      type="button"
                      onClick={() => setFormData({...formData, featured_image_url: img})}
                      className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${formData.featured_image_url === img ? 'border-primary' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img src={getOptimizedImage(img, 150, 150)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {formData.featured_image_url && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                  <img src={getOptimizedImage(formData.featured_image_url, 600, 400)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Admin Tip
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All images selected or pasted here are automatically optimized to <strong>AVIF format</strong> for faster loading and better SEO performance.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
