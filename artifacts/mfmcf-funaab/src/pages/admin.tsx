import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Check, Loader2, Lock, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { Eyebrow } from "@/components/foundation";
import {
  createGalleryItem,
  createNews,
  createSermon,
  deleteGalleryItem,
  deleteNews,
  deleteSermon,
  getSession,
  login,
  logout,
  updateGalleryItem,
  updateNews,
  updateSermon,
} from "@/lib/admin-api";
import { useGallery, useNews, useSermons } from "@/lib/queries";
import { withBase } from "@/lib/site";

/**
 * Admin studio: password-gated content management for sermons, news, and
 * the gallery. Deliberately not linked from the public site.
 */

const inputClass =
  "mt-2 block w-full border border-[hsl(var(--foreground)/.16)] bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-[hsl(var(--primary))]";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}

function AdminButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    primary:
      "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--foreground))]",
    ghost:
      "border border-[hsl(var(--foreground)/.2)] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]",
    danger:
      "border border-red-300 text-red-700 hover:bg-red-700 hover:text-white",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-semibold text-red-600">
      {message}
    </p>
  );
}

function FileHint({ file, hint }: { file: File | null; hint: string }) {
  return (
    <p className="mono-label mt-2 text-[9px] normal-case tracking-normal text-[hsl(var(--muted-foreground))]">
      {file ? file.name : hint}
    </p>
  );
}

