"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { YANDEX_METRIKA_ID } from "./site-config";

const TG_CONTACT = "https://t.me/mvkhid";

function tgLink(text: string) {
  return `${TG_CONTACT}?text=${encodeURIComponent(text)}`;
}

function Reveal({
  children,
  delay,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay * 0.15}s` } : undefined}
    >
      {children}
    </div>
  );
}

type FaqEntry = { q: string; a: string };

type LimitsGroup = { t: string; d: string };

function LimitsAccordion({
  title,
  groups,
  source,
}: {
  title: string;
  groups: LimitsGroup[];
  source: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="limits-accordion">
      <button
        type="button"
        className="limits-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="label">
          <span className="spec-icon">🧾</span>
          {title}
        </span>
        <span className={`limits-chevron${open ? " open" : ""}`}>+</span>
      </button>
      <div className={`limits-panel-wrap${open ? " open" : ""}`}>
        <div className="limits-panel-inner">
          <div className="limits-panel">
            {groups.map((g) => (
              <div className="limits-card" key={g.t}>
                <b>{g.t}</b>
                <span>{g.d}</span>
              </div>
            ))}
            <p className="limits-source">{source}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { href: "#process", label: "Как это работает" },
  { href: "#policy", label: "Политика" },
  { href: "#trust", label: "Доверие" },
  { href: "#faq", label: "FAQ" },
];

function HeaderNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="header-actions">
        <nav className="header-nav">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#selector" className="header-cta">
          Выбрать карту
        </a>
        <button
          type="button"
          className={`header-burger${open ? " open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Меню"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {open && (
        <div className="header-mobile-menu">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="#selector"
            className="header-mobile-cta"
            onClick={() => setOpen(false)}
          >
            Выбрать карту
          </a>
        </div>
      )}
    </>
  );
}

function FaqList({ items }: { items: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={item.q} className={`faq-item${open === i ? " open" : ""}`}>
          <button
            className="faq-q"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-a-wrap">
            <div className="faq-a-inner">
              <div className="faq-a">{item.a}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const COOKIE_CONSENT_KEY = "cookie-consent";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — skip the banner rather than break the page
    }
  }, []);

  function choose(value: "accepted" | "necessary") {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      // ignore — nothing to persist to
    }
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Уведомление о cookies">
      <p>
        Сайт использует cookies для работы и аналитики — подробнее в{" "}
        <a href="/privacy">политике обработки данных</a>.
      </p>
      <div className="cookie-actions">
        <button
          type="button"
          className="cookie-btn cookie-btn-necessary"
          onClick={() => choose("necessary")}
        >
          Только необходимые
        </button>
        <button
          type="button"
          className="cookie-btn cookie-btn-accept"
          onClick={() => choose("accepted")}
        >
          Принять
        </button>
      </div>
    </div>
  );
}

