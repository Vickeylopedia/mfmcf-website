import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { Shell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/reveal";
import { AudioPlayer } from "@/components/audio-player";
import {
  ActionLink,
  Eyebrow,
  PhotoFrame,
} from "@/components/foundation";
import { getSermon } from "@/lib/sermons";
import { useSermons } from "@/lib/queries";
import { withBase } from "@/lib/site";
import { useDocumentTitle } from "@/hooks/use-document-title";
import NotFound from "@/pages/not-found";

function SermonDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { sermons } = useSermons();
  const sermon = slug ? sermons.find((s) => s.slug === slug) : undefined;
  useDocumentTitle(sermon?.title ? `${sermon.title}` : "Sermon");

  if (!sermon) return <NotFound />;

  const requestHref = `mailto:mfmcf.funaab@gmail.com?subject=${encodeURIComponent(
    `Recording request: ${sermon.title}`,
  )}`;
  const audioSrc =
    sermon.audio || withBase("/assets/audio/sample-sermon.mp3");

  return (
    <Shell>
      <section className="site-grid border-b border-[hsl(var(--foreground)/.1)] px-5 pb-16 pt-24 lg:px-10 lg:pb-20 lg:pt-28">
        <div className="mx-auto max-w-[1380px]">
          <Link
            href="/sermons"
            data-testid="link-sermon-back-archive"
            className="group inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to the archive
          </Link>
          <div className="mt-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <Reveal variant="left">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-10 top-10 z-0 size-72 rounded-full bg-[hsl(var(--accent)/.35)] blur-[100px]"
                />
                <PhotoFrame
                  src={sermon.image}
                  alt={sermon.title}
                  className="relative z-10 aspect-[1.18] w-full max-w-md shadow-2xl"
                />
                <span className="mono-label absolute -bottom-4 left-4 bg-[hsl(var(--accent))] px-4 py-2 text-[9px] text-[hsl(var(--foreground))]">
                  {sermon.tag}
                </span>
              </div>
            </Reveal>
            <Reveal variant="right" delay={100}>
              <div className="lg:pt-4">
              <Eyebrow weight="bold">
                Sunday service · {sermon.date}
              </Eyebrow>
              <h1 className="display-font mt-6 max-w-3xl text-5xl leading-[.94] tracking-[-.04em] sm:text-7xl">
                {sermon.title}
              </h1>
              <p className="mt-6 text-lg leading-7 text-[hsl(var(--muted-foreground))]">
                {sermon.speaker}
              </p>
              <div className="mt-8 max-w-xl space-y-5 text-base leading-7 text-[hsl(var(--muted-foreground))]">
                {sermon.summary.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1380px] gap-6 md:grid-cols-2">
          <Reveal>
            <div className="border-t border-[hsl(var(--foreground)/.18)] pt-6">
            <Eyebrow>Scripture</Eyebrow>
            <p className="display-font mt-5 text-4xl tracking-[-.02em] sm:text-5xl">
              {sermon.scripture}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              Bring a Bible, a notebook, or just yourself. The passage is read
              together before the message begins.
            </p>
          </div>
          </Reveal>
          <Reveal delay={120} className="min-w-0 w-full">
            <AudioPlayer
              src={audioSrc}
              title={sermon.title}
              speaker={sermon.speaker}
              artworkUrl={sermon.image}
              scripture={sermon.scripture}
              date={sermon.date}
              slug={sermon.slug}
            />
          </Reveal>
        </div>
      </section>
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <Eyebrow>One more thing</Eyebrow>
              <h2 className="display-font mt-3 max-w-lg text-4xl leading-[.96] tracking-[-.03em] sm:text-5xl">
                Sundays are better in the room.
              </h2>
            </div>
            <ActionLink href="/sermons" testId="link-sermons-cta">
              Browse the whole archive
            </ActionLink>
          </div>
        </Reveal>
      </section>
    </Shell>
  );
}

export default SermonDetail;
