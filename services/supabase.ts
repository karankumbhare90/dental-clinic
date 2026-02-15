
import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const db = {
  auth: {
    signIn: (email: string, pass: string) => supabase.auth.signInWithPassword({ email, password: pass }),
    signOut: () => supabase.auth.signOut(),
    getUser: () => supabase.auth.getUser(),
  },
  services: {
    getAll: async () => supabase.from('services').select('*').order('name'),
    getById: async (id: string) => supabase.from('services').select('*').eq('id', id).single(),
    upsert: async (service: any) => supabase.from('services').upsert(service).select(),
    delete: async (id: string) => supabase.from('services').delete().eq('id', id)
  },
  appointments: {
    getAll: async () => supabase.from('appointments').select('*').order('preferred_date', { ascending: true }),
    create: async (appointment: any) => supabase.from('appointments').insert(appointment).select(),
    updateStatus: async (id: string, status: string) => supabase.from('appointments').update({ status }).eq('id', id).select()
  },
  blog: {
    getAll: async () => supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
    getPaginated: async (
      page: number = 1,
      limit: number = 6,
      category?: string
    ) => {
      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error, count } = await query.range(from, to)

      return { data, error, count }
    },

    getByCategory: async (category: string) =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false }),

    getCategoryCounts: async () =>
      supabase
        .from('blog_posts')
        .select('category, count:id', { count: 'exact' })
        .neq('category', null),

    getAllCategories: async () =>
      supabase
        .from('blog_posts')
        .select('category')
        .neq('category', null),

    getBySlug: async (slug: string) =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single(),

    upsert: async (post: any) =>
      supabase.from('blog_posts').upsert(post).select(),

    delete: async (id: string) =>
      supabase.from('blog_posts').delete().eq('id', id),
  },
  patients: {
    getAll: async () => supabase.from('patients').select('*').order('full_name'),
    getById: async (id: string) => supabase.from('patients').select('*').eq('id', id).single(),
    upsert: async (patient: any) => supabase.from('patients').upsert(patient).select(),
    delete: async (id: string) => supabase.from('patients').delete().eq('id', id)
  }
};
