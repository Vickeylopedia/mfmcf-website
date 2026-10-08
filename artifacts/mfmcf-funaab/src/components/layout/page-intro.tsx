import type { ReactNode } from "react";
import { Eyebrow } from "@/components/foundation";
import { Reveal } from "@/components/reveal";

export function PageIntro({
  eyebrow,
  title,
  intro,
  ghost,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  /** Oversized editorial word printed behind the section. */
  ghost?: string;
  children?: ReactNode;
}) {
  return (
    <section className="site-grid relative overflow-hidden border-b border-[hsl(var(--foreground)/.1)] px-5 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-32">
      {ghost && (
        <span
          aria-hidden="true"
          className="ghost-word -bottom-8 left-0 hidden md:block"
        >
          {ghost}
        </span>
      )}
      <div className="mx-auto max-w-[1380px]">
        <Reveal variant="up">
          <Eyebrow weight="bold">{eyebrow}</Eyebrow>
        </Reveal>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_.7fr] lg:items-end">
          <Reveal variant="up" delay={100}>
            <h1 className="display-font max-w-3xl text-5xl leading-[.94] tracking-[-.04em] text-[hsl(var(--foreground))] sm:text-7xl lg:text-[7.5rem]">
              {title}
            </h1>
          </Reveal>
          {intro && (
            <Reveal variant="up" delay={180}>
              <p className="max-w-md text-lg leading-7 text-[hsl(var(--muted-foreground))]">
                {intro}
              </p>
            </Reveal>
          )}
        </div>
        {children && (
          <Reveal variant="up" delay={260}>
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}
