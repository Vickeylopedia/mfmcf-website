import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Play, Search } from "lucide-react";
import { Link } from "wouter";
import { Shell } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { sermons } from "@/lib/sermons";

function Sermons() {
  const [query, setQuery] = useState("");
  const [latestFirst, setLatestFirst] = useState(true);
  const filtered = useMemo(() => {
    const matches = sermons.filter((s) =>
      `${s.title} ${s.speaker} ${s.tag}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    return latestFirst ? matches : [...matches].reverse();
  }, [query, latestFirst]);
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
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
              {filtered.map((sermon, i) => (
                <article
                  key={sermon.slug}
                  className="group grid gap-5 sm:grid-cols-[.9fr_1.1fr]"
                >
                  <div className="relative aspect-[1.18] overflow-hidden">
                    <img
                      src={sermon.image}
                      alt=""
                      className="photo-shift h-full w-full object-cover"
                    />
                    <Link
                      href={`/sermons/${sermon.slug}`}
                      aria-label={`Play ${sermon.title}`}
                      data-testid={`button-play-sermon-${i}`}
                      className="absolute bottom-4 left-4 flex size-11 items-center justify-center bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] transition hover:scale-105"
                    >
                      <Play className="ml-0.5 size-4 fill-current" />
                    </Link>
                  </div>
                  <div className="flex flex-col justify-end border-t border-[hsl(var(--foreground)/.15)] pt-4 sm:border-t-0 sm:pt-0">
                    <p className="mono-label text-[9px] text-[hsl(var(--primary))]">
                      {sermon.tag} · {sermon.date}
                    </p>
                    <h2 className="display-font mt-3 text-3xl leading-none sm:text-4xl">
                      <Link
                        href={`/sermons/${sermon.slug}`}
                        className="transition hover:text-[hsl(var(--primary))]"
                      >
                        {sermon.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                      {sermon.speaker}
                    </p>
                    <Link
                      href={`/sermons/${sermon.slug}`}
                      data-testid={`button-listen-sermon-${i}`}
                      className="mt-8 flex w-fit items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]"
                    >
                      Listen to message <ArrowUpRight className="size-4" />
                    </Link>
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
