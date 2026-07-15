import { useEffect, useMemo, useState } from "react";
import {
  FaApple,
  FaBookOpen,
  FaCheck,
  FaEnvelope,
  FaGooglePlay,
  FaHouse,
  FaPlane,
  FaShieldHeart,
} from "react-icons/fa6";
import {
  landingCopy,
  privacyCopy,
  supportCopy,
  termsCopy,
} from "./siteData.js";

const base = import.meta.env.BASE_URL;
const asset = (path) => `${base}${path.replace(/^\//, "")}`;
const page = (path = "") => `${base}${path}`;

function useLanguage() {
  const initial = new URLSearchParams(window.location.search).get("lang");
  const [lang, setLang] = useState(initial === "en" ? "en" : "zh");

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant-HK" : "en";
  }, [lang]);

  return [lang, () => setLang((value) => (value === "zh" ? "en" : "zh"))];
}

function Brand({ compact = false }) {
  return (
    <span
      className={`brand ${compact ? "brand--compact" : ""}`}
      aria-label="廣得好 CanDuckGo"
    >
      <span className="brand__zh display-font">
        <span>廣</span>
        <span>得</span>
        <span>好</span>
      </span>
      <span className="brand__en">CanDuckGo</span>
    </span>
  );
}

function LanguageButton({ lang, onToggle }) {
  return (
    <button
      type="button"
      className="pill-button lang-button"
      onClick={onToggle}
      aria-label={lang === "zh" ? "Switch to English" : "切換至繁體中文"}
    >
      {lang === "zh" ? "EN" : "中"}
    </button>
  );
}

function Voxel({ model, anim, className = "", label }) {
  return (
    <voxel-prop
      model={model}
      anim={anim}
      class={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    />
  );
}

function LandingNav({ t, lang, toggleLang }) {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <a href="#top" className="brand-link">
        <Brand />
      </a>
      <div className="nav-links">
        <a href="#features">{t.navFeatures}</a>
        <a href="#map">{t.navMap}</a>
        <a href="#parents">{t.navParents}</a>
        <a href="#faq">FAQ</a>
      </div>
      <LanguageButton lang={lang} onToggle={toggleLang} />
      <a className="cta-button nav-cta" href="#stores">
        {t.navCta}
      </a>
    </nav>
  );
}

function StoreBadges() {
  return (
    <div className="store-badges" aria-label="App stores, coming soon">
      <div className="store-badge">
        <FaApple aria-hidden="true" />
        <span>
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </div>
      <div className="store-badge">
        <FaGooglePlay aria-hidden="true" />
        <span>
          <small>GET IT ON</small>
          <strong>Google Play</strong>
        </span>
      </div>
    </div>
  );
}

function Hero({ t }) {
  return (
    <>
      <header id="top" className="hero">
        <div className="pixel-cloud pixel-cloud--one" />
        <div className="pixel-cloud pixel-cloud--two" />
        <div className="pixel-cloud pixel-cloud--three" />
        <span className="twinkle twinkle--one" />
        <span className="twinkle twinkle--two" />
        <div className="hero__copy reveal">
          <Voxel model="shootingstar" className="hero__star" />
          <p className="kicker">{t.heroKicker}</p>
          <h1 className="hero-logo display-font">
            <span>廣</span>
            <span>得</span>
            <span>好</span>
          </h1>
          <p className="hero-wordmark">CanDuckGo</p>
          <p className="hero-sub">{t.heroSub}</p>
          <div className="trust-chips">
            <span>
              <FaCheck />
              {t.chipFree}
            </span>
            <span>
              <FaCheck />
              {t.chipNoAds}
            </span>
            <span>
              <FaCheck />
              {t.chipOffline}
            </span>
          </div>
          <p id="stores" className="soon-label">
            {t.badgeSoonTop}
          </p>
          <StoreBadges />
        </div>
        <div className="hero__visual reveal reveal--delay">
          <div className="screenshot-frame hero-frame">
            <img
              src={asset("assets/screens/02-map.png")}
              alt="CanDuckGo theme-island learning map"
            />
          </div>
        </div>
        <Voxel
          model="duck"
          anim="idle"
          className="hero__duck"
          label="CanDuckGo voxel duck mascot"
        />
      </header>
      <div className="pixel-grass" />
      <div className="pixel-earth" />
    </>
  );
}

