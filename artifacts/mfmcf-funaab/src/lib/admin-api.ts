/**
 * Admin studio API: session handling and multipart content CRUD. Plain fetch
 * (multipart bodies must set their own boundary, so the generated JSON
 * client is not used here). Cookies flow automatically same-origin.
 */

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

export const getSession = async (): Promise<AdminSession> =>
  fetch("/api/admin/session").then((r) => r.json());

export async function login(password: string): Promise<void> {
  await json(
    await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }),
  );
}

export async function logout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
}

function withForm(body: FormData): RequestInit {
  return { method: "POST", body };
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

export const createSermon = (input: SermonInput) =>
  fetch("/api/admin/sermons", withForm(sermonForm(input))).then((r) =>
    json(r),
  );

export const updateSermon = (id: number, input: SermonInput) =>
  fetch(`/api/admin/sermons/${id}`, {
    method: "PUT",
    body: sermonForm(input),
  }).then((r) => json(r));

export const deleteSermon = (id: number) =>
  fetch(`/api/admin/sermons/${id}`, { method: "DELETE" }).then((r) => json(r));

export const createNews = (input: NewsInput) =>
  fetch("/api/admin/news", withForm(newsForm(input))).then((r) => json(r));

export const updateNews = (id: number, input: NewsInput) =>
  fetch(`/api/admin/news/${id}`, {
    method: "PUT",
    body: newsForm(input),
  }).then((r) => json(r));

export const deleteNews = (id: number) =>
  fetch(`/api/admin/news/${id}`, { method: "DELETE" }).then((r) => json(r));

export const createGalleryItem = (input: GalleryInput) =>
  fetch("/api/admin/gallery", withForm(galleryForm(input))).then((r) =>
    json(r),
  );

export const updateGalleryItem = (id: number, input: GalleryInput) =>
  fetch(`/api/admin/gallery/${id}`, {
    method: "PUT",
    body: galleryForm(input),
  }).then((r) => json(r));

export const deleteGalleryItem = (id: number) =>
  fetch(`/api/admin/gallery/${id}`, { method: "DELETE" }).then((r) =>
    json(r),
  );
