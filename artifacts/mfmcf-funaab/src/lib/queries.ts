import { useQuery } from "@tanstack/react-query";
import {
  listGallery,
  listNews,
  listSermons,
  type GalleryItemDto,
  type NewsPostDto,
  type SermonDto,
} from "@workspace/api-client-react";
import { withBase, photos, resolveMediaUrl } from "@/lib/site";
import { useState, useEffect } from "react";
import {
  getLocalSermons,
  getLocalNews,
  getLocalGallery,
  getLocalTenures,
  getAnnouncementIds,
  fallbackSermons,
  fallbackNews,
  fallbackGallery,
  type SermonView,
  type NewsView,
  type GalleryView,
} from "./content-store";
import type { Tenure, Executive } from "@/data/executives";

export type { SermonView, NewsView, GalleryView, Tenure, Executive };
export { fallbackSermons, fallbackNews, fallbackGallery };

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
    ? resolveMediaUrl(dto.artworkUrl)
    : FALLBACK_ART[index % FALLBACK_ART.length],
  audio: dto.audioUrl ? resolveMediaUrl(dto.audioUrl) : null,
});

export function useSermons() {
  const { data, isLoading } = useQuery({
    queryKey: ["sermons"],
    queryFn: () => listSermons(),
    retry: 1,
    staleTime: 30_000,
  });
  const validData = Array.isArray(data) ? data : null;
  return {
    sermons: validData ? validData.map(mapSermon) : getLocalSermons(),
    raw: data,
    isLoading,
    live: validData !== null,
  };
}

export const mapNews = (dto: NewsPostDto): NewsView => {
  const announcementIds = getAnnouncementIds();
  return {
    id: dto.id,
    title: dto.title,
    date: dto.date,
    iso: dto.iso,
    tag: dto.tag,
    body: dto.body,
    full: dto.full,
    artwork: dto.artworkUrl ? resolveMediaUrl(dto.artworkUrl) : null,
    isAnnouncement:
      (dto as any).isAnnouncement === true || announcementIds.includes(dto.id),
  };
};

export function useNews() {
  const { data, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => listNews(),
    retry: 1,
    staleTime: 30_000,
  });
  const validData = Array.isArray(data) ? data : null;
  return {
    news: validData ? validData.map(mapNews) : getLocalNews(),
    raw: data,
    isLoading,
    live: validData !== null,
  };
}

export const mapGallery = (dto: GalleryItemDto): GalleryView => ({
  id: dto.id,
  title: dto.title,
  type: dto.type,
  desc: dto.desc,
  image: resolveMediaUrl(dto.imageUrl),
});

export function useGallery() {
  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => listGallery(),
    retry: 1,
    staleTime: 30_000,
  });
  const validData = Array.isArray(data) ? data : null;
  const items = validData ? validData.map(mapGallery) : getLocalGallery();
  return {
    gallery: [...items].sort((a, b) => b.id - a.id),
    raw: data,
    isLoading,
    live: validData !== null,
  };
}

export function useTenures() {
  const [tenuresList, setTenuresList] = useState<Tenure[]>(() =>
    getLocalTenures(),
  );

  useEffect(() => {
    const handleUpdate = () => {
      setTenuresList(getLocalTenures());
    };
    window.addEventListener("mfmcf-tenures-changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("mfmcf-tenures-changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    tenures: tenuresList,
    refetch: () => setTenuresList(getLocalTenures()),
  };
}
