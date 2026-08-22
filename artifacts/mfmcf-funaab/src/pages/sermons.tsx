import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Play, Search } from "lucide-react";
import { Shell } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { photos } from "@/lib/site";

const sermonItems = [
  {
    title: "The grace called favour",
    speaker: "Minister T. Adeyemi",
    date: "May 18, 2026",
    tag: "Grace",
    image: photos.word,
  },
  {
    title: "Life-giving spirits",
    speaker: "Sister Favour O.",
    date: "May 11, 2026",
    tag: "Identity",
    image: photos.gathering,
  },
  {
    title: "When prayer becomes home",
    speaker: "Brother David A.",
    date: "May 04, 2026",
    tag: "Prayer",
    image: photos.prayer,
  },
  {
    title: "A faith that finds its feet",
    speaker: "Minister K. Adebayo",
    date: "April 27, 2026",
    tag: "Faith",
    image: photos.worship,
  },
];

function Sermons() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      sermonItems.filter((s) =>
        `${s.title} ${s.speaker} ${s.tag}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <Shell>
      <PageIntro
        eyebrow="Listen back"
        title={
          <>
            Words for the
            <br />
            <em className="font-normal">road ahead.</em>
          </>
        }
        intro="A growing archive of messages from our Sunday gatherings and midweek moments. Press play when you need a little light."
      >
        <div className="mt-10 flex max-w-lg items-center border-b border-[hsl(var(--foreground)/.25)] pb-3">
          <Search className="mr-3 size-4 text-[hsl(var(--primary))]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages"
            aria-label="Search messages"
            data-testid="input-sermon-search"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </PageIntro>
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {filtered.length} messages in the archive
            </p>
            <button
              type="button"
              data-testid="button-sermon-filter"
              className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]"
            >
              Latest first <ChevronDown className="size-4" />
            </button>
          </div>
          {filtered.length ? (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
              {filtered.map((sermon, i) => (
                <article
                  key={sermon.title}
                  className="group grid gap-5 sm:grid-cols-[.9fr_1.1fr]"
                >
                  <div className="relative aspect-[1.18] overflow-hidden">
                    <img
                      src={sermon.image}
                      alt=""
                      className="photo-shift h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Play ${sermon.title}`}
                      data-testid={`button-play-sermon-${i}`}
                      className="absolute bottom-4 left-4 flex size-11 items-center justify-center bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] transition hover:scale-105"
                    >
                      <Play className="ml-0.5 size-4 fill-current" />
                    </button>
                  </div>
                  <div className="flex flex-col justify-end border-t border-[hsl(var(--foreground)/.15)] pt-4 sm:border-t-0 sm:pt-0">
                    <p className="mono-label text-[9px] text-[hsl(var(--primary))]">
                      {sermon.tag} · {sermon.date}
                    </p>
                    <h2 className="display-font mt-3 text-3xl leading-none sm:text-4xl">
                      {sermon.title}
                    </h2>
                    <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                      {sermon.speaker}
                    </p>
                    <button
                      type="button"
                      data-testid={`button-listen-sermon-${i}`}
                      className="mt-8 flex w-fit items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]"
                    >
                      Listen to message <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[hsl(var(--foreground)/.25)] px-6 py-16 text-center">
              <p className="display-font text-3xl">No message found yet.</p>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                Try another word or browse the full archive.
              </p>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

export default Sermons;