function Belief({ t }) {
  const stats = [
    ["4", t.stat1],
    ["300+", t.stat2],
    ["100+", t.stat3],
    ["30", t.stat4],
  ];
  return (
    <section className="belief section-pad">
      <div className="belief__grid reveal-on-scroll">
        <div className="duck-card">
          <Voxel model="duck" anim="cheer" label="Cheering CanDuckGo mascot" />
          <span className="twinkle" />
          <p>{t.spinHint}</p>
        </div>
        <div>
          <p className="kicker kicker--gold">{t.beliefKicker}</p>
          <h2>{t.beliefTitle}</h2>
          <p className="section-copy">{t.beliefBody}</p>
          <div className="stats">
            {stats.map(([number, label], index) => (
              <div key={label}>
                <strong className={`accent-${index + 1}`}>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features({ t }) {
  const cards = [
    ["headphones", t.f2Title, t.f2Body, "yellow"],
    ["cards", t.f3Title, t.f3Body, "blue"],
    ["album", t.f4Title, t.f4Body, "purple"],
  ];
  return (
    <section id="features" className="features section-pad">
      <div className="section-shell">
        <div className="section-heading">
          <p className="kicker">{t.featKicker}</p>
          <h2>{t.featTitle}</h2>
        </div>
        <article className="feature-main reveal-on-scroll">
          <div className="feature-main__copy">
            <div className="voxel-icon voxel-icon--mint">
              <Voxel model="brush" />
            </div>
            <h3>{t.f1Title}</h3>
            <p>{t.f1Body}</p>
          </div>
          <div className="feature-main__image">
            <img
              src={asset("assets/screens/07-trace-step.png")}
              alt="CanDuckGo stroke tracing lesson"
            />
          </div>
        </article>
        <div className="feature-cards">
          {cards.map(([model, title, body, color]) => (
            <article
              className={`feature-card feature-card--${color} reveal-on-scroll`}
              key={title}
            >
              <Voxel model={model} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningMap({ t }) {
  return (
    <section id="map" className="learning-map section-pad">
      <div className="map-cloud map-cloud--one" />
      <div className="map-cloud map-cloud--two" />
      <div className="section-shell">
        <div className="section-heading section-heading--light">
          <p className="kicker">{t.mapKicker}</p>
          <h2>{t.mapTitle}</h2>
          <p>{t.mapBody}</p>
        </div>
        <div className="stage-grid">
          {t.stages.map(([badge, title, body], i) => (
            <article className={`stage-card stage-card--${i + 1}`} key={badge}>
              <Voxel model={`medal${i + 1}`} />
              <span className="stage-badge display-font">{badge}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="themes-label">{t.themesLabel}</p>
        <div className="theme-chips">
          {t.themes.map((theme) => (
            <span className="display-font" key={theme}>
              {theme}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Screenshots({ t }) {
  const files = [
    "01-title",
    "02-map",
    "03-stickers",
    "04-sticker-modal",
    "05-levels",
    "06-trace-demo",
    "07-trace-step",
    "08-report",
  ];
  return (
    <section className="screens section-pad">
      <div className="section-heading">
        <p className="kicker">{t.shotsKicker}</p>
        <h2>{t.shotsTitle}</h2>
      </div>
      <div className="shot-strip">
        {files.map((file, i) => (
          <figure key={file}>
            <div>
              <img
                src={asset(`assets/screens/${file}.png`)}
                alt={`${t.shotCaps[i]} — CanDuckGo game screenshot`}
                loading="lazy"
              />
            </div>
            <figcaption>{t.shotCaps[i]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const parentIcons = [FaShieldHeart, FaHouse, FaPlane, FaBookOpen];
function Parents({ t }) {
  return (
    <section id="parents" className="parents section-pad">
      <div className="parents__grid">
        <div>
          <p className="kicker kicker--gold">{t.parentKicker}</p>
          <h2>{t.parentTitle}</h2>
          <div className="parent-list">
            {t.parents.map(([title, body], i) => {
              const Icon = parentIcons[i];
              return (
                <article key={title}>
                  <span>
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <figure className="report-card">
          <div className="screenshot-frame">
            <img
              src={asset("assets/screens/08-report.png")}
              alt="CanDuckGo parent learning report"
              loading="lazy"
            />
          </div>
          <figcaption>{t.parentCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Pricing({ t }) {
  return (
    <section className="pricing section-pad">
      <article className="price-card">
        <span className="price-tag">{t.priceKicker}</span>
        <p className="price">HK$0</p>
        <h2>{t.priceTitle}</h2>
        <p>{t.priceBody}</p>
        <div>
          {t.priceChips.map((chip) => (
            <span key={chip}>
              <FaCheck />
              {chip}
            </span>
          ))}
        </div>
      </article>
    </section>
  );
}

function FAQ({ t }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="faq section-pad">
      <div className="section-shell">
        <div className="section-heading">
          <p className="kicker">FAQ</p>
          <h2>{t.faqTitle}</h2>
        </div>
        <div className="faq-list">
          {t.faqs.map(([question, answer], index) => (
            <article className={open === index ? "is-open" : ""} key={question}>
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                aria-expanded={open === index}
              >
                <span>{open === index ? "−" : "+"}</span>
                {question}
              </button>
              {open === index && <p>{answer}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer__main">
        <Voxel model="duck" anim="cheer" label="Cheering CanDuckGo mascot" />
        <div>
          <h2>{t.footTitle}</h2>
          <p>{t.footSub}</p>
          <a className="cta-button" href="#stores">
            {t.footCta}
          </a>
          <nav aria-label="Footer">
            <a href={page("support/")}>{t.footSupport}</a>
            <a href={page("privacy/")}>{t.footPrivacy}</a>
            <a href={page("terms/")}>{t.footTerms}</a>
          </nav>
        </div>
      </div>
      <div className="footer__meta">
        <Brand compact />
        <p>{t.footCredits}</p>
        <p>© 2026 CanDuckGo</p>
      </div>
    </footer>
  );
}

function LandingPage() {
  const [lang, toggleLang] = useLanguage();
  const t = landingCopy[lang];
  useEffect(() => {
    document.title =
      lang === "zh"
        ? "廣得好 CanDuckGo — 廣東話筆劃學習遊戲"
        : "CanDuckGo — Learn traditional Chinese in Cantonese";
  }, [lang]);
  return (
    <div className="site">
      <LandingNav t={t} lang={lang} toggleLang={toggleLang} />
      <Hero t={t} />
      <Belief t={t} />
      <Features t={t} />
      <LearningMap t={t} />
      <Screenshots t={t} />
      <Parents t={t} />
      <Pricing t={t} />
      <FAQ t={t} />
      <Footer t={t} />
    </div>
  );
}

function SubpageNav({ t, lang, toggleLang }) {
  return (
    <nav className="sub-nav">
      <a href={page()}>
        <Brand />
      </a>
      <a className="back-button" href={page()}>
        <span aria-hidden="true">←</span>
        {t.back}
      </a>
      <LanguageButton lang={lang} onToggle={toggleLang} />
    </nav>
  );
}

function LegalPage({ kind }) {
  const [lang, toggleLang] = useLanguage();
  const data = kind === "privacy" ? privacyCopy : termsCopy;
  const t = data[lang];
  useEffect(() => {
    document.title = `${t.title} — 廣得好 CanDuckGo`;
  }, [t.title]);
  return (
    <div className="subpage">
      <SubpageNav t={t} lang={lang} toggleLang={toggleLang} />
      <main className="legal-main">
        <h1>{t.title}</h1>
        <p className="updated">{t.updated}</p>
        {t.summary && <div className="legal-summary">{t.summary}</div>}
        {t.sections.map(([heading, body]) => (
          <section className="legal-card" key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
        <p className="contact-line">
          {t.contactLine}{" "}
          <a href="mailto:support@canduckgo.com">support@canduckgo.com</a>
        </p>
      </main>
    </div>
  );
}

function SupportPage() {
  const [lang, toggleLang] = useLanguage();
  const t = supportCopy[lang];
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: 0,
    message: "",
  });
  useEffect(() => {
    document.title = `${t.title} — 廣得好 CanDuckGo`;
  }, [t.title]);
  const set = (key) => (event) =>
    setForm((old) => ({ ...old, [key]: event.target.value }));
  const send = (event) => {
    event.preventDefault();
    const subject = `[CanDuckGo Support] ${t.topics[form.topic]}${form.name ? ` — ${form.name}` : ""}`;
    const body = `${form.message}\n\n—\n${form.name}${form.email ? ` <${form.email}>` : ""}`;
    window.location.href = `mailto:support@canduckgo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <div className="subpage">
      <SubpageNav t={t} lang={lang} toggleLang={toggleLang} />
      <main className="support-main">
        <h1>{t.title}</h1>
        <p className="support-intro">{t.intro}</p>
        <div className="support-links">
          <a href={`${page()}#faq`}>
          <strong>{t.faqTitle}</strong>
            <span>{t.faqBody}</span>
          </a>
          <a href="mailto:support@canduckgo.com">
          <strong>{t.emailTitle}</strong>
            <span>support@canduckgo.com</span>
          </a>
        </div>
        <form onSubmit={send} className="support-form">
          <h2>{t.formTitle}</h2>
          <p>{t.formNote}</p>
          <div className="form-grid">
            <label>
              {t.fName}
              <input
                value={form.name}
                onChange={set("name")}
                placeholder={t.fNamePh}
              />
            </label>
            <label>
              {t.fEmail}
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder={t.fEmailPh}
              />
            </label>
          </div>
          <label>
            {t.fTopic}
            <select value={form.topic} onChange={set("topic")}>
              {t.topics.map((topic, i) => (
                <option value={i} key={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.fMsg}
            <textarea
              required
              value={form.message}
              onChange={set("message")}
              placeholder={t.fMsgPh}
              rows="6"
            />
          </label>
          <button className="cta-button" type="submit">
            <FaEnvelope />
            {t.fSend}
          </button>
        </form>
        <p className="contact-line">
          {t.links} <a href={page("privacy/")}>{t.privacyLink}</a> ·{" "}
          <a href={page("terms/")}>{t.termsLink}</a>
        </p>
      </main>
    </div>
  );
}

export function App() {
  const route = useMemo(
    () => window.location.pathname.replace(/\/+$/, "").split("/").pop(),
    [],
  );
  if (route === "privacy") return <LegalPage kind="privacy" />;
  if (route === "terms") return <LegalPage kind="terms" />;
  if (route === "support") return <SupportPage />;
  return <LandingPage />;
}