function Admin() {
  const [tab, setTab] = useState<"sermons" | "news" | "gallery">("sermons");
  const session = useQuery({
    queryKey: ["admin-session"],
    queryFn: getSession,
    retry: 0,
  });

  if (session.isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  if (!session.data?.authenticated) {
    return <Login configured={session.data?.configured !== false} />;
  }

  return (
    <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
      <header className="border-b border-[hsl(var(--foreground)/.1)] bg-[hsl(var(--foreground))] px-5 py-4 text-white lg:px-10">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <div>
            <p className="mono-label text-[9px] text-[hsl(var(--accent))]">
              MFMCF FUNAAB
            </p>
            <p className="display-font text-2xl leading-none">Admin studio</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/70 transition hover:text-white"
            >
              View site <ArrowUpRight className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                session.refetch();
              }}
              className="border border-white/25 px-3 py-2 transition hover:border-white hover:text-white text-white/70"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-5 py-10 lg:px-10">
        <div className="flex gap-2 border-b border-[hsl(var(--foreground)/.12)] pb-4">
          {(["sermons", "news", "gallery"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-xs font-bold capitalize transition ${
                tab === key
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "border border-[hsl(var(--foreground)/.15)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="mt-10">
          {tab === "sermons" && <SermonsAdmin />}
          {tab === "news" && <NewsAdmin />}
          {tab === "gallery" && <GalleryAdmin />}
        </div>
      </main>
    </div>
  );
}

function Login({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const client = useQueryClient();
  const signIn = useMutation({
    mutationFn: () => login(password),
    onSuccess: () => {
      setError(null);
      client.invalidateQueries({ queryKey: ["admin-session"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password) signIn.mutate();
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] p-8"
      >
        <span className="flex size-11 items-center justify-center bg-[hsl(var(--primary))] text-white">
          <Lock className="size-5" />
        </span>
        <h1 className="display-font mt-6 text-3xl leading-none">
          Admin studio
        </h1>
        <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          {configured
            ? "Sign in with the admin password to manage sermons, news, and the gallery."
            : "Admin access is not configured yet. Set ADMIN_PASSWORD on the server, then sign in."}
        </p>
        <Field label="Admin password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </Field>
        <div className="mt-5">
          <FormError message={error} />
        </div>
        <div className="mt-6">
          <AdminButton type="submit" disabled={signIn.isPending || !configured}>
            {signIn.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            Sign in
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

function SermonsAdmin() {
  const { sermons, raw, isLoading } = useSermons();
  const client = useQueryClient();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    speaker: "",
    iso: "",
    tag: "Teaching",
    scripture: "",
    description: "",
  });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => client.invalidateQueries({ queryKey: ["sermons"] });
  const save = useMutation({
    mutationFn: async () => {
      const input = {
        ...form,
        description: form.description,
        artwork,
        audio,
      };
      if (editing !== null && editing >= 0) {
        return updateSermon(editing, input);
      }
      return createSermon(input);
    },
    onSuccess: async () => {
      setError(null);
      setEditing(null);
      setForm({ title: "", speaker: "", iso: "", tag: "Teaching", scripture: "", description: "" });
      setArtwork(null);
      setAudio(null);
      await invalidate();
    },
    onError: (err: Error) => setError(err.message),
  });
  const remove = useMutation({
    mutationFn: (id: number) => deleteSermon(id),
    onSuccess: invalidate,
  });

  const startEdit = (id: number) => {
    const sermon = sermons.find((s) => s.id === id);
    const rawSermon = raw?.find((s) => s.id === id);
    if (!sermon || !rawSermon) return;
    setEditing(id);
    setForm({
      title: sermon.title,
      speaker: sermon.speaker,
      iso: sermon.iso,
      tag: sermon.tag,
      scripture: sermon.scripture,
      description: rawSermon.summary.join("\n\n"),
    });
    setArtwork(null);
    setAudio(null);
    window.scrollTo({ top: 0 });
  };

  if (isLoading) {
    return <p className="mono-label text-[10px]">Loading sermons…</p>;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="border border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] p-6 sm:p-8"
      >
        <Eyebrow>{editing !== null && editing >= 0 ? "Edit sermon" : "Add a sermon"}</Eyebrow>
        <div className="mt-6 space-y-5">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Minister">
              <input
                className={inputClass}
                value={form.speaker}
                onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                required
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                className={inputClass}
                value={form.iso}
                onChange={(e) => setForm({ ...form, iso: e.target.value })}
                required
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Bible reference">
              <input
                className={inputClass}
                value={form.scripture}
                onChange={(e) => setForm({ ...form, scripture: e.target.value })}
                placeholder="Psalm 5:12"
                required
              />
            </Field>
            <Field label="Theme">
              <input
                className={inputClass}
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Grace, Faith, Prayer…"
              />
            </Field>
          </div>
          <Field label="Description (blank line between paragraphs)">
            <textarea
              className={`${inputClass} min-h-36 resize-y`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </Field>
          <Field label="Artwork image">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={`${inputClass} file:mr-3 file:border-0 file:bg-[hsl(var(--secondary))] file:px-3 file:py-1.5 file:text-xs file:font-bold`}
              onChange={(e) => setArtwork(e.target.files?.[0] ?? null)}
            />
            <FileHint file={artwork} hint="jpg, png, webp or gif — square works best" />
          </Field>
          <Field label="Audio file">
            <input
              type="file"
              accept="audio/*,.mp3,.m4a"
              className={`${inputClass} file:mr-3 file:border-0 file:bg-[hsl(var(--secondary))] file:px-3 file:py-1.5 file:text-xs file:font-bold`}
              onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
            />
            <FileHint file={audio} hint="mp3, m4a, aac, ogg or wav — up to 60MB" />
          </Field>
          <FormError message={error} />
          <div className="flex items-center gap-3">
            <AdminButton type="submit" disabled={save.isPending}>
              {save.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {editing !== null && editing >= 0 ? "Save changes" : "Publish sermon"}
            </AdminButton>
            {editing !== null && editing >= 0 && (
              <AdminButton
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setForm({ title: "", speaker: "", iso: "", tag: "Teaching", scripture: "", description: "" });
                  setArtwork(null);
                  setAudio(null);
                }}
              >
                <X className="size-4" /> Cancel
              </AdminButton>
            )}
          </div>
        </div>
      </form>
      <div>
        <Eyebrow>Published sermons</Eyebrow>
        <div className="mt-5">
          {sermons.map((sermon) => (
            <div
              key={sermon.slug}
              className="flex items-center gap-4 border-t border-[hsl(var(--foreground)/.12)] py-4"
            >
              <div className="size-14 shrink-0 overflow-hidden bg-[hsl(var(--secondary))]">
                <img
                  src={sermon.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{sermon.title}</p>
                <p className="mono-label mt-1 text-[9px] normal-case tracking-normal text-[hsl(var(--muted-foreground))]">
                  {sermon.date} · {sermon.audio ? "audio live" : "no audio yet"}
                </p>
              </div>
              <AdminButton variant="ghost" onClick={() => startEdit(sermon.id)}>
                Edit
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={() => remove.mutate(sermon.id)}
                disabled={remove.isPending}
              >
                <Trash2 className="size-3.5" />
              </AdminButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsAdmin() {
  const { news, raw, isLoading } = useNews();
  const client = useQueryClient();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    iso: "",
    tag: "Family",
    body: "",
    full: "",
  });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => client.invalidateQueries({ queryKey: ["news"] });
  const save = useMutation({
    mutationFn: () => {
      const input = { ...form, artwork };
      if (editing !== null && editing >= 0) return updateNews(editing, input);
      return createNews(input);
    },
    onSuccess: async () => {
      setError(null);
      setEditing(null);
      setForm({ title: "", iso: "", tag: "Family", body: "", full: "" });
      setArtwork(null);
      await invalidate();
    },
    onError: (err: Error) => setError(err.message),
  });
  const remove = useMutation({
    mutationFn: (id: number) => deleteNews(id),
    onSuccess: invalidate,
  });

  const startEdit = (id: number) => {
    const post = news.find((n) => n.id === id);
    if (!post) return;
    setEditing(id);
    setForm({
      title: post.title,
      iso: post.iso,
      tag: post.tag,
      body: post.body,
      full: post.full,
    });
    setArtwork(null);
    window.scrollTo({ top: 0 });
  };

  if (isLoading) {
    return <p className="mono-label text-[10px]">Loading news…</p>;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="border border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] p-6 sm:p-8"
      >
        <Eyebrow>{editing !== null && editing >= 0 ? "Edit note" : "Write a note"}</Eyebrow>
        <div className="mt-6 space-y-5">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date">
              <input
                type="date"
                className={inputClass}
                value={form.iso}
                onChange={(e) => setForm({ ...form, iso: e.target.value })}
                required
              />
            </Field>
            <Field label="Tag">
              <input
                className={inputClass}
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Welcome, Community…"
              />
            </Field>
          </div>
          <Field label="Lead (shown before expanding)">
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </Field>
          <Field label="Content (the full note)">
            <textarea
              className={`${inputClass} min-h-36 resize-y`}
              value={form.full}
              onChange={(e) => setForm({ ...form, full: e.target.value })}
              required
            />
          </Field>
          <Field label="Artwork image (optional)">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={`${inputClass} file:mr-3 file:border-0 file:bg-[hsl(var(--secondary))] file:px-3 file:py-1.5 file:text-xs file:font-bold`}
              onChange={(e) => setArtwork(e.target.files?.[0] ?? null)}
            />
            <FileHint file={artwork} hint="jpg, png, webp or gif" />
          </Field>
          <FormError message={error} />
          <div className="flex items-center gap-3">
            <AdminButton type="submit" disabled={save.isPending}>
              {save.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {editing !== null && editing >= 0 ? "Save changes" : "Publish note"}
            </AdminButton>
            {editing !== null && editing >= 0 && (
              <AdminButton
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setForm({ title: "", iso: "", tag: "Family", body: "", full: "" });
                  setArtwork(null);
                }}
              >
                <X className="size-4" /> Cancel
              </AdminButton>
            )}
          </div>
        </div>
      </form>
      <div>
        <Eyebrow>Published notes</Eyebrow>
        <div className="mt-5">
          {news.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 border-t border-[hsl(var(--foreground)/.12)] py-4"
            >
              {post.artwork && (
                <div className="size-14 shrink-0 overflow-hidden bg-[hsl(var(--secondary))]">
                  <img src={post.artwork} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{post.title}</p>
                <p className="mono-label mt-1 text-[9px] normal-case tracking-normal text-[hsl(var(--muted-foreground))]">
                  {post.date} · {post.tag}
                </p>
              </div>
              <AdminButton variant="ghost" onClick={() => startEdit(post.id)}>
                Edit
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={() => remove.mutate(post.id)}
                disabled={remove.isPending}
              >
                <Trash2 className="size-3.5" />
              </AdminButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryAdmin() {
  const { gallery, isLoading } = useGallery();
  const client = useQueryClient();
  const [form, setForm] = useState({ title: "", type: "Community", desc: "" });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () =>
    client.invalidateQueries({ queryKey: ["gallery"] });
  const save = useMutation({
    mutationFn: () => createGalleryItem({ ...form, image }),
    onSuccess: async () => {
      setError(null);
      setForm({ title: "", type: "Community", desc: "" });
      setImage(null);
      await invalidate();
    },
    onError: (err: Error) => setError(err.message),
  });
  const remove = useMutation({
    mutationFn: (id: number) => deleteGalleryItem(id),
    onSuccess: invalidate,
  });

  if (isLoading) {
    return <p className="mono-label text-[10px]">Loading gallery…</p>;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="border border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] p-6 sm:p-8"
      >
        <Eyebrow>Add to the gallery</Eyebrow>
        <div className="mt-6 space-y-5">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Field>
          <Field label="Category">
            <select
              className={inputClass}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Worship</option>
              <option>Community</option>
              <option>Teaching</option>
            </select>
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              required
            />
          </Field>
          <Field label="Image">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={`${inputClass} file:mr-3 file:border-0 file:bg-[hsl(var(--secondary))] file:px-3 file:py-1.5 file:text-xs file:font-bold`}
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              required
            />
            <FileHint file={image} hint="jpg, png, webp or gif — landscape works best" />
          </Field>
          <FormError message={error} />
          <AdminButton type="submit" disabled={save.isPending}>
            {save.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            Add photo story
          </AdminButton>
        </div>
      </form>
      <div>
        <Eyebrow>Gallery</Eyebrow>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative border border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--card))] p-2"
            >
              <div className="aspect-[1.18] overflow-hidden bg-[hsl(var(--secondary))]">
                <img
                  src={item.image.startsWith("/") ? withBase(item.image) : item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 truncate px-1 text-xs font-bold">{item.title}</p>
              <p className="mono-label px-1 pb-1 text-[9px] normal-case tracking-normal text-[hsl(var(--muted-foreground))]">
                {item.type}
              </p>
              <button
                type="button"
                aria-label={`Delete ${item.title}`}
                onClick={() => remove.mutate(item.id)}
                disabled={remove.isPending}
                className="absolute right-3 top-3 flex size-8 items-center justify-center border border-red-300 bg-[hsl(var(--background)/.9)] text-red-700 opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
