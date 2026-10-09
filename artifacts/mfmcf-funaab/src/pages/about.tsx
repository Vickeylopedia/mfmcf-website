import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { photos } from "@/lib/site";
import { useDocumentTitle } from "@/hooks/use-document-title";

function About() {
  useDocumentTitle("About Us");
  return (
    <Shell>
      <PageIntro
        eyebrow="Who we are through God"
        ghost="FAMILY"
        title={<>We are a Family of Love, Word and Power.</>}
        intro="Here on campus, we are more than just students who meet on Sundays. We are a family drawn together by God's tender love, guided by the living truth of His Word, and empowered by the Holy Spirit each day. You never have to walk through university life alone, there is always an open seat, warm prayer, and a caring heart waiting for you here."
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          <Stat number="Love" label="A home where you are genuinely accepted and known" />
          <Stat number="Word" label="Living truth that guides your steps and studies" />
          <Stat number="Power" label="Holy Spirit strength for daily victory on campus" />
        </div>
      </PageIntro>
      <section className="relative overflow-hidden px-5 py-16 lg:px-10 lg:py-24">
        <span
          aria-hidden="true"
          className="ghost-word -bottom-10 left-[-2%]"
        >
          STORY
        </span>
        <div
          aria-hidden="true"
          className="dot-grid absolute right-0 top-10 size-56 opacity-70"
        />
        <div className="relative z-10 mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal variant="left">
            <div className="relative max-w-md pr-6 pb-12 sm:pr-10">
              <span className="sticker absolute -left-3 -top-6 z-20 rotate-[-6deg] bg-[hsl(var(--accent))] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--foreground))]">
                Family of Love
              </span>
              <div className="sticker -rotate-[2deg] bg-white p-3">
                <div className="aspect-[.82] overflow-hidden">
                  <img
                    src={photos.joy}
                    alt="Fellowship members celebrating together"
                    className="photo-shift h-full w-full object-cover"
                  />
                </div>
                <p className="mono-label px-1 pb-1 pt-3 text-[9px] text-[hsl(var(--muted-foreground))]">
                  Joyful times with the family
                </p>
              </div>
              <div className="sticker absolute -bottom-0 right-0 z-10 w-[48%] rotate-[4deg] border-8 border-[hsl(var(--primary))] bg-white">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photos.fellowshipWorship}
                    alt="Hands lifted during a moment of worship"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="lg:pt-8">
              <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                Our heartbeat
              </p>
              <h2 className="display-font mt-5 max-w-2xl text-5xl leading-[.96] tracking-[-.04em] sm:text-7xl">
                A home where love, truth and power meet.
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-base leading-7 text-[hsl(var(--muted-foreground))]">
                <p>
                  On a bustling campus like FUNAAB, it is easy to feel lost in lectures and schedules. That is why we gather: to build a safe, loving haven where you can worship with joy, ask honest questions, pray without fear, and find friends who truly look out for your spiritual and academic life.
                </p>
                <p>
                  We are the Mountain of Fire and Miracles Ministries Campus Fellowship at the Federal University of Agriculture, Abeokuta. Our heartbeat is simple: walking in Christ's love, growing deep in the scriptures, and seeing God's miraculous power transform students into carriers of His light.
                </p>
              </div>
              <ButtonLink href="/contact">Come and see</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="relative overflow-hidden bg-[hsl(var(--secondary))] px-5 py-16 lg:px-10 lg:py-24">
        <span
          aria-hidden="true"
          className="ghost-word -bottom-10 right-[-2%]"
        >
          ROOTS
        </span>
        <div className="relative z-10 mx-auto max-w-[1380px]">
          <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
            What holds us together
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <Reveal>
              <Value
                n="01"
                title="Family of Love"
                body="We look out for one another in lectures, hostels, and beyond. We check on you, pray with you, and share laughter and honest encouragement through every semester."
              />
            </Reveal>
            <Reveal delay={120}>
              <Value
                n="02"
                title="Rooted in the Word"
                body="God's Word is our anchor. Through teaching and personal study, we discover practical wisdom that strengthens our faith and guides our career ambitions."
              />
            </Reveal>
            <Reveal delay={240}>
              <Value
                n="03"
                title="Walking in Power"
                body="Prayer changes things. We believe in the active power of the Holy Spirit to bring peace, overcome pressure, and help every student fulfill their divine destiny."
              />
            </Reveal>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-t border-[hsl(var(--foreground)/.2)] pt-4">
      <p className="display-font text-3xl sm:text-4xl text-[hsl(var(--primary))] font-bold">{number}</p>
      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] leading-snug">{label}</p>
    </div>
  );
}

function Value({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <article className="border-t border-[hsl(var(--foreground)/.18)] pt-5">
      <p className="mono-label text-[10px] text-[hsl(var(--primary))]">{n}</p>
      <h3 className="mt-9 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">
        {body}
      </p>
    </article>
  );
}

export default About;
