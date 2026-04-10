"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sendQuoteRequest } from "./actions";

export default function Home() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hueRef = useRef<SVGAnimateElement | null>(null);

  // Scroll → navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for fade-up animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Etheral hue animation
  useEffect(() => {
    const hueEl = document.getElementById("etheralHue");
    if (!hueEl) return;
    let hue = 0;
    const speed = 3.6;
    let raf: number;
    function animate() {
      hue = (hue + speed) % 360;
      hueEl!.setAttribute("values", String(hue));
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Language helper
  const t = (en: string, es: string) => (lang === "en" ? en : es);

  // Form submit
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setFormStatus("sending");
    setFormError("");

    const result = await sendQuoteRequest(new FormData(formRef.current));

    if (result.success) {
      setFormStatus("sent");
      formRef.current.reset();
      setTimeout(() => setFormStatus("idle"), 4000);
    } else {
      setFormStatus("error");
      setFormError(result.error);
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  };

  return (
    <>
      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a href="#" className="logo">
            <Image src="/images/logo-orange.png" alt="Angel Mechanic Expert" width={64} height={64} />
          </a>
          <ul className={`nav-links${menuOpen ? " active" : ""}`}>
            <li>
              <div className="lang-switch">
                <button
                  className={`lang-btn${lang === "en" ? " active" : ""}`}
                  onClick={() => setLang("en")}
                >
                  EN
                </button>
                <button
                  className={`lang-btn${lang === "es" ? " active" : ""}`}
                  onClick={() => setLang("es")}
                >
                  ES
                </button>
              </div>
            </li>
            <li>
              <a href="#services" onClick={() => setMenuOpen(false)}>
                {t("Services", "Servicios")}
              </a>
            </li>
            <li>
              <a href="#why-us" onClick={() => setMenuOpen(false)}>
                {t("About", "Nosotros")}
              </a>
            </li>
            <li>
              <a href="#testimonials" onClick={() => setMenuOpen(false)}>
                {t("Reviews", "Opiniones")}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                {t("Contact", "Contacto")}
              </a>
            </li>
            <li>
              <a href="tel:4074509072" className="nav-cta">
                &#9742; (407) 450-9072
              </a>
            </li>
          </ul>
          <button
            className="hamburger"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="etheral-bg">
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
              <filter id="etheral-filter">
                <feTurbulence
                  result="undulation"
                  numOctaves={2}
                  baseFrequency="0.0005,0.002"
                  seed={0}
                  type="turbulence"
                />
                <feColorMatrix
                  id="etheralHue"
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={100}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={100}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
          <div
            className="etheral-layer"
            style={{ filter: "url(#etheral-filter) blur(4px)" }}
          />
          <div className="etheral-noise" />
        </div>

        <div className="hero-inner">
          <div className="hero-text">
            <Image
              src="/images/logo-full-white.png"
              alt="Angel Mechanic Expert LLC"
              width={400}
              height={200}
              style={{
                height: 200,
                marginBottom: 28,
                marginTop: -60,
                objectFit: "contain",
                width: "auto",
              }}
            />
            <div className="hero-badge">
              {t(
                "\u2605 Trusted Auto Repair in Orlando",
                "\u2605 Taller Mec\u00e1nico de Confianza en Orlando"
              )}
            </div>
            <h1>
              {lang === "en" ? (
                <>
                  Your Car Deserves <span>Expert Care</span>
                </>
              ) : (
                <>
                  Tu Auto Merece <span>Cuidado Experto</span>
                </>
              )}
            </h1>
            <p>
              {t(
                "Professional auto repair and maintenance services you can trust. Honest diagnostics, quality parts, and skilled mechanics \u2014 all at fair prices.",
                "Servicios profesionales de reparaci\u00f3n y mantenimiento automotriz de confianza. Diagn\u00f3sticos honestos, piezas de calidad y mec\u00e1nicos capacitados \u2014 todo a precios justos."
              )}
            </p>
            <div className="hero-btns">
              <a href="tel:4074509072" className="btn btn-primary">
                {t("\u2706 Call Now", "\u2706 Ll\u00e1manos")}
              </a>
              <a href="#services" className="btn btn-outline">
                {t("Our Services \u2192", "Nuestros Servicios \u2192")}
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon">
                <Image src="/images/logo-orange.png" alt="AME Logo" width={80} height={80} />
              </div>
              <h3>{t("Quick Diagnostics", "Diagn\u00f3stico R\u00e1pido")}</h3>
              <p>
                {t(
                  "Get a thorough inspection and honest assessment of your vehicle\u2019s needs.",
                  "Obt\u00e9n una inspecci\u00f3n completa y una evaluaci\u00f3n honesta de las necesidades de tu veh\u00edculo."
                )}
              </p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="number">35+</div>
                  <div className="label">
                    {t("Years Experience", "A\u00f1os de Experiencia")}
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="number">5K+</div>
                  <div className="label">
                    {t("Cars Repaired", "Autos Reparados")}
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="number">4.9</div>
                  <div className="label">
                    {t("Star Rating", "Calificaci\u00f3n")}
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="number">100%</div>
                  <div className="label">
                    {t("Satisfaction", "Satisfacci\u00f3n")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-inner">
          <div className="trust-item">
            <div className="trust-icon">&#128737;</div>
            <span>{t("Licensed & Insured", "Licenciado y Asegurado")}</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon">&#9989;</div>
            <span>{t("ASE Certified", "Certificado ASE")}</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon">&#128176;</div>
            <span>{t("Transparent Pricing", "Precios Transparentes")}</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon">&#9200;</div>
            <span>{t("Same-Day Service", "Servicio el Mismo D\u00eda")}</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon">&#128170;</div>
            <span>{t("Warranty on Repairs", "Garant\u00eda en Reparaciones")}</span>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services">
        <div className="section-inner">
          <div className="section-label">
            {t("\u2699 What We Do", "\u2699 Lo Que Hacemos")}
          </div>
          <h2 className="section-title fade-up">
            {t("Complete Auto Repair Services", "Servicios Completos de Reparaci\u00f3n Automotriz")}
          </h2>
          <p className="section-desc fade-up">
            {t(
              "From routine maintenance to complex repairs, we keep your vehicle running at peak performance.",
              "Desde mantenimiento rutinario hasta reparaciones complejas, mantenemos tu veh\u00edculo funcionando al m\u00e1ximo."
            )}
          </p>
          <div className="services-grid">
            {[
              { icon: "\uD83D\uDD0B", en: "Engine Repair", es: "Reparaci\u00f3n de Motor", descEn: "Complete engine diagnostics, repair, and rebuilds. We fix everything from minor tune-ups to major overhauls.", descEs: "Diagn\u00f3stico completo del motor, reparaci\u00f3n y reconstrucci\u00f3n. Arreglamos todo, desde afinaciones menores hasta reparaciones mayores." },
              { icon: "\u2699", en: "Transmission", es: "Transmisi\u00f3n", descEn: "Manual and automatic transmission repair, fluid changes, and complete rebuilds for smooth shifting.", descEs: "Reparaci\u00f3n de transmisi\u00f3n manual y autom\u00e1tica, cambios de fluido y reconstrucciones completas." },
              { icon: "\uD83D\uDE97", en: "Brake Service", es: "Servicio de Frenos", descEn: "Brake pad replacement, rotor resurfacing, brake fluid flush, and complete brake system diagnostics.", descEs: "Cambio de pastillas, rectificaci\u00f3n de rotores, cambio de l\u00edquido de frenos y diagn\u00f3stico completo del sistema." },
              { icon: "\u2744", en: "A/C & Heating", es: "Aire Acondicionado y Calefacci\u00f3n", descEn: "Stay comfortable year-round with our air conditioning repair, recharge, and heating system services.", descEs: "Mant\u00e9nte c\u00f3modo todo el a\u00f1o con nuestros servicios de reparaci\u00f3n y recarga de aire acondicionado y calefacci\u00f3n." },
              { icon: "\uD83D\uDD0B", en: "Electrical Systems", es: "Sistemas El\u00e9ctricos", descEn: "Battery testing, alternator repair, starter replacement, and complete electrical diagnostics.", descEs: "Prueba de bater\u00eda, reparaci\u00f3n de alternador, reemplazo de motor de arranque y diagn\u00f3stico el\u00e9ctrico completo." },
              { icon: "\uD83D\uDEE2", en: "Oil Change & Maintenance", es: "Cambio de Aceite y Mantenimiento", descEn: "Keep your car running smoothly with regular oil changes, filter replacements, and fluid top-offs.", descEs: "Mant\u00e9n tu auto funcionando bien con cambios de aceite regulares, reemplazo de filtros y relleno de fluidos." },
              { icon: "\u267B", en: "Exhaust & Emissions", es: "Escape y Emisiones", descEn: "Muffler repair, catalytic converter replacement, and emissions testing to keep you road-legal.", descEs: "Reparaci\u00f3n de mofle, reemplazo de convertidor catal\u00edtico y pruebas de emisiones." },
              { icon: "\uD83D\uDEE0", en: "Suspension & Steering", es: "Suspensi\u00f3n y Direcci\u00f3n", descEn: "Shocks, struts, alignment, power steering repair, and complete suspension system service.", descEs: "Amortiguadores, alineaci\u00f3n, reparaci\u00f3n de direcci\u00f3n hidr\u00e1ulica y servicio completo de suspensi\u00f3n." },
              { icon: "\uD83D\uDEB2", en: "Tire Services", es: "Servicios de Llantas", descEn: "Tire rotation, balancing, flat repair, and new tire installation for a safe and smooth ride.", descEs: "Rotaci\u00f3n de llantas, balanceo, reparaci\u00f3n de ponchadura e instalaci\u00f3n de llantas nuevas." },
            ].map((s) => (
              <div className="service-card fade-up" key={s.en}>
                <div className="service-icon">{s.icon}</div>
                <h3>{t(s.en, s.es)}</h3>
                <p>{t(s.descEn, s.descEs)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us">
        <div className="section-inner">
          <div className="why-grid">
            <div>
              <div className="section-label">
                {t("\u2605 Why Choose Us", "\u2605 Por Qu\u00e9 Elegirnos")}
              </div>
              <h2 className="section-title fade-up">
                {t(
                  "Orlando\u2019s Most Trusted Mechanic",
                  "El Mec\u00e1nico M\u00e1s Confiable de Orlando"
                )}
              </h2>
              <p className="section-desc fade-up">
                {t(
                  "We combine old-school craftsmanship with modern diagnostic technology to deliver results you can count on.",
                  "Combinamos la experiencia tradicional con tecnolog\u00eda de diagn\u00f3stico moderna para ofrecerte resultados confiables."
                )}
              </p>
              <div className="why-features">
                {[
                  { icon: "\uD83D\uDD0D", en: "Honest Diagnostics", es: "Diagn\u00f3sticos Honestos", descEn: "We tell you exactly what your car needs \u2014 nothing more, nothing less. No upselling, no surprises.", descEs: "Te decimos exactamente lo que tu auto necesita \u2014 ni m\u00e1s, ni menos. Sin ventas adicionales, sin sorpresas." },
                  { icon: "\uD83D\uDCB0", en: "Fair & Transparent Pricing", es: "Precios Justos y Transparentes", descEn: "Get a clear estimate before any work begins. We believe in earning your trust with every repair.", descEs: "Recibe un presupuesto claro antes de comenzar. Creemos en ganarnos tu confianza con cada reparaci\u00f3n." },
                  { icon: "\u23F1", en: "Fast Turnaround", es: "Entrega R\u00e1pida", descEn: "We know you need your car back. Most repairs are completed the same day so you can get back on the road.", descEs: "Sabemos que necesitas tu auto. La mayor\u00eda de las reparaciones se completan el mismo d\u00eda." },
                  { icon: "\uD83D\uDEE1", en: "Quality Guaranteed", es: "Calidad Garantizada", descEn: "All repairs come with a warranty. We use quality parts and stand behind every job we do.", descEs: "Todas las reparaciones incluyen garant\u00eda. Usamos piezas de calidad y respaldamos cada trabajo." },
                ].map((f) => (
                  <div className="why-feature fade-up" key={f.en}>
                    <div className="why-feature-icon">{f.icon}</div>
                    <div>
                      <h4>{t(f.en, f.es)}</h4>
                      <p>{t(f.descEn, f.descEs)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-image fade-up">
              <div className="why-image-content">
                <div className="big-number">35+</div>
                <div className="big-label">
                  {t("Years Serving Orlando", "A\u00f1os Sirviendo a Orlando")}
                </div>
              </div>
              <div className="why-image-badges">
                <div className="why-badge">
                  <div className="num">5,000+</div>
                  <div className="txt">
                    {t("Happy Customers", "Clientes Felices")}
                  </div>
                </div>
                <div className="why-badge">
                  <div className="num">98%</div>
                  <div className="txt">
                    {t("Repeat Clients", "Clientes Recurrentes")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="section-inner">
          <div className="section-label">
            {t("\uD83D\uDCAC Customer Reviews", "\uD83D\uDCAC Opiniones de Clientes")}
          </div>
          <h2 className="section-title fade-up">
            {t("What Our Customers Say", "Lo Que Dicen Nuestros Clientes")}
          </h2>
          <p className="section-desc fade-up">
            {t(
              "Don\u2019t just take our word for it \u2014 hear from the people who trust us with their vehicles.",
              "No solo nos creas a nosotros \u2014 escucha a quienes nos conf\u00edan sus veh\u00edculos."
            )}
          </p>
          <div className="testimonials-grid">
            {[
              {
                quote:
                  "\u201CBest mechanic in Orlando! Angel was upfront about everything and the price was very fair. My car runs like new. I won\u2019t go anywhere else.\u201D",
                name: "Maria G.",
                loc: "Orlando, FL",
                initial: "M",
              },
              {
                quote:
                  "\u201CI came in for a strange engine noise and they diagnosed it quickly. Honest service and reasonable prices. Highly recommend to anyone in the area.\u201D",
                name: "James R.",
                loc: "Orlando, FL",
                initial: "J",
              },
              {
                quote:
                  "\u201CFinally found a mechanic I can trust. They fixed my A/C in the same day and it works perfectly. Great customer service and very knowledgeable team.\u201D",
                name: "Sofia L.",
                loc: "Kissimmee, FL",
                initial: "S",
              },
            ].map((r) => (
              <div className="testimonial-card fade-up" key={r.name}>
                <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote>{r.quote}</blockquote>
                <div className="testimonial-author">
                  <div className="author-avatar">{r.initial}</div>
                  <div>
                    <div className="author-name">{r.name}</div>
                    <div className="author-label">{r.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner cta-content">
          <h2 className="fade-up">
            {lang === "en" ? (
              <>
                Ready to Get Your Car <span>Back on the Road?</span>
              </>
            ) : (
              <>
                \u00bfListo Para Poner Tu Auto <span>De Vuelta en la Carretera?</span>
              </>
            )}
          </h2>
          <p className="fade-up">
            {t(
              "Schedule your appointment today or drive in \u2014 we\u2019re here to help.",
              "Agenda tu cita hoy o ven directamente \u2014 estamos aqu\u00ed para ayudarte."
            )}
          </p>
          <div className="cta-btns fade-up">
            <a href="tel:4074509072" className="btn btn-primary">
              {t("\u2706 Call For Appointment", "\u2706 Llamar Para Cita")}
            </a>
            <a href="#contact" className="btn btn-outline">
              {t("Send a Message \u2192", "Enviar Mensaje \u2192")}
            </a>
          </div>
          <a href="tel:4074509072" className="cta-phone fade-up">
            (407) 450-9072
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-inner">
          <div className="section-label">
            {t("\uD83D\uDCCD Get In Touch", "\uD83D\uDCCD Cont\u00e1ctanos")}
          </div>
          <h2 className="section-title fade-up">
            {t("Contact Us", "Cont\u00e1ctanos")}
          </h2>
          <p className="section-desc fade-up">
            {t(
              "Have questions? Need a quote? Reach out \u2014 we\u2019re happy to help.",
              "\u00bfTienes preguntas? \u00bfNecesitas una cotizaci\u00f3n? Escr\u00edbenos \u2014 con gusto te ayudamos."
            )}
          </p>
          <div className="contact-grid">
            <div className="contact-info fade-up">
              <div className="contact-item">
                <div className="contact-icon">&#128205;</div>
                <div>
                  <h4>{t("Our Location", "Nuestra Ubicaci\u00f3n")}</h4>
                  <p>
                    3311 West Washington Street
                    <br />
                    Orlando, FL 32805
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">&#9742;</div>
                <div>
                  <h4>{t("Phone", "Tel\u00e9fono")}</h4>
                  <a href="tel:4074509072">(407) 450-9072</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">&#128339;</div>
                <div>
                  <h4>{t("Business Hours", "Horario de Atenci\u00f3n")}</h4>
                  <p>
                    {lang === "en" ? (
                      <>
                        Monday - Friday: 8:00 AM - 6:00 PM
                        <br />
                        Saturday: 8:00 AM - 3:00 PM
                        <br />
                        Sunday: Closed
                      </>
                    ) : (
                      <>
                        Lunes - Viernes: 8:00 AM - 6:00 PM
                        <br />
                        S\u00e1bado: 8:00 AM - 3:00 PM
                        <br />
                        Domingo: Cerrado
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">&#127760;</div>
                <div>
                  <h4>Website</h4>
                  <a
                    href="https://www.angelmechanicexpert.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.angelmechanicexpert.com
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form fade-up">
              <h3>{t("Request a Quote", "Solicitar Cotizaci\u00f3n")}</h3>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t("Your Name", "Tu Nombre")}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder={t("John Doe", "Juan P\u00e9rez")}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      {t("Phone Number", "N\u00famero de Tel\u00e9fono")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="(407) 000-0000"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    {t("Email Address", "Correo Electr\u00f3nico")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("you@email.com", "tu@correo.com")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="service">
                    {t("Service Needed", "Servicio Requerido")}
                  </label>
                  <select id="service" name="service">
                    <option value="">
                      {t("Select a service...", "Selecciona un servicio...")}
                    </option>
                    <option>{t("Engine Repair", "Reparación de Motor")}</option>
                    <option>{t("Transmission", "Transmisión")}</option>
                    <option>{t("Brake Service", "Servicio de Frenos")}</option>
                    <option>{t("A/C & Heating", "Aire Acondicionado y Calefacción")}</option>
                    <option>{t("Electrical Systems", "Sistemas Eléctricos")}</option>
                    <option>{t("Oil Change & Maintenance", "Cambio de Aceite y Mantenimiento")}</option>
                    <option>{t("Exhaust & Emissions", "Escape y Emisiones")}</option>
                    <option>{t("Suspension & Steering", "Suspensión y Dirección")}</option>
                    <option>{t("Tire Services", "Servicios de Llantas")}</option>
                    <option>{t("Other", "Otro")}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">
                    {t("Describe Your Issue", "Describe Tu Problema")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t(
                      "Tell us what's going on with your vehicle...",
                      "Cu\u00e9ntanos qu\u00e9 le pasa a tu veh\u00edculo..."
                    )}
                  />
                </div>
                {formStatus === "error" && (
                  <p style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: 12 }}>
                    {formError || t("Something went wrong.", "Algo salió mal.")}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={formStatus === "sending"}
                  style={
                    formStatus === "sent"
                      ? { background: "#22c55e" }
                      : formStatus === "error"
                      ? { background: "#ef4444" }
                      : undefined
                  }
                >
                  {formStatus === "sending"
                    ? t("Sending...", "Enviando...")
                    : formStatus === "sent"
                    ? t("Sent! We'll call you back soon.", "¡Enviado! Te llamaremos pronto.")
                    : formStatus === "error"
                    ? t("Error — Try Again", "Error — Intenta de Nuevo")
                    : t("Send Request \u2192", "Enviar Solicitud \u2192")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <div className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.5!2d-81.41!3d28.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMyJzI0LjAiTiA4McKwMjQnMzYuMCJX!5e0!3m2!1sen!2sus!4v1"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Angel Mechanic Expert Location"
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="logo">
                <Image
                  src="/images/logo-orange.png"
                  alt="Angel Mechanic Expert"
                  width={40}
                  height={40}
                  style={{ height: 40, width: "auto" }}
                />
              </a>
              <p>
                Professional auto repair services in Orlando, FL. Quality work,
                honest service, and fair prices &mdash; that&apos;s our promise.
              </p>
            </div>
            <div>
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Engine Repair</a></li>
                <li><a href="#services">Transmission</a></li>
                <li><a href="#services">Brake Service</a></li>
                <li><a href="#services">A/C &amp; Heating</a></li>
                <li><a href="#services">Oil Change</a></li>
              </ul>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#services">Our Services</a></li>
                <li><a href="#why-us">About Us</a></li>
                <li><a href="#testimonials">Reviews</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact Info</h4>
              <ul>
                <li><a href="tel:4074509072">(407) 450-9072</a></li>
                <li><a href="#">3311 W Washington St</a></li>
                <li><a href="#">Orlando, FL 32805</a></li>
                <li><a href="#">Mon-Fri: 8AM-6PM</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 Angel Mechanic Expert. All rights reserved.</span>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">&#9737;</a>
              <a href="#" aria-label="Google">G</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
