import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";

const newsItems = [
  {
    date: "22 MAY 2026",
    title: "The room is ready for you",
    body: "Whether it is your first Sunday or your fiftieth, there is an open seat and a familiar face waiting at the New Lecture Theatre.",
    full: "Doors open from 8:30 AM, and the welcome team will be outside to walk you in if it is your first time. Come as you are — jeans, hostel wear, Sunday best; nobody is keeping score. After the service, stay back for a few minutes so we can meet you properly. That is the whole point of family.",
    tag: "Welcome",
  },
  {
    date: "16 MAY 2026",
    title: "Exam season, softer landing",
    body: "We are keeping the family rooms open through exams. Come study, pray, breathe, or simply sit with people who understand.",
    full: "From Monday to Friday, 10 AM to 4 PM, one of the family rooms stays open as a quiet study space — power points, quiet playlists, and someone to pray with when a paper goes badly. There is also a short prayer walk every evening at 6 PM for anyone who wants to end the study day with peace instead of panic.",
    tag: "Community",
  },
  {
    date: "03 MAY 2026",
    title: "A new rhythm for midweek",
    body: "Midweek Recharge now meets every Wednesday at 5:00 PM. Short teaching, open prayer, honest conversation.",
    full: "We heard the family clearly: Sundays carry the celebration, but the middle of the week needs somewhere to land. So Midweek Recharge is now weekly — thirty minutes of teaching that connects to real campus life, then open prayer and honest conversation until nobody needs to talk anymore. Bring your questions; bring your friend who has questions.",
    tag: "Gatherings",
  },
];

function News() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Shell>
      <PageIntro
        eyebrow="Notes from the family"
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
          {newsItems.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.title} delay={Math.min(i, 2) * 100}>
                <article className="grid gap-5 border-t border-[hsl(var(--foreground)/.18)] py-8 sm:grid-cols-[.28fr_1fr_.25fr] sm:gap-10">
                <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                  {item.date}
                </p>
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
