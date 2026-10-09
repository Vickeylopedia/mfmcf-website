import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Share2, X } from "lucide-react";
import { useParams } from "wouter";
import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { useNews, type NewsView } from "@/lib/queries";
import { useDocumentTitle } from "@/hooks/use-document-title";

function ShareNewsModal({
  item,
  onClose,
}: {
  item: NewsView;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://mfmcf-website.pages.dev";
  const shareUrl = `${origin}/news?id=${item.id}`;

  // WhatsApp formatted share text: artwork preview link, bold title, writeup, and link
  const messageText = `*${item.title.trim()}*\n\n${item.body.trim()}\n\nFor more info, check out:\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleTelegram = () => {
    const telegramText = `*${item.title}*\n\n${item.body}\n\nFor more info:`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(telegramText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title}\n\n${item.body}\n\nFor more info, check out:`,
          url: shareUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopy();
    }
  };

  const canNativeShare =
    typeof navigator !== "undefined" && Boolean(navigator.share);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))] p-5 sm:p-6 shadow-[6px_6px_0px_hsl(var(--foreground))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[hsl(var(--foreground)/.15)] pb-3">
          <div>
            <span className="mono-label text-[10px] text-[hsl(var(--primary))] font-bold">
              SHARE WITH THE FAMILY
            </span>
            <h3 id="share-dialog-title" className="display-font text-xl font-bold leading-none">
              Share note
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="border-2 border-[hsl(var(--foreground))] bg-white p-1.5 text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Note preview card with artwork */}
        <div className="mt-4 border border-[hsl(var(--foreground)/.15)] bg-[hsl(var(--secondary)/.4)] p-3">
          {item.artwork && (
            <div className="mb-2.5 aspect-[16/9] w-full overflow-hidden border border-[hsl(var(--foreground)/.2)] bg-[hsl(var(--secondary))]">
              <img
                src={item.artwork}
                alt={item.title}
                className="size-full object-cover"
              />
            </div>
          )}
          <p className="font-bold text-sm leading-snug line-clamp-2">{item.title}</p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">
            {item.body}
          </p>
          <p className="mono-label mt-2 text-[9px] text-[hsl(var(--primary))] font-bold truncate">
            {shareUrl}
          </p>
        </div>

        {/* Share Action Buttons */}
        <div className="mt-4 grid gap-2.5">
          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex w-full items-center justify-between border-2 border-[hsl(var(--foreground))] bg-[#25D366] px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:brightness-105 active:translate-y-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.886 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share via WhatsApp
            </span>
            <span>→</span>
          </button>

          {/* Telegram Button */}
          <button
            type="button"
            onClick={handleTelegram}
            className="flex w-full items-center justify-between border-2 border-[hsl(var(--foreground))] bg-[#0088cc] px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:brightness-105 active:translate-y-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
              </svg>
              Share via Telegram
            </span>
            <span>→</span>
          </button>

          {/* Native Share if available */}
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex w-full items-center justify-between border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--foreground))] active:translate-y-0.5 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Share2 className="size-4" /> More sharing options…
              </span>
              <span>→</span>
            </button>
          )}

          {/* Copy Direct Link Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center justify-between border-2 border-[hsl(var(--foreground))] bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] active:translate-y-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {copied ? (
                <Check className="size-4 text-green-600" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Link copied to clipboard!" : "Copy direct note link"}
            </span>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
              {copied ? "✓ Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function News() {
  useDocumentTitle("Notes & Updates");
  const params = useParams<{ id?: string }>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [sharingItem, setSharingItem] = useState<NewsView | null>(null);
  const { news, isLoading } = useNews();
  const scrolledOnce = useRef(false);

  useEffect(() => {
    if (isLoading || !news.length || scrolledOnce.current) return;

    // Check route parameter /news/:id or query parameter /news?id=123
    const searchParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const targetIdStr = params?.id || searchParams?.get("id");

    if (targetIdStr) {
      const targetId = Number(targetIdStr);
      const index = news.findIndex((n) => n.id === targetId);
      if (index !== -1) {
        scrolledOnce.current = true;
        setOpenIndex(index);
        setHighlightId(targetId);

        setTimeout(() => {
          const el = document.getElementById(`news-item-${targetId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 180);
      }
    }
  }, [params?.id, news, isLoading]);

  // Dynamically update Open Graph meta tags when focused on an article
  useEffect(() => {
    if (!highlightId) return;
    const item = news.find((n) => n.id === highlightId);
    if (!item) return;

    document.title = `${item.title} | MFMCF FUNAAB`;

    const setMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("og:title", item.title);
    setMeta("og:description", item.body);
    if (item.artwork) {
      const fullArtUrl = item.artwork.startsWith("http")
        ? item.artwork
        : `${window.location.origin}${item.artwork}`;
      setMeta("og:image", fullArtUrl);
      setMeta("og:image:alt", item.title);
    }
  }, [highlightId, news]);

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
        intro="Reflections, gatherings, and the little updates that help us stay close between Sundays."
      />
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          {isLoading && (
            <p className="mono-label text-[10px]">Loading the notes…</p>
          )}
          {news.map((item, i) => {
            const open = openIndex === i;
            const isHighlighted = highlightId === item.id;
            return (
              <Reveal key={item.title} delay={Math.min(i, 2) * 100}>
                <article
                  id={`news-item-${item.id}`}
                  className={`grid gap-5 border-t border-[hsl(var(--foreground)/.18)] py-8 sm:grid-cols-[.28fr_1fr_.25fr] sm:gap-10 transition-colors duration-700 ${
                    isHighlighted ? "bg-[hsl(var(--accent)/.12)] -mx-3 px-3 rounded" : ""
                  }`}
                >
                  <div>
                    {item.artwork && (
                      <div className="mb-3 aspect-square w-16 overflow-hidden border border-[hsl(var(--foreground)/.15)] bg-[hsl(var(--secondary))] sm:w-full">
                        <img
                          src={item.artwork}
                          alt={item.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/assets/image_1787352840643.png";
                          }}
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
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        aria-expanded={open}
                        data-testid={`button-read-news-${i}`}
                        onClick={() => setOpenIndex(open ? null : i)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]"
                      >
                        {open ? "Close note" : "Read note"}{" "}
                        <ArrowUpRight
                          className={`size-4 transition-transform ${open ? "rotate-90" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSharingItem(item)}
                        data-testid={`button-share-news-${i}`}
                        className="inline-flex items-center gap-1.5 border border-[hsl(var(--foreground)/.2)] bg-white px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--foreground))] shadow-[1px_1px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] active:translate-y-0.5 cursor-pointer"
                      >
                        <Share2 className="size-3 text-[hsl(var(--primary))]" />
                        <span>Share note</span>
                      </button>
                    </div>
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

      {/* Share note modal dialog */}
      {sharingItem && (
        <ShareNewsModal
          item={sharingItem}
          onClose={() => setSharingItem(null)}
        />
      )}
    </Shell>
  );
}

export default News;
