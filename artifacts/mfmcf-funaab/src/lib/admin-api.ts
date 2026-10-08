/**
 * Admin studio API: session handling and multipart content CRUD. Plain fetch
 * (multipart bodies must set their own boundary, so the generated JSON
 * client is not used here). Cookies flow automatically same-origin.
 */

import {
  addLocalSermon,
  updateLocalSermon,
  deleteLocalSermon,
  addLocalNews,
  updateLocalNews,
  deleteLocalNews,
  addLocalGalleryItem,
  updateLocalGalleryItem,
  deleteLocalGalleryItem,
} from "./content-store";

export interface AdminSession {
  authenticated: boolean;
  configured: boolean;
}

async function json<T>(res: Response): Promise<T> {
  const body = (await res.json().catch(() => null)) as
    | (T & { message?: string })
    | null;
  if (!res.ok) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "https://mfmcf-funaab-api.onrender.com" : "")
).replace(/\/$/, "");

const apiUrl = (path: string) => `${API_BASE}${path}`;

export const getSession = async (): Promise<AdminSession> => {
  try {
    const res = await fetch(apiUrl("/api/admin/session"), {
      headers: adminHeaders(),
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // API server unreachable; fallback to client session
  }
  const isAuth = typeof window !== "undefined" && sessionStorage.getItem("mfmcf_admin_authenticated") === "true";
  return { authenticated: isAuth, configured: true };
};

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mfmcf_admin_token");
}

export function adminHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const token = getAdminToken();
  if (token) {
    headers["x-admin-token"] = token;
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function login(password: string): Promise<void> {
  try {
    const res = await fetch(apiUrl("/api/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mfmcf_admin_authenticated", "true");
        if (data?.token) {
          localStorage.setItem("mfmcf_admin_token", data.token);
        }
      }
      return;
    }
    if (res.status === 401) {
      throw new Error("Incorrect password");
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Incorrect password") {
      throw err;
    }
  }

  // Fallback dev mode check: password is "executive"
  if (password === "executive") {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mfmcf_admin_authenticated", "true");
    }
    return;
  }
  throw new Error("Incorrect password");
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("mfmcf_admin_authenticated");
    localStorage.removeItem("mfmcf_admin_token");
  }
  await fetch(apiUrl("/api/admin/logout"), {
    method: "POST",
    headers: adminHeaders(),
    credentials: "include",
  }).catch(() => {});
}

function withForm(body: FormData): RequestInit {
  return {
    method: "POST",
    headers: adminHeaders(),
    credentials: "include",
    body,
  };
}

function withPutForm(body: FormData): RequestInit {
  return {
    method: "PUT",
    headers: adminHeaders(),
    credentials: "include",
    body,
  };
}

function withDelete(): RequestInit {
  return {
    method: "DELETE",
    headers: adminHeaders(),
    credentials: "include",
  };
}

export type SermonInput = {
  title: string;
  speaker: string;
  iso: string;
  tag: string;
  scripture: string;
  description: string;
  artwork?: File | null;
  audio?: File | null;
};

export type NewsInput = {
  title: string;
  iso: string;
  tag: string;
  body: string;
  full: string;
  artwork?: File | null;
};

export type GalleryInput = {
  title: string;
  type: string;
  desc: string;
  image?: File | null;
};

function sermonForm(input: SermonInput): FormData {
  const form = new FormData();
  form.set("title", input.title);
  form.set("speaker", input.speaker);
  form.set("iso", input.iso);
  form.set("tag", input.tag);
  form.set("scripture", input.scripture);
  form.set("description", input.description);
  if (input.artwork) form.set("artwork", input.artwork);
  if (input.audio) form.set("audio", input.audio);
  return form;
}

function newsForm(input: NewsInput): FormData {
  const form = new FormData();
  form.set("title", input.title);
  form.set("iso", input.iso);
  form.set("tag", input.tag);
  form.set("body", input.body);
  form.set("full", input.full);
  if (input.artwork) form.set("artwork", input.artwork);
  return form;
}

