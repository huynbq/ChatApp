import { supabase } from "./supabase";

export const getPublicAttachmentUrl = (bucket: string, path: string) =>
  supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
