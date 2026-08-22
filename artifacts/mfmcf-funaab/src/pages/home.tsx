import { useState } from "react";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useParallax } from "@/hooks/use-parallax";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Play,
  Quote,
  Send,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { Shell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/reveal";
import {
  ActionLink,
  Eyebrow,
  PhotoFrame,
  SectionHeading,
} from "@/components/foundation";
import { getSermon, type Sermon } from "@/lib/sermons";

function Home() {
  const heroCollage = useParallax(72);
  return (
    <Shell>
      <section className="home-hero relative overflow-hidden bg-[hsl(var(--primary))] px-5 pb-16 pt-28 text-white lg:px-10 lg:pb-24 lg:pt-36">
        <div className="home-orbit pointer-events-none absolute -right-32 -top-40 size-[32rem] rounded-full border border-white/10" />
        <div className="home-orbit home-orbit-small pointer-events-none absolute -right-16 -top-24 size-[25rem] rounded-full border border-white/10" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/3 z-0 size-[30rem] rounded-full bg-[hsl(var(--accent)/.3)] blur-[120px]"
        />
        <div className="relative z-10 mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div className="relative z-10 reveal">
            <Eyebrow tone="accent">
              Mountain of Fire &amp; Miracles Campus Fellowship
            </Eyebrow>
            <h1 className="display-font mt-7 max-w-2xl text-6xl leading-[.88] tracking-[-.055em] sm:text-8xl lg:text-[9.2rem]">
              Family
              <br />
              <em className="font-normal text-[hsl(var(--accent))]">
                of Love.
              </em>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-7 text-white/75">
              A warm, growing fellowship for students at FUNAAB — where faith
              gets practical and no one has to walk campus alone.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ActionLink href="/contact" inverted testId="link-contact-cta">
                Plan your first visit
              </ActionLink>
              <Link
                href="/about"
                data-testid="link-home-our-story"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
              >
                Meet the family{" "}
                <ArrowDownRight className="size-4 transition-transform group-hover:translate-y-1" />
              </Link>
            </div>
          </div>
          <div
            ref={heroCollage}
            className="relative min-h-[420px] sm:min-h-[560px]"
          >
            <PhotoFrame
              src={getSermon("the-grace-called-favour")?.image ?? ""}
              alt="Students gathered during a Sunday service"
              className="hero-photo-main absolute right-0 top-0 h-[76%] w-[78%] bg-white/10 shadow-2xl"
              testId="img-home-hero"
            />
            <PhotoFrame
              src={getSermon("life-giving-spirits")?.image ?? ""}
              alt="Three fellowship members smiling together"
              className="hero-photo-secondary absolute bottom-0 left-0 h-[54%] w-[58%] bg-white/10"
            />
            <div className="hero-info-card absolute bottom-10 right-0 border border-white/30 bg-[hsl(var(--foreground))] px-5 py-4 text-white shadow-xl sm:bottom-16 sm:px-7">
              <Eyebrow tone="accent" className="text-[9px]">
                This Sunday
              </Eyebrow>
              <p className="mt-1 font-semibold">Word · Worship · Welcome</p>
              <p className="mt-1 text-xs text-white/60">
                New Lecture Theatre · 9:00 AM
              </p>
            </div>
            <span className="hero-spark absolute left-[46%] top-[29%] flex size-12 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-xl">
              <Sparkles className="size-5" />
            </span>
          </div>
        </div>
      </section>
      <section className="bg-[hsl(var(--card))] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal variant="left">
            <SectionHeading
              eyebrow="Our north star"
              title="A family that makes room."
              headingClassName="mt-5 max-w-md leading-[.96]"
            />
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="max-w-2xl lg:pt-10">
            <p className="text-2xl leading-snug text-[hsl(var(--foreground))] sm:text-3xl">
              “Family of Love” is not a line on a banner. It is how we choose
              to show up — with open seats, honest questions, loud worship,
              and the kind of care that remembers your exam timetable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="border border-[hsl(var(--primary)/.25)] px-4 py-2 text-sm text-[hsl(var(--primary))]">
                Faith with room to grow
              </span>
              <span className="border border-[hsl(var(--primary)/.25)] px-4 py-2 text-sm text-[hsl(var(--primary))]">
                People before performance
              </span>
              <span className="border border-[hsl(var(--primary)/.25)] px-4 py-2 text-sm text-[hsl(var(--primary))]">
                A home on campus
              </span>
            </div>
          </div>
          </Reveal>
        </div>
      </section>
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="A week with us"
              title={
                <>
                  There’s a place
                  <br />
                  in the rhythm.
                </>
              }
              headingClassName="leading-none"
            />
            <ActionLink href="/contact" testId="link-contact-cta">
              See where to find us
            </ActionLink>
          </div>
          <div className="mt-12 grid gap-px border border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--foreground)/.12)] md:grid-cols-3">
            <Reveal className="h-full">
              <EventCard
                day="SUN"
                title="Sunday Gathering"
                detail="A full-hearted service for the week ahead."
                time="9:00 AM"
              />
            </Reveal>
            <Reveal className="h-full" delay={120}>
              <EventCard
                day="WED"
                title="Midweek Recharge"
                detail="Scripture, prayer, and the questions in between."
                time="5:00 PM"
              />
            </Reveal>
            <Reveal className="h-full" delay={240}>
              <EventCard
                day="FRI"
                title="Family Hangout"
                detail="A softer landing after a long campus week."
                time="4:30 PM"
              />
            </Reveal>
          </div>
        </div>
      </section>
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
            <Reveal variant="left">
              <div>
                <SectionHeading
                  eyebrow="From the archive"
                  title={
                    <>
                      God still
                      <br />
                      <em className="font-normal">speaks.</em>
                    </>
                  }
                  headingClassName="leading-[.94] tracking-[-.04em]"
                />
                <p className="mt-6 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  Catch up on a word you missed, or press play on something you
                  need today.
                </p>
                <Link
                  href="/sermons"
                  data-testid="link-home-sermon-archive"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]"
                >
                  Browse the sermon archive{" "}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal variant="scale">
                <SermonCard sermon={getSermon("the-grace-called-favour")} />
              </Reveal>
              <Reveal variant="scale" delay={120}>
                <SermonCard sermon={getSermon("life-giving-spirits")} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-[hsl(var(--foreground))] px-5 py-20 text-white lg:px-10 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 z-0 size-[26rem] rounded-full bg-[hsl(var(--accent)/.22)] blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 z-0 size-[22rem] rounded-full bg-[hsl(var(--primary)/.35)] blur-[110px]"
        />
        <div className="relative z-10 mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <Reveal variant="left">
            <div>
              <Quote className="size-9 text-[hsl(var(--accent))]" />
              <p className="display-font mt-7 max-w-4xl text-5xl leading-[.98] tracking-[-.03em] sm:text-7xl">
                You do not have to have it all together before you belong.
              </p>
              <p className="mt-8 text-sm text-white/55">
                — A note from one of our family meetings
              </p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <div className="relative mx-auto w-full max-w-sm">
              <PhotoFrame
                src={getSermon("when-prayer-becomes-home")?.image ?? ""}
                alt="Students in a moment of prayer"
                frame="foreground"
                className="aspect-[4/5]"
              />
              <div className="absolute -bottom-5 -left-5 bg-[hsl(var(--accent))] px-5 py-4 text-[hsl(var(--foreground))]">
                <p className="mono-label text-[9px]">Family of Love</p>
                <p className="mt-1 text-sm font-bold">A place to be known.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="site-grid px-5 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-8 border-y border-[hsl(var(--foreground)/.14)] py-10 sm:flex-row sm:items-center">
            <div>
              <Eyebrow>Keep in touch</Eyebrow>
              <h2 className="display-font mt-3 text-4xl tracking-[-.03em] sm:text-5xl">
                The good stuff, occasionally.
              </h2>
            </div>
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </Shell>
  );
}

