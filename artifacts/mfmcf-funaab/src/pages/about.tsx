import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { photos } from "@/lib/site";

function About() {
  return (
    <Shell>
      <PageIntro
        eyebrow="Who we are"
        title={<>The kind of faith you can bring to class.</>}
        intro="MFMCF FUNAAB is a campus Christian family — rooted in prayer, honest about the journey, and convinced that nobody should have to do university life alone."
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          <Stat number="01" label="One family" />
          <Stat number="24/7" label="A listening ear" />
          <Stat number="∞" label="Room to grow" />
        </div>
      </PageIntro>
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal variant="left">
            <div className="relative">
              <div className="aspect-[.82] max-w-md overflow-hidden">
                <img
                  src={photos.joy}
                  alt="Fellowship members celebrating together"
                  className="photo-shift h-full w-full object-cover"
                />
              </div>
              <p className="absolute -bottom-5 -right-2 bg-[hsl(var(--accent))] px-5 py-4 text-sm font-bold sm:right-10">
                Family of Love, since day one.
              </p>
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="lg:pt-8">
              <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                Our story, still unfolding
              </p>
              <h2 className="display-font mt-5 max-w-2xl text-5xl leading-[.96] tracking-[-.04em] sm:text-7xl">
                A fellowship that feels like a front room.
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-base leading-7 text-[hsl(var(--muted-foreground))]">
                <p>
                  On a busy campus, it is easy to become a face in a crowd. We
                  gather to make something different possible: a community where
                  you can worship freely, ask the difficult question, find a
                  prayer partner, and be remembered when the semester gets heavy.
                </p>
                <p>
                  We are part of the Mountain of Fire and Miracles Ministries
                  Campus Fellowship family, serving students of the Federal
                  University of Agriculture, Abeokuta. Our expression is joyful,
                  prayerful, practical, and very much shaped by the people who
                  walk through our doors.
                </p>
              </div>
              <ButtonLink href="/contact">Come and see</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
            What holds us together
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <Reveal>
              <Value
                n="01"
                title="Presence over polish"
                body="We make space for real worship, real questions, and real people. No performance required."
              />
            </Reveal>
            <Reveal delay={120}>
              <Value
                n="02"
                title="Love with sleeves rolled up"
                body="Our faith shows up in check-ins, shared meals, study support, and prayers that keep going."
              />
            </Reveal>
            <Reveal delay={240}>
              <Value
                n="03"
                title="Growing on purpose"
                body="Through the Word and one another, we are becoming students who carry light beyond campus."
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
      <p className="display-font text-4xl text-[hsl(var(--primary))]">{number}</p>
      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
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