function galleryForm(input: GalleryInput): FormData {
  const form = new FormData();
  form.set("title", input.title);
  form.set("type", input.type);
  form.set("desc", input.desc);
  if (input.image) form.set("image", input.image);
  return form;
}

function uploadWithProgress<T>(
  url: string,
  method: "POST" | "PUT",
  body: FormData,
  onProgress?: (percent: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.withCredentials = true;

    const headers = adminHeaders();
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const percent = Math.min(
            99,
            Math.round((event.loaded / event.total) * 100),
          );
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (onProgress) onProgress(100);
      let parsed: any = null;
      try {
        parsed = JSON.parse(xhr.responseText || "{}");
      } catch {
        parsed = null;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(parsed as T);
      } else {
        const errorMsg =
          parsed?.message || `Upload failed (status ${xhr.status})`;
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network connection error during file upload"));
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload request timed out"));
    };

    xhr.send(body);
  });
}

export const createSermon = async (
  input: SermonInput,
  onProgress?: (percent: number) => void,
) => {
  try {
    return await uploadWithProgress(
      apiUrl("/api/admin/sermons"),
      "POST",
      sermonForm(input),
      onProgress,
    );
  } catch (err) {
    if (API_BASE) throw err;
  }
  return addLocalSermon(input);
};

export const updateSermon = async (
  id: number,
  input: SermonInput,
  onProgress?: (percent: number) => void,
) => {
  try {
    return await uploadWithProgress(
      apiUrl(`/api/admin/sermons/${id}`),
      "PUT",
      sermonForm(input),
      onProgress,
    );
  } catch (err) {
    if (API_BASE) throw err;
  }
  return updateLocalSermon(id, input);
};

export const deleteSermon = async (id: number) => {
  try {
    const res = await fetch(apiUrl(`/api/admin/sermons/${id}`), withDelete());
    if (res.ok) return await json(res);
  } catch (err) {
    if (API_BASE) throw err;
  }
  await deleteLocalSermon(id);
  return { deleted: true };
};

export const createNews = async (
  input: NewsInput,
  onProgress?: (percent: number) => void,
) => {
  try {
    return await uploadWithProgress(
      apiUrl("/api/admin/news"),
      "POST",
      newsForm(input),
      onProgress,
    );
  } catch (err) {
    if (API_BASE) throw err;
  }
  return addLocalNews(input);
};

export const updateNews = async (
  id: number,
  input: NewsInput,
  onProgress?: (percent: number) => void,
) => {
  try {
    return await uploadWithProgress(
      apiUrl(`/api/admin/news/${id}`),
      "PUT",
      newsForm(input),
      onProgress,
    );
  } catch (err) {
    if (API_BASE) throw err;
  }
  return updateLocalNews(id, input);
};

export const deleteNews = async (id: number) => {
  try {
    const res = await fetch(apiUrl(`/api/admin/news/${id}`), withDelete());
    if (res.ok) return await json(res);
  } catch (err) {
    if (API_BASE) throw err;
  }
  await deleteLocalNews(id);
  return { deleted: true };
};

export const createGalleryItem = async (
  input: GalleryInput,
  onProgress?: (percent: number) => void,
) => {
  try {
    return await uploadWithProgress(
      apiUrl("/api/admin/gallery"),
      "POST",
      galleryForm(input),
      onProgress,
    );
  } catch (err) {
    if (API_BASE) throw err;
  }
  return addLocalGalleryItem(input);
};

export const updateGalleryItem = async (
  id: number,
  input: GalleryInput,
  onProgress?: (percent: number) => void,
) => {
  try {
    return await uploadWithProgress(
      apiUrl(`/api/admin/gallery/${id}`),
      "PUT",
      galleryForm(input),
      onProgress,
    );
  } catch (err) {
    if (API_BASE) throw err;
  }
  return updateLocalGalleryItem(id, input);
};

export const deleteGalleryItem = async (id: number) => {
  try {
    const res = await fetch(apiUrl(`/api/admin/gallery/${id}`), withDelete());
    if (res.ok) return await json(res);
  } catch {
    // API server offline
  }
  await deleteLocalGalleryItem(id);
  return { deleted: true };
};
