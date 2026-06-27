"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

// ─── Get All Internships ────────────────────────────────────
export async function getInternships(params?: {
  category?: string;
  difficulty?: string;
  duration?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  trending?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 12;

  try {
    let query = supabaseAdmin
      .from('internships')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (params?.category) query = query.eq('category_slug', params.category);
    if (params?.difficulty) query = query.eq('difficulty', params.difficulty);
    if (params?.featured) query = query.eq('is_featured', true);
    if (params?.trending) query = query.eq('is_trending', true);
    if (params?.search) query = query.ilike('title', `%${params.search}%`);
    if (params?.duration) query = query.eq('duration_days', parseInt(params.duration));

    // Sort
    switch (params?.sort) {
      case "rating":
        query = query.order('rating', { ascending: false });
        break;
      case "newest":
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('total_enrolled', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error("Error fetching internships:", error);
    return { success: false, error: "Failed to fetch internships", data: [], total: 0 };
  }
}

// ─── Get Single Internship ─────────────────────────────────
export async function getInternshipBySlug(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('internships')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .single();

    if (error) throw error;
    if (!data) return { success: false, error: "Internship not found" };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching internship:", error);
    return { success: false, error: "Failed to fetch internship" };
  }
}

// ─── Get Categories ───────────────────────────────────────
export async function getCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('internships')
      .select('category, category_slug')
      .eq('is_active', true);

    if (error) throw error;

    const categoriesMap = new Map();
    data?.forEach((item) => {
      if (!categoriesMap.has(item.category_slug)) {
        categoriesMap.set(item.category_slug, {
          name: item.category,
          slug: item.category_slug,
          count: 1,
        });
      } else {
        const cat = categoriesMap.get(item.category_slug);
        cat.count++;
      }
    });

    return { success: true, data: Array.from(categoriesMap.values()) };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// ─── Track View ───────────────────────────────────────────
export async function trackInternshipView(internshipId: string) {
  try {
    // In a real app, you might want to increment a view_count column
    return { success: true };
  } catch (error) {
    console.error("Error tracking view:", error);
    return { success: false };
  }
}