function EventCard({
  day,
  title,
  detail,
  time,
}: {
  day: string;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <article className="group h-full bg-[hsl(var(--card))] p-6 transition hover:bg-[hsl(var(--primary))] hover:text-white sm:p-8">
      <div className="flex items-start justify-between">
        <Eyebrow className="[.group:hover_&]:text-[hsl(var(--accent))]">
          {day}
        </Eyebrow>
        <CalendarDays className="size-5 opacity-50" />
      </div>
      <h3 className="display-font mt-14 text-3xl leading-none">{title}</h3>
      <p className="mt-4 text-sm leading-6 opacity-65">{detail}</p>
      <div className="mt-8 flex items-center gap-2 border-t border-current/15 pt-4 text-xs font-bold">
        <Clock3 className="size-4" /> {time}
      </div>
    </article>
  );
}

function SermonCard({ sermon }: { sermon?: Sermon }) {
  if (!sermon) return null;
  return (
    <Link
      href={`/sermons/${sermon.slug}`}
      data-testid={`link-sermon-${sermon.title.toLowerCase().replaceAll(" ", "-")}`}
      className="group block"
    >
      <PhotoFrame
        src={sermon.image}
        alt=""
        frame="none"
        className="aspect-[1.28]"
      />
      <div className="border border-t-0 border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--card))] p-5">
        <p className="mono-label text-[9px] text-[hsl(var(--primary))]">
          Sunday service · {sermon.scripture}
        </p>
        <h3 className="mt-3 text-xl font-semibold">{sermon.title}</h3>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">
          Listen now <Play className="size-3 fill-current" />
        </span>
      </div>
    </Link>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribeNewsletter();
  const sent = subscribe.isSuccess;

  return (
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) subscribe.mutate({ data: { email } });
      }}
    >
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={sent ? "You’re on the list." : "Your email address"}
          disabled={sent || subscribe.isPending}
          data-testid="input-newsletter-email"
          className="min-w-0 flex-1 border border-[hsl(var(--foreground)/.18)] bg-[hsl(var(--card)/.6)] px-4 py-3 text-sm outline-none transition placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))]"
        />
        <button
          type="submit"
          disabled={sent || subscribe.isPending}
          data-testid="button-newsletter-submit"
          className="flex shrink-0 items-center gap-2 bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold text-white transition hover:bg-[hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sent ? <Check className="size-4" /> : <Send className="size-4" />}
          <span className="hidden sm:inline">
            {sent ? "Thank you" : subscribe.isPending ? "Joining…" : "Join us"}
          </span>
        </button>
      </div>
      {subscribe.isError && (
        <p
          role="alert"
          data-testid="text-newsletter-error"
          className="mt-2 text-sm font-semibold text-red-600"
        >
          That didn’t go through. Please try again in a moment.
        </p>
      )}
    </form>
  );
}

export default Home;
