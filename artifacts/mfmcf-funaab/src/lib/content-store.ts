import { photos, withBase } from "./site";
import { sermons as staticSermons } from "./sermons";
import type { SermonInput, NewsInput, GalleryInput } from "./admin-api";

export type SermonView = {
  id: number;
  slug: string;
  title: string;
  speaker: string;
  date: string;
  iso: string;
  tag: string;
  scripture: string;
  summary: string[];
  image: string;
  audio: string | null;
};

export type NewsView = {
  id: number;
  title: string;
  date: string;
  iso: string;
  tag: string;
  body: string;
  full: string;
  artwork: string | null;
  isAnnouncement?: boolean;
};

export type GalleryView = {
  id: number;
  title: string;
  type: string;
  desc: string;
  image: string;
};

export const fallbackSermons: SermonView[] = staticSermons.map((sermon, i) => ({
  ...sermon,
  id: -(i + 1),
  audio: null,
  isAnnouncement: false,
}));

export const fallbackNews: NewsView[] = [
  {
    id: -1,
    title: "The room is ready for you",
    date: "22 MAY 2026",
    iso: "2026-05-22",
    tag: "Welcome",
    body: "Whether it is your first Sunday or your fiftieth, there is an open seat and a familiar face waiting at the Fellowship Auditorium.",
    full: "Doors open from 7:00 AM, and the welcome team will be outside to walk you in if it is your first time. Come as you are, whether jeans, hostel wear, or Sunday best, nobody is keeping score. After the service, stay back for a few minutes so we can meet you properly. That is the whole point of family.",
    artwork: null,
    isAnnouncement: true,
  },
  {
    id: -2,
    title: "Exam season, softer landing",
    date: "16 MAY 2026",
    iso: "2026-05-16",
    tag: "Community",
    body: "We are keeping the family rooms open through exams. Come study, pray, breathe, or simply sit with people who understand.",
    full: "From Monday to Friday, 10 AM to 4 PM, one of the family rooms stays open as a quiet study space with power outlets, quiet playlists, and someone to pray with when a paper goes badly. There is also a short prayer walk every evening at 6 PM for anyone who wants to end the study day with peace instead of panic.",
    artwork: null,
    isAnnouncement: true,
  },
  {
    id: -3,
    title: "A new rhythm for midweek",
    date: "03 MAY 2026",
    iso: "2026-05-03",
    tag: "Gatherings",
    body: "Midweek Recharge now meets every Wednesday at 5:00 PM. Short teaching, open prayer, honest conversation.",
    full: "We heard the family clearly: Sundays carry the celebration, but the middle of the week needs somewhere to land. So Midweek Recharge is now weekly with thirty minutes of teaching that connects to real campus life, then open prayer and honest conversation until nobody needs to talk anymore. Bring your questions, bring your friend who has questions.",
    artwork: null,
    isAnnouncement: false,
  },
];

export const fallbackGallery: GalleryView[] = [
  {
    id: -10,
    title: "Overflow of Joy",
    type: "Worship",
    desc: "Spirited praise, laughter, and an electric atmosphere in the presence of God.",
    image: photos.sundayPraise,
  },
  {
    id: -11,
    title: "Fervent Hearts Alight",
    type: "Worship",
    desc: "Students yielding their hearts in travailing prayer that breaks limits.",
    image: photos.prayerFervent,
  },
  {
    id: -12,
    title: "United in One Accord",
    type: "Community",
    desc: "Hand in hand across faculties, standing as one indivisible campus family.",
    image: photos.familyUnity,
  },
  {
    id: -13,
    title: "Smiles That Heal",
    type: "Community",
    desc: "Where loneliness has no place and genuine sisterhood and brotherhood thrive.",
    image: photos.fellowshipJoy,
  },
  {
    id: -14,
    title: "Truth Unleashed",
    type: "Teaching",
    desc: "Sound doctrine and apostolic wisdom equipping kingdom ambassadors.",
    image: photos.preachingWord,
  },
  {
    id: -1,
    title: "A Sunday with the family",
    type: "Worship",
    desc: "The room settles, the voices rise, and somebody always saves you a seat.",
    image: photos.gathering,
  },
  {
    id: -2,
    title: "Joy looks good on us",
    type: "Community",
    desc: "Three friends, one bright afternoon, and absolutely no shortage of laughter.",
    image: photos.joy,
  },
  {
    id: -3,
    title: "Held in prayer",
    type: "Worship",
    desc: "The quiet moments count, too.",
    image: photos.prayer,
  },
  {
    id: -4,
    title: "The Word in the room",
    type: "Teaching",
    desc: "Listening closely. Leaving changed.",
    image: photos.word,
  },
  {
    id: -5,
    title: "Room for every story",
    type: "Community",
    desc: "Different backgrounds, one table.",
    image: photos.worship,
  },
  {
    id: -6,
    title: "The whole family, gathered",
    type: "Community",
    desc: "Full rooms, full hearts, the family in one frame.",
    image: photos.community,
  },
  {
    id: -7,
    title: "Every voice welcome",
    type: "Worship",
    desc: "Loud or quiet, off-key or on, it all counts as praise here.",
    image: photos.fellowshipWorship,
  },
];

