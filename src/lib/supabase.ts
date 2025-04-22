import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or anonymous key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type FormSubmission = {
  id?: string;
  created_at?: string;
  form_data: Record<string, any>;
}

export async function saveFormSubmission(formData: Record<string, any>): Promise<{ data: FormSubmission | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([{ form_data: formData }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving form submission:', error);
    return { data: null, error: error as Error };
  }
}

export async function getFormSubmissions(): Promise<{ data: FormSubmission[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error retrieving form submissions:', error);
    return { data: null, error: error as Error };
  }
}