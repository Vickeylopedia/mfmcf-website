import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Shell } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { PhotoFrame, SectionHeading } from "@/components/foundation";
import { useGallery } from "@/lib/queries";
import { photos } from "@/lib/site";

function Gallery() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0);
  const { gallery, isLoading } = useGallery();
  const filters = ["All", "Worship", "Community", "Teaching"];
  const shown = gallery.filter(
    (item) => filter === "All" || item.type === filter,
  );
  const safeActive = active >= shown.length ? 0 : active;
  const activeItem = shown[safeActive];
  const move = (direction: number) =>
    setActive(
      (current) => (current + direction + shown.length) % shown.length,
    );
  return (
    <Shell>
      <PageIntro
        eyebrow="Life together"
        ghost="FRAMES"
        title={
          <>
            Small moments.
            <br />
            <em className="font-normal">Big belonging.</em>
          </>
        }
        intro="A visual diary of the people, prayers, colour, and ordinary joy that make MFMCF FUNAAB feel like home."
      />
      <section className="gallery-cinema relative overflow-hidden bg-[hsl(var(--foreground))] px-5 py-14 text-white lg:px-10 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 z-0 size-[26rem] rounded-full bg-[hsl(var(--accent)/.18)] blur-[120px]"
        />
        <div className="relative z-10 mx-auto max-w-[1380px]">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <Reveal variant="left">
              <SectionHeading
                eyebrow="The family, in frames"
                eyebrowTone="accent"
                title={
                  <>
                    Stay for the
                    <br />
                    <em className="font-normal text-[hsl(var(--accent))]">
                      whole story.
                    </em>
                  </>
                }
                headingClassName="max-w-xl leading-[.92] tracking-[-.04em] sm:text-7xl"
              />
            </Reveal>
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="mono-label text-[9px] text-white/45">
                  Drag to explore
                </p>
                <p className="mt-1 text-xs text-white/60">
                  <span className="text-[hsl(var(--accent))]">
                    {String(safeActive + 1).padStart(2, "0")}
                  </span>{" "}
                  / {String(shown.length).padStart(2, "0")}
                </p>
              </div>
              <button
                type="button"
                aria-label="Previous photo story"
                data-testid="button-gallery-previous"
                onClick={() => move(-1)}
                className="flex size-11 items-center justify-center border border-white/25 text-white transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next photo story"
                data-testid="button-gallery-next"
                onClick={() => move(1)}
                className="flex size-11 items-center justify-center border border-white/25 text-white transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              >
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>
          <div
            className="gallery-rail mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pt-2"
            aria-label="Photo stories"
          >
            {shown.map((item, i) => (
              <button
                type="button"
                key={item.title}
                onClick={() => setActive(i)}
                data-testid={`button-gallery-story-${i}`}
                aria-label={`Show ${item.title}`}
                className={`gallery-card group relative min-w-[82vw] snap-center overflow-hidden text-left sm:min-w-[510px] lg:min-w-[620px] ${
                  i === safeActive ? "is-active" : ""
                }`}
              >
                <PhotoFrame
                  src={item.image}
                  alt={item.title}
                  frame="none"
                  shift={false}
                  className="gallery-card-image aspect-[1.18] bg-white/10 sm:aspect-[1.35]"
                />
                <div className="gallery-card-shade absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="mono-label text-[9px] text-[hsl(var(--accent))]">
                    {item.type} · 2026
                  </p>
                  <h3 className="display-font mt-3 max-w-md text-3xl leading-none sm:text-5xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                    {item.desc}
                  </p>
                </div>
                <span className="gallery-card-index absolute right-5 top-5 mono-label text-[9px] text-white/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2" aria-live="polite">
            {shown.map((item, i) => (
              <button
                type="button"
                key={item.title}
                aria-label={`Go to photo ${i + 1}`}
                data-testid={`button-gallery-dot-${i}`}
                onClick={() => setActive(i)}
                className={`h-1 transition-all ${
                  i === safeActive
                    ? "w-10 bg-[hsl(var(--accent))]"
                    : "w-3 bg-white/30 hover:bg-white/65"
                }`}
              />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-2 border-t border-white/15 pt-7">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                data-testid={`button-gallery-filter-${item.toLowerCase()}`}
                onClick={() => {
                  setFilter(item);
                  setActive(0);
                }}
                className={`border px-4 py-2 text-xs font-bold transition ${
                  filter === item
                    ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                    : "border-white/20 text-white/70 hover:border-white hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {activeItem?.title}
          </p>
        </div>
      </section>
    </Shell>
  );
}

export default Gallery;
