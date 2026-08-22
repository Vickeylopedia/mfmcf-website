import { useQuery } from "@tanstack/react-query";
import {
  listGallery,
  listNews,
  listSermons,
  type GalleryItemDto,
  type NewsPostDto,
  type SermonDto,
} from "@workspace/api-client-react";
import { withBase, photos } from "@/lib/site";
import { sermons as staticSermons } from "@/lib/sermons";

/**
 * Content views: what the pages render. Data comes from the API when it is
 * reachable and falls back to the built-in content otherwise, so the site
 * still renders if the server is down or the database is not seeded yet.
 */

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
};

export type GalleryView = {
  id: number;
  title: string;
  type: string;
  desc: string;
  image: string;
};

const FALLBACK_ART = [
  photos.word,
  photos.gathering,
  photos.prayer,
  photos.worship,
];

const mapSermon = (dto: SermonDto, index: number): SermonView => ({
  id: dto.id,
  slug: dto.slug,
  title: dto.title,
  speaker: dto.speaker,
  date: dto.date,
  iso: dto.iso,
  tag: dto.tag,
  scripture: dto.scripture,
  summary: dto.summary,
  image: dto.artworkUrl
    ? withBase(dto.artworkUrl)
    : FALLBACK_ART[index % FALLBACK_ART.length],
  audio: dto.audioUrl ? withBase(dto.audioUrl) : null,
});

export const fallbackSermons: SermonView[] = staticSermons.map((sermon, i) => ({
  ...sermon,
  id: -(i + 1),
  audio: null,
}));

export function useSermons() {
  const { data, isLoading } = useQuery({
    queryKey: ["sermons"],
    queryFn: () => listSermons(),
    retry: 1,
    staleTime: 30_000,
  });
  return {
    sermons: data ? data.map(mapSermon) : fallbackSermons,
    raw: data,
    isLoading,
    live: data !== undefined,
  };
}

export const mapNews = (dto: NewsPostDto): NewsView => ({
  id: dto.id,
  title: dto.title,
  date: dto.date,
  iso: dto.iso,
  tag: dto.tag,
  body: dto.body,
  full: dto.full,
  artwork: dto.artworkUrl ? withBase(dto.artworkUrl) : null,
});

export const fallbackNews: NewsView[] = [
  {
    id: -1,
    title: "The room is ready for you",
    date: "22 MAY 2026",
    iso: "2026-05-22",
    tag: "Welcome",
    body: "Whether it is your first Sunday or your fiftieth, there is an open seat and a familiar face waiting at the New Lecture Theatre.",
    full: "Doors open from 8:30 AM, and the welcome team will be outside to walk you in if it is your first time. Come as you are — jeans, hostel wear, Sunday best; nobody is keeping score. After the service, stay back for a few minutes so we can meet you properly. That is the whole point of family.",
    artwork: null,
  },
  {
    id: -2,
    title: "Exam season, softer landing",
    date: "16 MAY 2026",
    iso: "2026-05-16",
    tag: "Community",
    body: "We are keeping the family rooms open through exams. Come study, pray, breathe, or simply sit with people who understand.",
    full: "From Monday to Friday, 10 AM to 4 PM, one of the family rooms stays open as a quiet study space — power points, quiet playlists, and someone to pray with when a paper goes badly. There is also a short prayer walk every evening at 6 PM for anyone who wants to end the study day with peace instead of panic.",
    artwork: null,
  },
  {
    id: -3,
    title: "A new rhythm for midweek",
    date: "03 MAY 2026",
    iso: "2026-05-03",
    tag: "Gatherings",
    body: "Midweek Recharge now meets every Wednesday at 5:00 PM. Short teaching, open prayer, honest conversation.",
    full: "We heard the family clearly: Sundays carry the celebration, but the middle of the week needs somewhere to land. So Midweek Recharge is now weekly — thirty minutes of teaching that connects to real campus life, then open prayer and honest conversation until nobody needs to talk anymore. Bring your questions; bring your friend who has questions.",
    artwork: null,
  },
];

export function useNews() {
  const { data, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => listNews(),
    retry: 1,
    staleTime: 30_000,
  });
  return {
    news: data ? data.map(mapNews) : fallbackNews,
    raw: data,
    isLoading,
    live: data !== undefined,
  };
}

export const mapGallery = (dto: GalleryItemDto): GalleryView => ({
  id: dto.id,
  title: dto.title,
  type: dto.type,
  desc: dto.desc,
  image: withBase(dto.imageUrl),
});

export const fallbackGallery: GalleryView[] = [
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
    desc: "Full rooms, full hearts — the chapter in one frame.",
    image: photos.community,
  },
  {
    id: -7,
    title: "Every voice welcome",
    type: "Worship",
    desc: "Loud or quiet, off-key or on — it all counts as praise here.",
    image: photos.fellowshipWorship,
  },
];

export function useGallery() {
  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => listGallery(),
    retry: 1,
    staleTime: 30_000,
  });
  return {
    gallery: data ? data.map(mapGallery) : fallbackGallery,
    raw: data,
    isLoading,
    live: data !== undefined,
  };
}
