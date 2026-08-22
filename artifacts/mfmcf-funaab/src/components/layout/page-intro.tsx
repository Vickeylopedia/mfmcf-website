import type { ReactNode } from "react";
import { Eyebrow } from "@/components/foundation";

export function PageIntro({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="site-grid border-b border-[hsl(var(--foreground)/.1)] px-5 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-32">
      <div className="mx-auto max-w-[1380px]">
        <Eyebrow weight="bold" className="reveal">
          {eyebrow}
        </Eyebrow>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_.7fr] lg:items-end">
          <h1 className="display-font max-w-3xl text-5xl leading-[.94] tracking-[-.04em] text-[hsl(var(--foreground))] sm:text-7xl lg:text-[7.5rem] reveal reveal-delay-1">
            {title}
          </h1>
          {intro && (
            <p className="max-w-md text-lg leading-7 text-[hsl(var(--muted-foreground))] reveal reveal-delay-2">
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
