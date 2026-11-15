"use client";
import { useParams, Link, Navigate, useNavigate } from "@/lib/router";
import { ChevronLeft, Clock, ArrowUp, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { modules, type ModuleSlug } from "@/data/modules";
import { toneBg, toneFg } from "@/lib/tones";

type Kind = "articles" | "stories" | "working-mothers-articles";

const ArticleStory = () => {
  const { slug, resource, index } = useParams<{ slug: ModuleSlug; resource: Kind; index: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation([slug || "core", "core"]);
  const data = slug ? modules[slug as ModuleSlug] : undefined;
  const i = Number(index);
  if (!data || (resource !== "articles" && resource !== "stories" && resource !== "working-mothers-articles") || isNaN(i))
    return <Navigate to="/" replace />;

  const isWorkingMothers = resource === "working-mothers-articles";
  const isArticle = resource === "articles" || isWorkingMothers;
  const list = isWorkingMothers
    ? (data.workingMothersArticles || [])
    : isArticle
    ? data.articles
    : data.stories;
  const item = list[i];
  if (!item) return <Navigate to={`/module/${slug}/${resource}`} replace />;

  const tone = (isWorkingMothers ? "rose" : isArticle ? "yellow" : "lilac") as keyof typeof toneBg;
  const accent = `hsl(var(--pastel-${tone}-fg))`;
  const accentSoft = `hsl(var(--pastel-${tone}))`;
  
  const keyPrefix = isWorkingMothers ? "working_mothers_articles" : resource;
  const fullHeading = (item as any).fullTitle || item.title || (item as any).name;
  const headingKey = isArticle ? `${keyPrefix}.${i}.full_title` : `stories.${i}.name`;
  const heading = t(headingKey, t(`${keyPrefix}.${i}.title`, fullHeading));
  const eyebrowKey = isWorkingMothers
    ? "core:resources.working_mothers_articles"
    : isArticle
    ? "core:resources.articles"
    : "core:resources.stories";
  const eyebrow = t(eyebrowKey);
  
  const summary = isArticle ? t(`${keyPrefix}.${i}.summary`, (item as any).summary) : undefined;
  const quote = !isArticle ? t(`stories.${i}.quote`, (item as any).quote) : undefined;

  const bodyLength = item.body.length;

  const words = item.body.join(" ").split(/\s+/).filter(Boolean).length;
  
  const mins = Math.max(2, Math.round(words / 220));
  const issueNo = String(i + 1).padStart(2, "0");

  // Next item for end-of-article CTA
  const nextIdx = (i + 1) % list.length;
  const nextItem = list[nextIdx];
  const nextFullHeading = nextItem ? ((nextItem as any).fullTitle || nextItem.title || (nextItem as any).name) : "";
  const nextTitleKey = isArticle ? `${keyPrefix}.${nextIdx}.full_title` : `stories.${nextIdx}.name`;
  const nextTitle = t(nextTitleKey, t(`${keyPrefix}.${nextIdx}.title`, nextFullHeading));

  return (
    <div className="min-h-screen bg-background">
      {/* Slim top bar */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[680px] items-center justify-between px-6 py-3 md:px-0">
          <button
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate(`/module/${slug}/${resource}`);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {eyebrow}
          </button>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/50">
            <span style={{ color: accent }}>{t("title")}</span>
            <span className="text-foreground/25">/</span>
            <span className="font-mono">№ {issueNo}</span>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header className="border-b border-border/60 animate-in fade-in">
        <div className="mx-auto max-w-[680px] px-6 pb-14 pt-16 md:px-0 md:pb-20 md:pt-24">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
            />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.32em]"
              style={{ color: accent }}
            >
              {eyebrow}
            </p>
            <span className="h-px flex-1" style={{ background: accent, opacity: 0.25 }} />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/45">
              {String(words).padStart(4, "0")} {t("core:common.words")}
            </p>
          </div>

          {/* Title — serif display */}
          <h1
            className="mt-8 font-serif text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground md:text-[64px] animate-in slide-up"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {heading}
          </h1>

          {/* Deck / standfirst */}
          {isArticle && (
            <p
              className="mt-6 max-w-[560px] font-serif text-[19px] leading-[1.5] text-foreground/65 md:text-[22px] animate-in slide-up stagger-1"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: "italic" }}
            >
              {summary}
            </p>
          )}

          {/* Byline / meta */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/60 pt-6 text-[12px] text-foreground/55 animate-in slide-up stagger-2">
            <div className="flex items-center gap-2.5">
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: accentSoft, color: accent }}
              >
                {t("title").charAt(0)}
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/45">
                  {t("core:common.curated_by")}
                </p>
                <p className="text-[13px] font-semibold text-foreground/80">
                  {t("core:common.the")} {t("title")} {t("core:common.library")}
                </p>
              </div>
            </div>
            <span className="hidden h-8 w-px bg-border md:block" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">{mins} {t("core:common.min_read")}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-[680px] px-6 py-16 md:px-0 md:py-24 animate-in slide-up stagger-2">
        <article>
          {quote && (
            <blockquote
              className="mb-12 border-l-2 pl-6 font-serif text-[24px] leading-[1.4] text-foreground/85 md:text-[28px] animate-in fade-in"
              style={{
                borderLeftColor: accent,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: "italic",
              }}
            >
              “{quote}”
            </blockquote>
          )}

          <div className="space-y-8">
            {Array.from({ length: bodyLength }).map((_, idx) => {
              const p = t(`${keyPrefix}.${i}.body.${idx}`, item.body[idx]);
              if (idx === 0 && !quote) {
                return (
                  <p
                    key={idx}
                    className="font-serif text-[19px] leading-[1.75] text-foreground/85 md:text-[20px]"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    <span
                      className="float-left mr-3 mt-2 font-serif text-[80px] font-semibold leading-[0.8]"
                      style={{
                        color: accent,
                        fontFamily: 'Georgia, "Times New Roman", serif',
                      }}
                    >
                      {p.charAt(0)}
                    </span>
                    {p.slice(1)}
                  </p>
                );
              }
              return (
                <p
                  key={idx}
                  className="font-serif text-[19px] leading-[1.75] text-foreground/85 md:text-[20px]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {p}
                </p>
              );
            })}
          </div>

          {/* End mark */}
          <div className="mt-14 flex items-center gap-4 animate-in fade-in">
            <span className="h-px flex-1 bg-border" />
            <span
              className="inline-block h-2 w-2 rotate-45"
              style={{ background: accent }}
            />
            <span className="h-px flex-1 bg-border" />
          </div>
        </article>

        {/* Footer / next-up */}
        <footer className="mt-16 space-y-8">
          {nextIdx !== i && (
            <Link
              to={`/module/${slug}/${resource}/read/${nextIdx}`}
              className="group block rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft md:p-8"
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: accent }}
              >
                {t("core:common.up_next")} · {eyebrow}
              </p>
              <div className="mt-3 flex items-start justify-between gap-6">
                <h3
                  className="font-serif text-[22px] font-semibold leading-snug tracking-tight text-foreground md:text-[26px]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {nextTitle}
                </h3>
                <div
                  className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-1"
                  style={{ background: accentSoft, color: accent }}
                >
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          )}

          <div className="mt-16 flex flex-col items-center animate-in slide-up stagger-3">
            <button
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate(`/module/${slug}/${resource}`);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("core:common.back_to")} {t(`core:resources.${resource}`)}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/40 transition-colors hover:text-foreground"
            >
              {t("core:common.back_to_top")}
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ArticleStory;