const STORAGE_SERMONS = "mfmcf_store_sermons_v1";
const STORAGE_NEWS = "mfmcf_store_news_v1";
const STORAGE_GALLERY = "mfmcf_store_gallery_v1";

const FALLBACK_ART = [
  photos.word,
  photos.gathering,
  photos.prayer,
  photos.worship,
];

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "sermon";

const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const displayDate = (iso: string) => {
  try {
    return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return iso;
  }
};

const displayNewsDate = (iso: string) => {
  try {
    return new Date(`${iso}T12:00:00Z`)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: "UTC",
      })
      .replace(",", "")
      .toUpperCase();
  } catch {
    return iso;
  }
};

// --- SERMONS ---

export function getLocalSermons(): SermonView[] {
  if (typeof window === "undefined") return fallbackSermons;
  try {
    const raw = localStorage.getItem(STORAGE_SERMONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Failed to load local sermons from storage", err);
  }
  return fallbackSermons;
}

function saveLocalSermons(sermons: SermonView[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SERMONS, JSON.stringify(sermons));
  } catch (err) {
    console.warn("Failed to save local sermons to storage", err);
  }
}

export async function addLocalSermon(input: SermonInput): Promise<SermonView> {
  const current = getLocalSermons();
  let artworkUrl: string = FALLBACK_ART[current.length % FALLBACK_ART.length];
  if (input.artwork) {
    try {
      artworkUrl = await fileToDataUrl(input.artwork);
    } catch {
      // Keep fallback
    }
  }

  let audioUrl: string | null = null;
  if (input.audio) {
    try {
      audioUrl = await fileToDataUrl(input.audio);
    } catch {
      // Keep null
    }
  }

  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let counter = 2;
  while (current.some((s) => s.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const newSermon: SermonView = {
    id: Date.now(),
    slug,
    title: input.title,
    speaker: input.speaker,
    iso: input.iso,
    date: displayDate(input.iso),
    tag: input.tag || "Teaching",
    scripture: input.scripture,
    summary: paragraphs(input.description),
    image: artworkUrl,
    audio: audioUrl,
  };

  const updated = [newSermon, ...current];
  saveLocalSermons(updated);
  return newSermon;
}

export async function updateLocalSermon(
  id: number,
  input: SermonInput,
): Promise<SermonView> {
  const current = getLocalSermons();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) {
    return addLocalSermon(input);
  }

  const existing = current[index];
  let artworkUrl = existing.image;
  if (input.artwork) {
    try {
      artworkUrl = await fileToDataUrl(input.artwork);
    } catch {
      // Keep existing
    }
  }

  let audioUrl = existing.audio;
  if (input.audio) {
    try {
      audioUrl = await fileToDataUrl(input.audio);
    } catch {
      // Keep existing
    }
  }

  const updatedSermon: SermonView = {
    ...existing,
    title: input.title,
    speaker: input.speaker,
    iso: input.iso,
    date: displayDate(input.iso),
    tag: input.tag || "Teaching",
    scripture: input.scripture,
    summary: paragraphs(input.description),
    image: artworkUrl,
    audio: audioUrl,
  };

  current[index] = updatedSermon;
  saveLocalSermons([...current]);
  return updatedSermon;
}

export async function deleteLocalSermon(id: number): Promise<void> {
  const current = getLocalSermons();
  const updated = current.filter((s) => s.id !== id);
  saveLocalSermons(updated);
}

// --- NEWS & HOME ANNOUNCEMENTS ---

const STORAGE_ANNOUNCEMENTS = "mfmcf_home_announcement_ids";

export function getAnnouncementIds(): number[] {
  if (typeof window === "undefined") return [-1, -2];
  try {
    const raw = localStorage.getItem(STORAGE_ANNOUNCEMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Failed to load announcement IDs", err);
  }
  return [-1, -2];
}

export function saveAnnouncementIds(ids: number[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_ANNOUNCEMENTS, JSON.stringify(ids));
  } catch (err) {
    console.warn("Failed to save announcement IDs", err);
  }
}

export function toggleAnnouncementId(id: number): boolean {
  const current = getAnnouncementIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((x) => x !== id) : [...current, id];
  saveAnnouncementIds(next);

  // Sync state into STORAGE_NEWS directly if it exists
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_NEWS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const updated = parsed.map((n: NewsView) => ({
            ...n,
            isAnnouncement: next.includes(n.id),
          }));
          localStorage.setItem(STORAGE_NEWS, JSON.stringify(updated));
        }
      }
    } catch {}

    // Dispatch global events for instant reactive UI updates across all components
    try {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("mfmcf-announcements-changed", { detail: next })
      );
    } catch {}
  }

  return !exists;
}

export function getLocalNews(): NewsView[] {
  const announcementIds = getAnnouncementIds();
  if (typeof window === "undefined") {
    return fallbackNews.map((n) => ({
      ...n,
      isAnnouncement: announcementIds.includes(n.id),
    }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_NEWS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((n: NewsView) => ({
          ...n,
          isAnnouncement: announcementIds.includes(n.id),
        }));
      }
    }
  } catch (err) {
    console.warn("Failed to load local news from storage", err);
  }
  return fallbackNews.map((n) => ({
    ...n,
    isAnnouncement: announcementIds.includes(n.id),
  }));
}

