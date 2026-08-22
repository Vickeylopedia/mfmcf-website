import { useState } from "react";
import {
  ArrowDownRight,
  CalendarDays,
  Check,
  Clock3,
  Play,
  Quote,
  Send,
  Sparkles,
} from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { photos } from "@/lib/site";

function Home() {
  return (
    <Shell>
      <section className="home-hero relative overflow-hidden bg-[hsl(var(--primary))] px-5 pb-16 pt-16 text-white lg:px-10 lg:pb-24 lg:pt-24">
        <div className="home-orbit pointer-events-none absolute -right-32 -top-40 size-[32rem] rounded-full border border-white/10" />
        <div className="home-orbit home-orbit-small pointer-events-none absolute -right-16 -top-24 size-[25rem] rounded-full border border-white/10" />
        <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div className="relative z-10 reveal">
            <p className="mono-label text-[10px] text-[hsl(var(--accent))]">
              Mountain of Fire & Miracles Campus Fellowship
            </p>
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
              <ButtonLink href="/contact" inverted>
                Plan your first visit
              </ButtonLink>
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
          <div className="relative min-h-[420px] reveal reveal-delay-2 sm:min-h-[560px]">
            <div className="hero-photo-main absolute right-0 top-0 h-[76%] w-[78%] overflow-hidden border-8 border-[hsl(var(--primary))] bg-white/10 shadow-2xl">
              <img
                src={photos.gathering}
                alt="Students gathered during a Sunday service"
                className="photo-shift h-full w-full object-cover"
                data-testid="img-home-hero"
              />
            </div>
            <div className="hero-photo-secondary absolute bottom-0 left-0 h-[54%] w-[58%] overflow-hidden border-8 border-[hsl(var(--primary))] bg-white/10">
              <img
                src={photos.joy}
                alt="Three fellowship members smiling together"
                className="photo-shift h-full w-full object-cover"
              />
            </div>
            <div className="hero-info-card absolute bottom-10 right-0 border border-white/30 bg-[hsl(var(--foreground))] px-5 py-4 text-white shadow-xl sm:bottom-16 sm:px-7">
              <p className="mono-label text-[9px] text-[hsl(var(--accent))]">
                This Sunday
              </p>
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
          <div>
            <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
              Our north star
            </p>
            <h2 className="display-font mt-5 max-w-md text-5xl leading-[.96] tracking-[-.035em] sm:text-6xl">
              A family that makes room.
            </h2>
          </div>
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
        </div>
      </section>
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                A week with us
              </p>
              <h2 className="display-font mt-4 text-5xl leading-none tracking-[-.035em] sm:text-6xl">
                There’s a place
                <br />
                in the rhythm.
              </h2>
            </div>
            <ButtonLink href="/contact">See where to find us</ButtonLink>
          </div>
          <div className="mt-12 grid gap-px border border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--foreground)/.12)] md:grid-cols-3">
            <EventCard
              day="SUN"
              title="Sunday Gathering"
              detail="A full-hearted service for the week ahead."
              time="9:00 AM"
            />
            <EventCard
              day="WED"
              title="Midweek Recharge"
              detail="Scripture, prayer, and the questions in between."
              time="5:00 PM"
            />
            <EventCard
              day="FRI"
              title="Family Hangout"
              detail="A softer landing after a long campus week."
              time="4:30 PM"
            />
          </div>
        </div>
      </section>
      <section className="bg-[hsl(var(--secondary))] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                From the archive
              </p>
              <h2 className="display-font mt-4 text-5xl leading-[.94] tracking-[-.04em] sm:text-6xl">
                God still
                <br />
                <em className="font-normal">speaks.</em>
              </h2>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <SermonCard
                title="The grace called favour"
                date="Sunday service · Psalm 5:12"
                image={photos.word}
              />
              <SermonCard
                title="Life-giving spirits"
                date="Sunday service · 1 Cor 15:45"
                image={photos.worship}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-[hsl(var(--foreground))] px-5 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <Quote className="size-9 text-[hsl(var(--accent))]" />
            <p className="display-font mt-7 max-w-4xl text-5xl leading-[.98] tracking-[-.03em] sm:text-7xl">
              You do not have to have it all together before you belong.
            </p>
            <p className="mt-8 text-sm text-white/55">
              — A note from one of our family meetings
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="aspect-[4/5] overflow-hidden border-8 border-[hsl(var(--foreground))]">
              <img
                src={photos.prayer}
                alt="Students in a moment of prayer"
                className="photo-shift h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-[hsl(var(--accent))] px-5 py-4 text-[hsl(var(--foreground))]">
              <p className="mono-label text-[9px]">Family of Love</p>
              <p className="mt-1 text-sm font-bold">A place to be known.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="site-grid px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-8 border-y border-[hsl(var(--foreground)/.14)] py-10 sm:flex-row sm:items-center">
          <div>
            <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
              Keep in touch
            </p>
            <h2 className="display-font mt-3 text-4xl tracking-[-.03em] sm:text-5xl">
              The good stuff, occasionally.
            </h2>
          </div>
          <NewsletterForm />
        </div>
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
    <article className="bg-[hsl(var(--card))] p-6 transition hover:bg-[hsl(var(--primary))] hover:text-white sm:p-8">
      <div className="flex items-start justify-between">
        <span className="mono-label text-[10px] text-[hsl(var(--primary))]">
          {day}
        </span>
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

function SermonCard({
  title,
  date,
  image,
}: {
  title: string;
  date: string;
  image: string;
}) {
  return (
    <Link
      href="/sermons"
      data-testid={`link-sermon-${title.toLowerCase().replaceAll(" ", "-")}`}
      className="group block"
    >
      <div className="aspect-[1.28] overflow-hidden">
        <img src={image} alt="" className="photo-shift h-full w-full object-cover" />
      </div>
      <div className="border border-t-0 border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--card))] p-5">
        <p className="mono-label text-[9px] text-[hsl(var(--primary))]">{date}</p>
        <h3 className="mt-3 text-xl font-semibold">{title}</h3>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">
          Listen now <Play className="size-3 fill-current" />
        </span>
      </div>
    </Link>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setSent(true);
      }}
    >
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
        disabled={sent}
        data-testid="input-newsletter-email"
        className="min-w-0 flex-1 border border-[hsl(var(--foreground)/.18)] bg-[hsl(var(--card)/.6)] px-4 py-3 text-sm outline-none transition placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))]"
      />
      <button
        type="submit"
        disabled={sent}
        data-testid="button-newsletter-submit"
        className="flex shrink-0 items-center gap-2 bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold text-white transition hover:bg-[hsl(var(--foreground))]"
      >
        {sent ? <Check className="size-4" /> : <Send className="size-4" />}
        <span className="hidden sm:inline">{sent ? "Thank you" : "Join us"}</span>
      </button>
    </form>
  );
}

export default Home;