function YandexMetrika() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function check() {
      try {
        setEnabled(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
      } catch {
        // localStorage unavailable — leave analytics off
      }
    }
    check();
    window.addEventListener("cookie-consent-changed", check);
    return () => window.removeEventListener("cookie-consent-changed", check);
  }, []);

  if (!enabled || !YANDEX_METRIKA_ID) return null;

  return (
    <>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${YANDEX_METRIKA_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });`,
        }}
      />
      <noscript>
        <img
          src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </noscript>
    </>
  );
}

const problemCards = [
  {
    title: "Карты не принимают",
    text: "Visa и Mastercard российских банков отклоняются на любых иностранных платформах с 2022 года.",
  },
  {
    title: "Apple Pay отключён",
    text: "Бесконтактная оплата через iPhone не работает. iCloud и Apple ID — не оплатить напрямую.",
  },
  {
    title: "Друзья за границей",
    text: "Просить кого-то каждый раз — неудобно. То карта истекла, то что-то отвалилось.",
  },
  {
    title: "Посредники",
    text: "Переплата в 2–3 раза. Аккаунт могут забрать в любой момент. Никаких гарантий.",
  },
];

const compareRows: { label: string; kz: string; cis: string; crypto: string }[] = [
  {
    label: "Обслуживание",
    kz: "Бесплатно",
    cis: "~20–300 $/год",
    crypto: "Бесплатно",
  },
  {
    label: "Срок действия",
    kz: "5 лет",
    cis: "3–5 лет",
    crypto: "3 года",
  },
  {
    label: "Оформление",
    kz: "Удалённо, без вылета",
    cis: "10–28 дней, доки по шаблону",
    crypto: "~30 минут онлайн",
  },
  {
    label: "Риск потери доступа",
    kz: "Свой счёт — риски минимальны",
    cis: "Свой счёт — риски минимальны",
    crypto: "Зависит от биржи",
  },
];

const faqItems: FaqEntry[] = [
  {
    q: "Это законно?",
    a: "Получение и использование крипто-карты и счёта в банке Казахстана не запрещено. Вы сами отвечаете за соблюдение законодательства, включая налоговые обязательства.",
  },
  {
    q: "Сколько занимает оформление?",
    a: "Крипто-карта — около 30 минут. Банк Казахстана — 1–2 дня.",
  },
  {
    q: "А если банк или биржа откажут?",
    a: "Верну комиссию за сопровождение. Пошлины и сторонние платежи не возвращаются — подробнее в разделе «Политика» выше.",
  },
  {
    q: "Как проходит оплата и оформление?",
    a: "Пишете в Telegram, обсуждаем детали и сроки, дальше сопровождаю на каждом этапе — от заявки до получения доступа.",
  },
  {
    q: "Можно ли гарантировать условия на будущее?",
    a: "Статус по гос.программе Казахстана, по подтверждению банка, бессрочный — продлевать его не нужно. А вот тарифы и условия самого банка или биржи (лимиты, комиссии) могут меняться по их собственному решению — как у любого финансового продукта.",
  },
  {
    q: "Вы видите мои паспортные данные или пароли от биржи?",
    a: "Нет. Все данные — паспорт, регистрацию на бирже — вы вводите сами, напрямую на сайте банка или биржи. Я подсказываю на каждом шаге, но сам эти данные не запрашиваю и ко мне они не попадают — подробнее в политике обработки данных.",
  },
  {
    q: "Нужно ли лично ехать в Казахстан или в офис биржи?",
    a: "Нет, всё оформление дистанционное — из дома, через переписку в Telegram и сайты банка/биржи.",
  },
  {
    q: "Можно оформить обе карты сразу?",
    a: "Да, крипто-карту и счёт в Казахстане можно оформить одновременно или по очереди — это два независимых процесса.",
  },
  {
    q: "Мне не нужна карта — можно просто оплатить ChatGPT, Claude или другой зарубежный сервис?",
    a: "Да, это отдельная услуга — разовая оплата конкретного сервиса, картой заниматься не нужно. Удобно, когда карта пока не требуется, а нужен только доступ к сервису.",
  },
  {
    q: "Сколько стоит разовая оплата сервиса и как это происходит?",
    a: "Стоимость не фиксирована на сайте и обсуждается индивидуально в Telegram под конкретный сервис. Пишете, что нужно оплатить, — обсуждаем детали, стоимость и сроки, дальше оплачиваю сервис.",
  },
  {
    q: "Что если возникнут проблемы уже после оформления?",
    a: "Пишите в Telegram — консультация не заканчивается в день получения карты или счёта, помогу разобраться.",
  },
];

export default function Home() {
  return (
    <>
      {/* HEADER */}
      <div className="header">
        <div className="wrap header-inner">
          <div className="logo">Карты за рубежом</div>
          <HeaderNav />
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hub-wrap">
          <div className="hub-grid" />
          <svg
            className="hub-svg"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            role="img"
            aria-label="Точка входа наверху, от неё расходятся лучи к крипто-карте слева, счёту в Казахстане справа и погашенный луч по центру — место под будущую карту"
          >
            <defs>
              <filter id="hubblur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>
            <line x1="500" y1="46" x2="230" y2="200" stroke="#F7A600" strokeWidth="1.6" strokeDasharray="3 7" opacity="0.55" />
            <line x1="500" y1="46" x2="770" y2="200" stroke="#4A90A4" strokeWidth="1.6" strokeDasharray="3 7" opacity="0.55" />
            <line x1="500" y1="46" x2="500" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 8" opacity="0.18" />
            <circle cx="230" cy="200" r="28" fill="#F7A600" opacity="0.18" filter="url(#hubblur)" />
            <circle cx="770" cy="200" r="28" fill="#4A90A4" opacity="0.18" filter="url(#hubblur)" />
            <circle cx="500" cy="46" r="30" fill="currentColor" opacity="0.09" filter="url(#hubblur)" />
            <circle className="hub-node-dot bybit" cx="230" cy="200" r="6.5" fill="#F7A600" />
            <circle className="hub-node-dot freedom" cx="770" cy="200" r="6.5" fill="#4A90A4" />
            <circle cx="500" cy="150" r="4.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="2 3" />
            <circle cx="500" cy="46" r="7" fill="currentColor" />
          </svg>
          <div className="hero-cards">
            <div className="hero-card bybit">
              <div className="mc-top">
                <div className="mc-chip" />
                <div className="mc-brand">CRYPTO</div>
              </div>
              <div className="mc-number">•••• 7042</div>
              <div className="mc-bottom">
                <div />
                <div className="mc-network">mastercard</div>
              </div>
            </div>
            <div className="hero-card freedom">
              <div className="mc-top">
                <div className="mc-chip" />
                <div className="mc-brand">KAZAKHSTAN</div>
              </div>
              <div className="mc-number">•••• 3819</div>
              <div className="mc-bottom">
                <div />
                <div className="mc-network">visa</div>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="hero-label">карты и счета за рубежом</div>
          <h1>
            Дистанционное оформление
            <br />
            <span>зарубежных карт</span>
          </h1>
          <p className="hero-sub">
            Крипто-карта — для оплаты сервисов и подписок.{" "}
            <br />
            Банковский счёт в Казахстане — полноценный, мультивалютный.{" "}
            <br />
            Оформляю лично и удалённо —{" "}
            <span className="text-hl">без переплат посредникам</span>.
          </p>
          <a href="#selector" className="hero-btn">
            Выбрать карту
          </a>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="highlights-section">
        <div className="wrap">
          <div className="highlights-grid">
            {[
              {
                icon: "🔒",
                t: "Ваши данные — только у вас",
                d: (
                  <>
                    Паспорт и данные биржи вводите сами, я их{" "}
                    <span className="text-hl">не вижу и не храню</span>
                  </>
                ),
              },
              {
                icon: "⚡",
                t: "Быстро",
                d: "Крипто-карта — от 30 минут, счёт в Казахстане — 1–2 дня",
              },
              {
                icon: "✅",
                t: "Официально",
                d: "Лицензированная биржа и государственная программа Казахстана, без серых схем",
              },
              {
                icon: "💬",
                t: "Личное сопровождение",
                d: "Веду вас онлайн от консультации до открытия счёта или карты",
              },
            ].map((h, i) => (
              <Reveal key={h.t} delay={i + 1} className="highlight-tile">
                <div className="highlight-icon">{h.icon}</div>
                <b>{h.t}</b>
                <span>{h.d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <div className="section">
        <div className="wrap">
          <div className="section-label">Проблема</div>
          <h2 className="section-title section-title-only">
            Почему нужна карта за пределами РФ
          </h2>

          <div className="problem-grid">
            {problemCards.map((card, i) => (
              <Reveal key={card.title} delay={i + 1} className="problem-card">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* SELECTOR */}
      <div className="section section-watermarked" id="selector">
        <div className="card-watermark bybit" aria-hidden="true" />
        <div className="card-watermark freedom" aria-hidden="true" />
        <div className="wrap">
          <div className="section-label">Выбор</div>
          <h2 className="section-title">Какая карта нужна?</h2>
          <p className="section-sub">
            Сравните ключевые фишки и цену — оформляйте сразу или сначала
            почитайте детали
          </p>

          <div className="selector-grid">
            <Reveal delay={1}>
              <div className="selector-card">
                <div className="mockcard bybit-card">
                  <div className="mc-top">
                    <div className="mc-chip" />
                    <div className="mc-brand">CRYPTO</div>
                  </div>
                  <div className="mc-number">•••• 7042</div>
                  <div className="mc-bottom">
                    <div className="mc-holder">Cardholder</div>
                    <div className="mc-network">mastercard</div>
                  </div>
                </div>
                <div className="selector-card-question">
                  Нужен просто способ платить за сервисы
                </div>
                <div className="selector-card-answer">Крипто-карта</div>
                <p className="selector-card-audience">
                  Фрилансерам, айтишникам и всем, кто платит за подписки и
                  сервисы — без переплат посредникам
                </p>
                <div className="selector-card-specs">
                  <div className="selector-card-spec">
                    <span className="label">
                      <span className="spec-icon">⏱</span>Оформление
                    </span>
                    <span className="value">~30 минут</span>
                  </div>
                  <div className="selector-card-spec">
                    <span className="label">
                      <span className="spec-icon">🛡</span>Обслуживание
                    </span>
                    <span className="value">Бесплатно</span>
                  </div>
                  <div className="selector-card-spec">
                    <span className="label">
                      <span className="spec-icon">↻</span>Пополнение
                    </span>
                    <span className="value">USDT</span>
                  </div>
                </div>
                <div className="selector-card-price">
                  <strong>1 190₽</strong> · под ключ
                </div>
                <a
                  href={tgLink("Хочу оформить крипто-карту")}
                  className="selector-card-cta"
                >
                  Оформить
                </a>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="selector-card freedom">
                <div className="mockcard freedom-card">
                  <div className="mc-top">
                    <div className="mc-chip" />
                    <div className="mc-brand">KAZAKHSTAN</div>
                  </div>
                  <div className="mc-number">•••• 3819</div>
                  <div className="mc-bottom">
                    <div className="mc-holder">Cardholder</div>
                    <div className="mc-network">visa</div>
                  </div>
                </div>
                <div className="selector-card-question">
                  Нужен полноценный банковский счёт, надолго
                </div>
                <div className="selector-card-answer">Банк Казахстана</div>
                <p className="selector-card-audience">
                  Для крупных сумм и долгосрочного решения — полноценный счёт
                  через официальную гос.программу, а не просто карта.
                </p>
                <div className="selector-card-specs">
                  <div className="selector-card-spec">
                    <span className="label">
                      <span className="spec-icon">⏱</span>Оформление
                    </span>
                    <span className="value">1–2 дня</span>
                  </div>
                  <div className="selector-card-spec">
                    <span className="label">
                      <span className="spec-icon">🛡</span>Обслуживание
                    </span>
                    <span className="value">Бесплатно</span>
                  </div>
                  <div className="selector-card-spec">
                    <span className="label">
                      <span className="spec-icon">↻</span>Пополнение
                    </span>
                    <span className="value">СБП, крипта</span>
                  </div>
                </div>
                <div className="selector-card-price">
                  <strong>16 990₽</strong> · под ключ, с пошлиной
                </div>
                <a
                  href={tgLink("Хочу оформить счёт в банке Казахстана")}
                  className="selector-card-cta"
                >
                  Оформить
                </a>
              </div>
            </Reveal>
          </div>

          <div className="limits-row">
            <div className="limits-standalone">
              <LimitsAccordion
                title="Лимиты и тарифы — крипто-карта"
                groups={[
                  {
                    t: "Лимиты операций",
                    d: "В год — $300 000. В месяц — $65 000. В день — $15 000. За одну операцию — $15 000",
                  },
                  {
                    t: "Обслуживание",
                    d: "Бесплатно",
                  },
                  {
                    t: "Пополнение",
                    d: "Перевод USDT на биржу — сеть подскажу под минимальную комиссию",
                  },
                ]}
                source="По тарифам биржи на дату публикации — биржа может менять лимиты."
              />
            </div>
            <div className="limits-standalone">
              <LimitsAccordion
                title="Лимиты и тарифы — счёт в Казахстане"
                groups={[
                  {
                    t: "Пополнение",
                    d: "Со счетов и карт банка, а также других банков Казахстана — 0%. Пополнение с банков РФ тоже возможно — актуальные способы уточняйте",
                  },
                  {
                    t: "Снятие наличных",
                    d: "В банкоматах банка и в Казахстане — бесплатно до 500 000 ₸/месяц, далее 1%. За рубежом — 1,5% + 1 500 ₸ за операцию",
                  },
                  {
                    t: "Переводы",
                    d: "На карты банка и между своими счетами — 0%. На карты других банков Казахстана — бесплатно до 500 000 ₸/месяц, далее 0,9%. За рубеж — 1% (мин. 250 ₸)",
                  },
                ]}
                source="По официальным тарифам банка на мультивалютную карту, актуально на дату публикации — банк может менять тарифы."
              />
            </div>
          </div>

          <div className="mini-compare-wrap">
            <table className="mini-compare">
              <thead>
                <tr>
                  <th></th>
                  <th className="hl">Банк Казахстана</th>
                  <th>Другие карты СНГ</th>
                  <th>Крипто-карта</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td className="hl">{r.kz}</td>
                    <td>{r.cis}</td>
                    <td>{r.crypto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mini-compare-mobile">
            {(
              [
                { key: "kz", label: "Банк Казахстана", hl: true },
                { key: "cis", label: "Другие карты СНГ", hl: false },
                { key: "crypto", label: "Крипто-карта", hl: false },
              ] as const
            ).map((col) => (
              <div className={`mc-card${col.hl ? " hl" : ""}`} key={col.key}>
                <div className="mc-card-title">{col.label}</div>
                {compareRows.map((r) => (
                  <div className="mc-card-row" key={r.label}>
                    <span>{r.label}</span>
                    <b>{r[col.key]}</b>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="other-help">
            <div className="other-help-icon">💳</div>
            <div className="other-help-text">
              <b>Нужно просто оплатить сервис — без карты?</b>
              <span>
                ChatGPT, Claude, iCloud и другие зарубежные сервисы — оплачу
                разово, без оформления карты или счёта. Подходит, если карта
                в ближайшее время не нужна и возиться с оформлением не
                хочется. Стоимость обсуждаем индивидуально.
              </span>
            </div>
            <a
              href={tgLink("Хочу оплатить зарубежный сервис")}
              className="other-help-cta"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>

      {/* PROCESS */}
      <div className="section" id="process">
        <div className="wrap">
          <div className="section-label">Процесс</div>
          <h2 className="section-title">Как это работает?</h2>

          <div className="process-list">
            <Reveal delay={1} className="process-item">
              <div className="process-num">💬</div>
              <div className="process-body">
                <b>
                  Заявка <span className="process-duration">~5 минут</span>
                </b>
                <span>
                  Вы связываетесь <a href={TG_CONTACT}>со мной</a> удобным
                  способом и коротко описываете, что нужно
                </span>
              </div>
            </Reveal>

            {[
              {
                icon: "🗣",
                t: "Консультация",
                dur: "~15 минут",
                d: "Описываете запрос подробнее — консультирую и подбираю подходящий вариант",
              },
              {
                icon: "🔐",
                t: "Ввод данных",
                dur: "~10 минут",
                d: "Вы сами вводите данные напрямую на сайте биржи или банка — паспорт, анкету. Я рядом на связи, но сами эти данные ко мне не попадают",
              },
              {
                icon: "⚙️",
                t: "Оформление",
                dur: "30 мин / 1–2 дня",
                d: "Прохожу процесс на связи вместе с вами — заявку подаёте сами, я подсказываю на каждом шаге",
              },
              {
                icon: "🎉",
                t: "Получение",
                dur: "сразу / 2–3 дня",
                d: "Получаете доступ — виртуальная карта сразу, пластик по желанию с доставкой",
              },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i + 2} className="process-item">
                <div className="process-num">{s.icon}</div>
                <div className="process-body">
                  <b>
                    {s.t}{" "}
                    <span className="process-duration">{s.dur}</span>
                  </b>
                  <span>{s.d}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* POLICY */}
      <div className="section" id="policy">
        <div className="wrap">
          <div className="section-label">Политика</div>
          <h2 className="section-title">Что нужно знать перед оформлением</h2>
          <p className="section-sub">Общие условия для всех карт</p>

          <ul className="policy-list">
            <li>
              <span className="policy-num">1</span>
              <span>
                <strong>Не только карты.</strong> Кроме оформления карт и
                счетов, помогаю оплачивать отдельные зарубежные сервисы,
                которые не оплатить картой РФ — например, ChatGPT и похожие
                подписки. Пишите в <a href={TG_CONTACT}>Telegram</a>,
                разберём ваш случай.
              </span>
            </li>
            <li>
              <span className="policy-num">2</span>
              <span>
                <strong>Возврат оплаты.</strong>
                <ul className="policy-sublist">
                  <li>
                    <strong>Полный возврат</strong> — банк или биржа отказали
                    в открытии карты/счёта, либо вы передумали до того, как
                    карта/счёт открыты. Возвращаю 100% моей комиссии за
                    сопровождение
                  </li>
                  <li>
                    <strong>Без возврата</strong> — карта или счёт уже
                    открыты. Услуга считается оказанной полностью, комиссия
                    не возвращается — в том числе если вы передумали уже
                    после открытия
                  </li>
                  <li>
                    Пошлина третьей стороне (например, ИИН + eSIM) не
                    возвращается ни в одном из этих случаев, даже если
                    оплачена одним платежом со мной — это государственный
                    сбор, уходящий оператору программы
                  </li>
                  <li>
                    Возврат — в течение{" "}
                    <span className="text-hl">7 рабочих дней</span>
                  </li>
                </ul>
              </span>
            </li>
            <li>
              <span className="policy-num">3</span>
              <span>
                <strong>Я не отвечаю за:</strong>
                <ul className="policy-sublist">
                  <li>
                    Решение банка или биржи по заявке — гарантий одобрения
                    нет
                  </li>
                  <li>Способ пополнения счёта из РФ — он может меняться</li>
                  <li>
                    Будущие изменения условий партнёрских программ в целом
                  </li>
                </ul>
              </span>
            </li>
            <li>
              <span className="policy-num">4</span>
              <span>
                <strong>Уведомление ФНС.</strong> Если вы налоговый резидент
                РФ и открываете счёт в Казахстане — по закону (ФЗ-173) нужно
                уведомить ФНС об открытии счёта в течение месяца, а затем
                ежегодно подавать отчёт о движении средств. Это ваша личная
                обязанность — я её не выполняю и не сопровождаю. Крипто-карта
                тоже может иметь налоговые последствия — уточняйте отдельно.
              </span>
            </li>
            <li>
              <span className="policy-num">5</span>
              <span>
                <strong>Резиденция бессрочна.</strong> Статус по
                гос.программе Казахстана, по подтверждению банка, выдаётся
                один раз и действует бессрочно — продлевать его не нужно.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* TRUST */}
      <div className="section" id="trust">
        <div className="wrap">
          <div className="section-label">Доверие</div>
          <h2 className="section-title">Почему можно доверять</h2>
          <p className="section-sub">
            Консультирую по оформлению зарубежных карт и счетов, а также
            помогаю оплачивать отдельные зарубежные сервисы — без
            посредников и колл-центра, от первого сообщения до результата.
          </p>

          <div className="about-me">
            <div className="about-me-photo">А</div>
            <div className="about-me-text">
              <b>Аюб</b>
              <span>
                Более двух лет занимаюсь оформлением карт и счетов за
                рубежом, а также помогаю оплачивать зарубежные сервисы —
                быстро, просто и безопасно. За это время разобрался во
                всех нюансах: знаю подводные камни, реальные сроки и где
                можно сэкономить. На все вопросы отвечаю исключительно
                сам.
              </span>
            </div>
          </div>

          <div className="trust-grid">
            {[
              {
                icon: "📄",
                t: "Официально, по оферте",
                d: "Работаю по публичной оферте, закрывающие документы — по запросу",
              },
              {
                icon: "🤝",
                t: "Сопровождаю до результата",
                d: "Не заканчиваю на подаче заявки — остаюсь на связи, пока карта или счёт не окажутся у вас",
              },
              {
                icon: "👤",
                t: "Напрямую со мной",
                d: "Никаких менеджеров и колл-центра — на связи один человек на каждом этапе",
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i + 1} className="trust-card">
                <div className="trust-icon">{c.icon}</div>
                <b>{c.t}</b>
                <span>{c.d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="section" id="reviews">
        <div className="wrap">
          <div className="section-label">Отзывы</div>
          <h2 className="section-title">Что говорят клиенты</h2>

          <div className="reviews-placeholder">
            <div className="reviews-placeholder-icon">💬</div>
            <b>Тут будут ваши отзывы</b>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="section" id="faq">
        <div className="wrap">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Ответы на вопросы</h2>
          <FaqList items={faqItems} />
        </div>
      </div>

      {/* CTA BOTTOM */}
      <div className="cta-bottom">
        <div className="wrap">
          <div className="cta-bottom-card">
            <div className="cta-bottom-glow" aria-hidden="true" />
            <div className="cta-bottom-badge">Остались вопросы?</div>
            <h2 className="cta-bottom-title">
              Помогу понять, <span>что выгоднее</span> в вашей ситуации
            </h2>
            <p className="cta-bottom-sub">
              Опишите задачу в Telegram — подскажу подходящий вариант,
              сроки и итоговую стоимость. Ни к чему не обязывает.
            </p>
            <div className="cta-bottom-actions">
              <a
                href={tgLink(
                  "Здравствуйте! Хочу проконсультироваться, что мне подойдёт"
                )}
                className="cta-bottom-btn-primary"
              >
                Написать в Telegram
              </a>
              <a href="#selector" className="cta-bottom-btn-secondary">
                Сравнить варианты
              </a>
            </div>
            <div className="cta-bottom-note">
              Веду сопровождение лично — решение по заявке принимает банк
              или биржа
            </div>
            <div className="cta-bottom-points">
              <span>✓ Консультация бесплатна</span>
              <span>✓ Отвечаю лично, без ботов</span>
              <span>✓ Без предоплаты за консультацию</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-brand">Карты и счета за рубежом</div>
              <p className="foot-desc">
                Оформление карт и счетов под ключ.
                <br className="mob-br" /> Не является финансовой или
                юридической консультацией.
              </p>
              <div className="foot-seller">
                <strong>Продавец</strong>
                ИП Магомедгаджиев Аюб Магомедгаджиевич
                <br />
                ОГРНИП 326050000130671 · ИНН 050029997326
              </div>
            </div>
            <div>
              <div className="foot-h">Документы</div>
              <ul className="foot-list">
                <li>
                  <a href="/oferta">Публичная оферта</a>
                </li>
                <li>
                  <a href="/privacy">Политика обработки данных</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="foot-h">Контакты</div>
              <ul className="foot-list">
                <li>
                  <a href={TG_CONTACT}>Telegram автора</a>
                </li>
                <li>
                  <a href="mailto:mvkhid.info@gmail.com">
                    mvkhid.info@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <div>© 2026</div>
            <div>
              Названия бирж и банков, упоминаемых в переписке при оформлении,
              — товарные знаки соответствующих правообладателей. Данный сайт
              не связан с ними и не является их официальным ресурсом.
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
      <YandexMetrika />
    </>
  );
}
