import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { useNews } from "@/lib/queries";
import { useDocumentTitle } from "@/hooks/use-document-title";

function News() {
  useDocumentTitle("Notes & Announcements");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { news, isLoading } = useNews();

  return (
    <Shell>
      <PageIntro
        eyebrow="Notes from the family"
        ghost="NOTES"
        title={
          <>
            What’s happening
            <br />
            <em className="font-normal">around here.</em>
          </>
        }
        intro="Announcements, reflections, and the little updates that help us stay close between Sundays."
      />
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          {isLoading && (
            <p className="mono-label text-[10px]">Loading the notes…</p>
          )}
          {news.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.title} delay={Math.min(i, 2) * 100}>
                <article className="grid gap-5 border-t border-[hsl(var(--foreground)/.18)] py-8 sm:grid-cols-[.28fr_1fr_.25fr] sm:gap-10">
                  <div>
                    {item.artwork && (
                      <div className="mb-3 aspect-square w-16 overflow-hidden bg-[hsl(var(--secondary))] sm:w-full">
                        <img
                          src={item.artwork}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                      {item.date}
                    </p>
                  </div>
                <div>
                  <h2 className="display-font text-3xl leading-none sm:text-4xl">
                    {item.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                    {item.body}
                  </p>
                  {open && (
                    <p
                      data-testid={`text-news-full-${i}`}
                      className="reveal mt-4 max-w-xl text-sm leading-6 text-[hsl(var(--muted-foreground))]"
                    >
                      {item.full}
                    </p>
                  )}
                  <button
                    type="button"
                    aria-expanded={open}
                    data-testid={`button-read-news-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]"
                  >
                    {open ? "Close note" : "Read note"}{" "}
                    <ArrowUpRight
                      className={`size-4 transition-transform ${open ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
                <p className="text-right text-xs font-semibold text-[hsl(var(--muted-foreground))] sm:pt-2">
                  {item.tag}
                </p>
              </article>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="bg-[hsl(var(--primary))] px-5 py-16 text-white lg:px-10">
        <div className="mx-auto flex max-w-[1100px] flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div>
            <p className="mono-label text-[10px] text-[hsl(var(--accent))]">
              Never miss a beat
            </p>
            <h2 className="display-font mt-3 text-4xl">
              Keep the family close.
            </h2>
          </div>
          <ButtonLink href="/contact" inverted>
            Get connected
          </ButtonLink>
        </div>
      </section>
    </Shell>
  );
}

export default News;
