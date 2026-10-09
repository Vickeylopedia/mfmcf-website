import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Check, Loader2, Lock, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { Eyebrow } from "@/components/foundation";
import { useDocumentTitle } from "@/hooks/use-document-title";
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
import { withBase, resolveMediaUrl } from "@/lib/site";
import { toggleAnnouncementId, getAnnouncementIds } from "@/lib/content-store";

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

function UploadProgress({
  progress,
  label = "Uploading media files…",
}: {
  progress: number;
  label?: string;
}) {
  return (
    <div className="space-y-2 border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] p-3.5 shadow-[2px_2px_0px_hsl(var(--foreground))]">
      <div className="flex items-center justify-between font-mono text-xs font-bold">
        <span>{progress < 100 ? label : "Processing and finalizing…"}</span>
        <span className="font-black text-[hsl(var(--primary))]">{progress}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden border border-[hsl(var(--foreground))] bg-white">
        <div
          className="h-full bg-[hsl(var(--primary))] transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
        {progress < 100
          ? "Please keep this browser window open until upload completes."
          : "Almost done, saving to database…"}
      </p>
    </div>
  );
}

function ThumbnailImage({
  src,
  alt = "",
  className = "h-full w-full object-cover",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const resolved = resolveMediaUrl(src);

  if (!resolved || error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] font-mono text-[9px] uppercase tracking-wider">
        No art
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      loading="lazy"
    />
  );
}