function saveLocalNews(news: NewsView[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_NEWS, JSON.stringify(news));
  } catch (err) {
    console.warn("Failed to save local news to storage", err);
  }
}

export async function addLocalNews(input: NewsInput): Promise<NewsView> {
  const current = getLocalNews();
  let artworkUrl: string | null = null;
  if (input.artwork) {
    try {
      artworkUrl = await fileToDataUrl(input.artwork);
    } catch {
      // Keep null
    }
  }

  const id = Date.now();
  const isAnnouncement = input.isAnnouncement ?? false;
  if (isAnnouncement) {
    const currentAnnouncements = getAnnouncementIds();
    if (!currentAnnouncements.includes(id)) {
      saveAnnouncementIds([...currentAnnouncements, id]);
    }
  }

  const newPost: NewsView = {
    id,
    title: input.title,
    iso: input.iso,
    date: displayNewsDate(input.iso),
    tag: input.tag || "Family",
    body: input.body,
    full: input.full,
    artwork: artworkUrl,
    isAnnouncement,
  };

  const updated = [newPost, ...current];
  saveLocalNews(updated);
  return newPost;
}

export async function updateLocalNews(
  id: number,
  input: NewsInput,
): Promise<NewsView> {
  const current = getLocalNews();
  const index = current.findIndex((n) => n.id === id);
  if (index === -1) {
    return addLocalNews(input);
  }

  const existing = current[index];
  let artworkUrl = existing.artwork;
  if (input.artwork) {
    try {
      artworkUrl = await fileToDataUrl(input.artwork);
    } catch {
      // Keep existing
    }
  }

  const isAnnouncement =
    input.isAnnouncement !== undefined
      ? input.isAnnouncement
      : Boolean(existing.isAnnouncement);

  const currentAnnouncements = getAnnouncementIds();
  if (isAnnouncement && !currentAnnouncements.includes(id)) {
    saveAnnouncementIds([...currentAnnouncements, id]);
  } else if (!isAnnouncement && currentAnnouncements.includes(id)) {
    saveAnnouncementIds(currentAnnouncements.filter((x) => x !== id));
  }

  const updatedPost: NewsView = {
    ...existing,
    title: input.title,
    iso: input.iso,
    date: displayNewsDate(input.iso),
    tag: input.tag || "Family",
    body: input.body,
    full: input.full,
    artwork: artworkUrl,
    isAnnouncement,
  };

  current[index] = updatedPost;
  saveLocalNews([...current]);
  return updatedPost;
}

export async function deleteLocalNews(id: number): Promise<void> {
  const current = getLocalNews();
  const updated = current.filter((n) => n.id !== id);
  saveLocalNews(updated);
  const currentAnnouncements = getAnnouncementIds();
  if (currentAnnouncements.includes(id)) {
    saveAnnouncementIds(currentAnnouncements.filter((x) => x !== id));
  }
}

// --- GALLERY ---

export function getLocalGallery(): GalleryView[] {
  if (typeof window === "undefined") return fallbackGallery;
  try {
    const raw = localStorage.getItem(STORAGE_GALLERY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Failed to load local gallery from storage", err);
  }
  return fallbackGallery;
}

function saveLocalGallery(items: GalleryView[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_GALLERY, JSON.stringify(items));
  } catch (err) {
    console.warn("Failed to save local gallery to storage", err);
  }
}

export async function addLocalGalleryItem(
  input: GalleryInput,
): Promise<GalleryView> {
  const current = getLocalGallery();
  let imageUrl: string = photos.gathering;
  if (input.image) {
    try {
      imageUrl = await fileToDataUrl(input.image);
    } catch {
      // Keep fallback
    }
  }

  const newItem: GalleryView = {
    id: Date.now(),
    title: input.title,
    type: input.type || "Community",
    desc: input.desc,
    image: imageUrl,
  };

  const updated = [newItem, ...current];
  saveLocalGallery(updated);
  return newItem;
}

export async function updateLocalGalleryItem(
  id: number,
  input: GalleryInput,
): Promise<GalleryView> {
  const current = getLocalGallery();
  const index = current.findIndex((g) => g.id === id);
  if (index === -1) {
    return addLocalGalleryItem(input);
  }

  const existing = current[index];
  let imageUrl = existing.image;
  if (input.image) {
    try {
      imageUrl = await fileToDataUrl(input.image);
    } catch {
      // Keep existing
    }
  }

  const updatedItem: GalleryView = {
    ...existing,
    title: input.title,
    type: input.type || existing.type,
    desc: input.desc,
    image: imageUrl,
  };

  current[index] = updatedItem;
  saveLocalGallery([...current]);
  return updatedItem;
}

export async function deleteLocalGalleryItem(id: number): Promise<void> {
  const current = getLocalGallery();
  const updated = current.filter((g) => g.id !== id);
  saveLocalGallery(updated);
}
