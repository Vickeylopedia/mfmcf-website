import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Play, Search } from "lucide-react";
import { Link } from "wouter";
import { Shell } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { useSermons, type SermonView } from "@/lib/queries";

function Sermons() {
  const [query, setQuery] = useState("");
  const [latestFirst, setLatestFirst] = useState(true);
  const { sermons, isLoading } = useSermons();
  const filtered = useMemo(() => {
    const matches = sermons.filter((s) =>
      `${s.title} ${s.speaker} ${s.tag}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    return latestFirst ? matches : [...matches].reverse();
  }, [sermons, query, latestFirst]);
  return (
    <Shell>
      <PageIntro
        eyebrow="Listen back"
        ghost="ARCHIVE"
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
              aria-pressed={!latestFirst}
              data-testid="button-sermon-filter"
              onClick={() => setLatestFirst((value) => !value)}
              className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]"
            >
              {latestFirst ? "Latest first" : "Oldest first"}{" "}
              <ChevronDown
                className={`size-4 transition-transform ${latestFirst ? "" : "rotate-180"}`}
              />
            </button>
          </div>
          {filtered.length ? (
            <div className="border-b border-[hsl(var(--foreground)/.15)]">
              {filtered.map((sermon, i) => (
                <Reveal key={sermon.slug} delay={(i % 2) * 100}>
                  <article className="group grid grid-cols-[auto_1fr] items-center gap-5 border-t border-[hsl(var(--foreground)/.15)] py-7 sm:grid-cols-[auto_auto_1fr_auto] sm:gap-8">
                    <span
                      aria-hidden="true"
                      className="display-font hidden w-14 text-5xl leading-none text-[hsl(var(--foreground)/.16)] lg:block"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/sermons/${sermon.slug}`}
                      aria-label={`Play ${sermon.title}`}
                      data-testid={`button-play-sermon-${i}`}
                      className="relative block w-20 shrink-0 sm:w-24"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={sermon.image}
                          alt=""
                          className="photo-shift h-full w-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-1.5 left-1.5 flex size-7 items-center justify-center bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Play className="ml-0.5 size-3 fill-current" />
                      </span>
                    </Link>
                    <div className="min-w-0">
                      <p className="mono-label text-[9px] text-[hsl(var(--primary))]">
                        {sermon.tag} · {sermon.date}
                        {sermon.audio ? " · audio" : ""}
                      </p>
                      <h2 className="display-font mt-2 text-3xl leading-none transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">
                        <Link
                          href={`/sermons/${sermon.slug}`}
                          className="transition-colors hover:text-[hsl(var(--primary))]"
                        >
                          {sermon.title}
                        </Link>
                      </h2>
                      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                        {sermon.speaker}
                      </p>
                    </div>
                    <Link
                      href={`/sermons/${sermon.slug}`}
                      aria-label={`Listen to ${sermon.title}`}
                      data-testid={`button-listen-sermon-${i}`}
                      className="hidden items-center gap-2 text-xs font-bold text-[hsl(var(--primary))] sm:flex"
                    >
                      Listen
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </article>
                </Reveal>
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