function Admin() {
  useDocumentTitle("Admin Studio");

  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const existingRobots = meta?.content;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    return () => {
      if (meta) {
        if (existingRobots) meta.content = existingRobots;
        else meta.remove();
      }
    };
  }, []);

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
    <div className="min-h-[100dvh] bg-[hsl(var(--background))] overflow-x-hidden">
      <header className="border-b border-[hsl(var(--foreground)/.1)] bg-[hsl(var(--foreground))] px-4 py-3.5 text-white sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mono-label text-[9px] text-[hsl(var(--accent))]">
              MFMCF FUNAAB
            </p>
            <p className="display-font text-xl sm:text-2xl leading-none">Admin studio</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
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
              className="border border-white/25 px-2.5 py-1.5 sm:px-3 sm:py-2 transition hover:border-white hover:text-white text-white/70"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-3.5 py-6 sm:px-6 sm:py-10 lg:px-10">
        <div className="flex flex-wrap gap-2 border-b border-[hsl(var(--foreground)/.12)] pb-4">
          {(["sermons", "news", "gallery"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3.5 py-2 sm:px-4 sm:py-2 text-xs font-bold capitalize transition ${tab === key
                  ? "bg-[hsl(var(--primary))] text-white shadow-sm"
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
        <div className="mt-5 text-center">
          <Link
            href="/"
            data-testid="link-admin-back-to-site"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))]"
          >
            <ArrowLeft className="size-3.5" />
            Back to website
          </Link>
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
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
      if (artwork || audio) {
        setUploadProgress(0);
      }
      if (editing !== null && editing >= 0) {
        return updateSermon(editing, input, (p) => setUploadProgress(p));
      }
      return createSermon(input, (p) => setUploadProgress(p));
    },
    onSuccess: async () => {
      setUploadProgress(null);
      setError(null);
      setEditing(null);
      setForm({ title: "", speaker: "", iso: "", tag: "Teaching", scripture: "", description: "" });
      setArtwork(null);
      setAudio(null);
      await invalidate();
    },
    onError: (err: Error) => {
      setUploadProgress(null);
      setError(err.message);
    },
  });
  const remove = useMutation({
    mutationFn: (id: number) => deleteSermon(id),
    onSuccess: invalidate,
  });

  const startEdit = (id: number) => {
    const sermon = sermons.find((s) => s.id === id);
    if (!sermon) return;
    const rawSermon = raw?.find((s) => s.id === id);
    const summaryText = rawSermon
      ? rawSermon.summary.join("\n\n")
      : sermon.summary.join("\n\n");
    setEditing(id);
    setForm({
      title: sermon.title,
      speaker: sermon.speaker,
      iso: sermon.iso,
      tag: sermon.tag,
      scripture: sermon.scripture,
      description: summaryText,
    });
    setArtwork(null);
    setAudio(null);
    window.scrollTo({ top: 0 });
  };

  if (isLoading) {
    return <p className="mono-label text-[10px]">Loading sermons…</p>;
  }

  return (
    <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="border border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] p-4 sm:p-6 lg:p-8"
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
            <FileHint file={artwork} hint="jpg, png, webp or gif (square works best)" />
          </Field>
          <Field label="Audio file">
            <input
              type="file"
              accept="audio/*,.mp3,.m4a"
              className={`${inputClass} file:mr-3 file:border-0 file:bg-[hsl(var(--secondary))] file:px-3 file:py-1.5 file:text-xs file:font-bold`}
              onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
            />
            <FileHint file={audio} hint="mp3, m4a, aac, ogg or wav (up to 60MB)" />
          </Field>
          <FormError message={error} />
          {uploadProgress !== null && (
            <UploadProgress
              progress={uploadProgress}
              label={audio ? "Uploading sermon audio & artwork…" : "Uploading sermon…"}
            />
          )}
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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[hsl(var(--foreground)/.12)] py-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="size-12 sm:size-14 shrink-0 overflow-hidden border border-[hsl(var(--foreground)/.2)] bg-[hsl(var(--secondary))]">
                  <ThumbnailImage
                    src={sermon.image}
                    alt={sermon.title}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{sermon.title}</p>
                  <p className="mono-label mt-0.5 text-[9px] normal-case tracking-normal text-[hsl(var(--muted-foreground))]">
                    {sermon.date} · {sermon.audio ? "audio live" : "no audio yet"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-2 shrink-0">
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
    isAnnouncement: false,
  });
  const [artwork, setArtwork] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [announcementIds, setAnnouncementIds] = useState<number[]>(() =>
    typeof window !== "undefined" ? getAnnouncementIds() : [-1, -2]
  );

  useEffect(() => {
    const handleUpdate = () => setAnnouncementIds(getAnnouncementIds());
    window.addEventListener("mfmcf-announcements-changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("mfmcf-announcements-changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const invalidate = () => client.invalidateQueries({ queryKey: ["news"] });
  const save = useMutation({
    mutationFn: () => {
      const input = { ...form, artwork };
      if (artwork) setUploadProgress(0);
      if (editing !== null && editing >= 0) {
        return updateNews(editing, input, (p) => setUploadProgress(p));
      }
      return createNews(input, (p) => setUploadProgress(p));
    },
    onSuccess: async (result?: any) => {
      setUploadProgress(null);
      setError(null);
      const targetId = editing ?? result?.id;
      if (targetId !== undefined && targetId !== null) {
        const current = getAnnouncementIds();
        if (form.isAnnouncement && !current.includes(targetId)) {
          toggleAnnouncementId(targetId);
        } else if (!form.isAnnouncement && current.includes(targetId)) {
          toggleAnnouncementId(targetId);
        }
      }
      setAnnouncementIds(getAnnouncementIds());
      setEditing(null);
      setForm({ title: "", iso: "", tag: "Family", body: "", full: "", isAnnouncement: false });
      setArtwork(null);
      await invalidate();
    },
    onError: (err: Error) => {
      setUploadProgress(null);
      setError(err.message);
    },
  });
  const remove = useMutation({
    mutationFn: (id: number) => deleteNews(id),
    onSuccess: invalidate,
  });

  const startEdit = (id: number) => {
    const post = news.find((n) => n.id === id);
    if (!post) return;
    setEditing(id);
    const isAnnounce = announcementIds.includes(id) || Boolean(post.isAnnouncement);
    setForm({
      title: post.title,
      iso: post.iso,
      tag: post.tag,
      body: post.body,
      full: post.full,
      isAnnouncement: isAnnounce,
    });
    setArtwork(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <p className="mono-label text-[10px]">Loading news…</p>;
  }

  return (
    <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="border border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] p-4 sm:p-6 lg:p-8"
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
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
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

          {/* Option to add it as announcement on the home screen */}
          <label className="flex items-start gap-3 border border-[hsl(var(--foreground)/.16)] bg-[hsl(var(--background))] p-3.5 cursor-pointer hover:border-[hsl(var(--primary))] transition">
            <input
              type="checkbox"
              checked={form.isAnnouncement}
              onChange={(e) => setForm({ ...form, isAnnouncement: e.target.checked })}
              className="mt-0.5 size-4 accent-[hsl(var(--primary))] cursor-pointer"
            />
            <div>
              <span className="block text-xs font-bold text-[hsl(var(--foreground))]">
                Show as Announcement on Home Screen
              </span>
              <span className="block font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                Adds this note to the Campus Happenings section carousel on the home screen
              </span>
            </div>
          </label>

          <FormError message={error} />
          {uploadProgress !== null && (
            <UploadProgress
              progress={uploadProgress}
              label="Uploading announcement note…"
            />
          )}
          <div className="flex flex-wrap items-center gap-3">
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
                  setForm({ title: "", iso: "", tag: "Family", body: "", full: "", isAnnouncement: false });
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
          {news.map((post) => {
            const isAnnounce = announcementIds.includes(post.id) || Boolean(post.isAnnouncement);
            return (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[hsl(var(--foreground)/.12)] py-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {post.artwork && (
                    <div className="size-12 sm:size-14 shrink-0 overflow-hidden border border-[hsl(var(--foreground)/.2)] bg-[hsl(var(--secondary))]">
                      <ThumbnailImage src={post.artwork} alt={post.title} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{post.title}</p>
                    <p className="mono-label mt-0.5 text-[9px] normal-case tracking-normal text-[hsl(var(--muted-foreground))]">
                      {post.date} · {post.tag}
                    </p>
                  </div>
                </div>

                {/* One-click toggle button to add/remove announcement on home screen */}
                <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-2 shrink-0">
                  <button
                    type="button"
                    onClick={async () => {
                      toggleAnnouncementId(post.id);
                      setAnnouncementIds(getAnnouncementIds());
                      await invalidate();
                    }}
                    title={isAnnounce ? "Remove from home screen announcements" : "Show on home screen announcements"}
                    className={`shrink-0 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                      isAnnounce
                        ? "border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))]"
                        : "border border-dashed border-[hsl(var(--foreground)/.35)] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
                    }`}
                  >
                    {isAnnounce ? "★ Announcement" : "+ Add to Home"}
                  </button>

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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GalleryAdmin() {
  const { gallery, isLoading } = useGallery();
  const client = useQueryClient();

  // Custom categories saved in localStorage and merged from existing items
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("mfmcf_gallery_custom_categories");
      if (stored) return JSON.parse(stored);
    } catch { }
    return ["Fellowship", "Gatherings", "Outreach", "Bible Study"];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("Fellowship");
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync any categories in existing gallery into the categories menu
  useEffect(() => {
    if (gallery.length > 0) {
      const fromItems = Array.from(new Set(gallery.map((g) => g.type).filter(Boolean)));
      setCategories((prev) => {
        const merged = Array.from(new Set([...prev, ...fromItems]));
        try {
          localStorage.setItem("mfmcf_gallery_custom_categories", JSON.stringify(merged));
        } catch { }
        return merged;
      });
    }
  }, [gallery]);

  const invalidate = () =>
    client.invalidateQueries({ queryKey: ["gallery"] });

  const save = useMutation({
    mutationFn: async () => {
      const categoryToUse = (
        isNewCategory ? newCategoryName.trim() : selectedCategory.trim()
      ) || "Moments";

      if (!categoryToUse) {
        throw new Error("Please specify a category for the images.");
      }
      if (selectedFiles.length === 0) {
        throw new Error("Please select at least one image to upload.");
      }

      // Save new custom category to state & localStorage for future reuse
      setCategories((prev) => {
        const updated = Array.from(new Set([...prev, categoryToUse]));
        try {
          localStorage.setItem("mfmcf_gallery_custom_categories", JSON.stringify(updated));
        } catch { }
        return updated;
      });

      setUploadProgress(0);

      // Upload all selected images in sequence with cumulative progress
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await createGalleryItem(
          {
            title: categoryToUse,
            type: categoryToUse,
            desc: "",
            image: file,
          },
          (percent) => {
            const overall = Math.round(
              ((i + percent / 100) / selectedFiles.length) * 100,
            );
            setUploadProgress(overall);
          },
        );
      }
      setUploadProgress(100);
    },
    onSuccess: async () => {
      setUploadProgress(null);
      setError(null);
      setSelectedFiles([]);
      setIsNewCategory(false);
      setNewCategoryName("");
      await invalidate();
    },
    onError: (err: Error) => {
      setUploadProgress(null);
      setError(err.message);
    },
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
        className="border border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] p-4 sm:p-6 lg:p-8"
      >
        <Eyebrow>Upload gallery photos</Eyebrow>
        <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
          Select multiple photos at once. They will all be filed under the chosen category.
        </p>

        <div className="mt-6 space-y-5">
          {/* Custom Category Selection */}
          <Field label="Category">
            <div className="space-y-3">
              <select
                className={inputClass}
                value={isNewCategory ? "__new__" : selectedCategory}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setIsNewCategory(true);
                  } else {
                    setIsNewCategory(false);
                    setSelectedCategory(e.target.value);
                  }
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__new__">+ Create new custom category…</option>
              </select>

              {isNewCategory && (
                <div className="rounded border border-[hsl(var(--primary)/.4)] bg-[hsl(var(--secondary)/.4)] p-3">
                  <label className="block text-xs font-bold text-[hsl(var(--primary))] mb-1">
                    Enter new custom category name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresher’s Welcome, Music Ministry…"
                    className={inputClass}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <p className="mono-label mt-1.5 text-[9px] text-[hsl(var(--muted-foreground))]">
                    This category will automatically become part of your category menu.
                  </p>
                </div>
              )}
            </div>
          </Field>

          {/* Multiple Image Selector */}
          <Field label="Photos (select multiple images at once)">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={`${inputClass} file:mr-3 file:border-0 file:bg-[hsl(var(--secondary))] file:px-3 file:py-1.5 file:text-xs file:font-bold`}
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedFiles(Array.from(e.target.files));
                }
              }}
              required
            />
            {selectedFiles.length > 0 ? (
              <p className="mt-2 font-mono text-xs font-bold text-[hsl(var(--primary))]">
                ✓ {selectedFiles.length} photo{selectedFiles.length > 1 ? "s" : ""} selected for upload
              </p>
            ) : (
              <FileHint file={null} hint="Select multiple photos (jpg, png, webp, gif)" />
            )}
          </Field>

          <FormError message={error} />

          {uploadProgress !== null && (
            <UploadProgress
              progress={uploadProgress}
              label={`Uploading ${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""}…`}
            />
          )}

          <AdminButton type="submit" disabled={save.isPending || selectedFiles.length === 0}>
            {save.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            {selectedFiles.length > 0
              ? `Upload ${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""}`
              : "Upload photos"}
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
                <ThumbnailImage
                  src={item.image}
                  alt={item.title}
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
                className="absolute right-2 top-2 flex size-7 sm:size-8 items-center justify-center border border-red-300 bg-[hsl(var(--background)/.95)] text-red-700 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition disabled:opacity-50"
              >
                <Trash2 className="size-3.5 sm:size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
