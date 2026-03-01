"use client";
import { useTranslation } from "@/i18n/useTranslation";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import IslandMap from "@/components/IslandMap";
import Footer from "@/components/Footer";
import { IconHammer, IconPeople, IconBubble, IconRobot, IconNotes, IconShare } from "@/components/PixelSprites";

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    const children = el.querySelectorAll(".reveal-item");
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const featuresRef = useScrollReveal();
  const howRef = useScrollReveal();
  const guideRef = useScrollReveal();
  const whyRef = useScrollReveal();

  return (
    <>
      <SplashScreen />
      <Navbar />

      {/* ──── Full-bleed Hero / Island World ──── */}
      <IslandMap />

      {/* ──── Features Section ──── */}
      <section className="section features-section" id="features" ref={featuresRef}>
        <div className="section-header reveal-item">
          <span className="section-badge">{t("features.badge")}</span>
          <h2 className="section-title">{t("features.title")}</h2>
          <p className="section-subtitle">{t("features.subtitle")}</p>
        </div>

        <div className="features-grid-v2">
          {/* Feature 1 — Big card */}
          <div className="feature-card-v2 feature-card-hero reveal-item">
            <div className="feature-card-v2-icon"><IconHammer size={64} /></div>
            <div className="feature-card-v2-content">
              <h3 className="feature-card-v2-title">{t("features.projectsTitle")}</h3>
              <p className="feature-card-v2-desc">{t("features.projectsDesc")}</p>
              <ul className="feature-card-v2-list">
                <li>{t("features.projectsBullet1")}</li>
                <li>{t("features.projectsBullet2")}</li>
                <li>{t("features.projectsBullet3")}</li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-card-v2 reveal-item">
            <div className="feature-card-v2-icon"><IconPeople size={52} /></div>
            <h3 className="feature-card-v2-title">{t("features.collabTitle")}</h3>
            <p className="feature-card-v2-desc">{t("features.collabDesc")}</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card-v2 reveal-item">
            <div className="feature-card-v2-icon"><IconBubble size={52} /></div>
            <h3 className="feature-card-v2-title">{t("features.feedTitle")}</h3>
            <p className="feature-card-v2-desc">{t("features.feedDesc")}</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card-v2 reveal-item">
            <div className="feature-card-v2-icon"><IconRobot size={52} /></div>
            <h3 className="feature-card-v2-title">{t("features.agentsTitle")}</h3>
            <p className="feature-card-v2-desc">{t("features.agentsDesc")}</p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card-v2 reveal-item">
            <div className="feature-card-v2-icon"><IconNotes size={52} /></div>
            <h3 className="feature-card-v2-title">{t("features.notesTitle")}</h3>
            <p className="feature-card-v2-desc">{t("features.notesDesc")}</p>
          </div>
        </div>
      </section>

      {/* ──── How It Works — Visual Guide ──── */}
      <section className="section how-section" id="how" ref={howRef}>
        <div className="section-header reveal-item">
          <span className="section-badge">{t("howItWorks.badge")}</span>
          <h2 className="section-title">{t("howItWorks.title")}</h2>
          <p className="section-subtitle">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="steps-timeline">
          <div className="steps-timeline-line" />

          <div className="step-card-v2 reveal-item">
            <div className="step-number-v2">1</div>
            <div className="step-card-v2-body">
              <h3 className="step-card-v2-title">{t("howItWorks.step1Title")}</h3>
              <p className="step-card-v2-desc">{t("howItWorks.step1Desc")}</p>
              <div className="step-card-v2-visual">
                <div className="step-mockup">
                  <div className="step-mockup-bar">
                    <span className="step-mockup-dot" />
                    <span className="step-mockup-dot" />
                    <span className="step-mockup-dot" />
                  </div>
                  <div className="step-mockup-content">
                    <div className="step-mockup-island" />
                    <div className="step-mockup-text">{t("howItWorks.step1Mock")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="step-card-v2 reveal-item">
            <div className="step-number-v2">2</div>
            <div className="step-card-v2-body">
              <h3 className="step-card-v2-title">{t("howItWorks.step2Title")}</h3>
              <p className="step-card-v2-desc">{t("howItWorks.step2Desc")}</p>
              <div className="step-card-v2-visual">
                <div className="step-personas">
                  <div className="step-persona">
                    <div className="step-persona-avatar">&#129302;</div>
                    <span>{t("howItWorks.step2Persona1")}</span>
                  </div>
                  <div className="step-persona">
                    <div className="step-persona-avatar">&#128187;</div>
                    <span>{t("howItWorks.step2Persona2")}</span>
                  </div>
                  <div className="step-persona">
                    <div className="step-persona-avatar">&#127912;</div>
                    <span>{t("howItWorks.step2Persona3")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="step-card-v2 reveal-item">
            <div className="step-number-v2">3</div>
            <div className="step-card-v2-body">
              <h3 className="step-card-v2-title">{t("howItWorks.step3Title")}</h3>
              <p className="step-card-v2-desc">{t("howItWorks.step3Desc")}</p>
              <div className="step-card-v2-visual">
                <div className="step-chat-demo">
                  <div className="step-chat-msg step-chat-user">
                    <span className="step-chat-role">{t("howItWorks.step3You")}</span>
                    {t("howItWorks.step3Msg1")}
                  </div>
                  <div className="step-chat-msg step-chat-ai">
                    <span className="step-chat-role">{t("howItWorks.step3AI1")}</span>
                    {t("howItWorks.step3Msg2")}
                  </div>
                  <div className="step-chat-switch">&#8631; {t("howItWorks.step3Switch")}</div>
                  <div className="step-chat-msg step-chat-ai step-chat-ai-alt">
                    <span className="step-chat-role">{t("howItWorks.step3AI2")}</span>
                    {t("howItWorks.step3Msg3")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Quick-Start Guide ──── */}
      <section className="section guide-section" ref={guideRef}>
        <div className="section-header reveal-item">
          <span className="section-badge">{t("guide.badge")}</span>
          <h2 className="section-title">{t("guide.title")}</h2>
          <p className="section-subtitle">{t("guide.subtitle")}</p>
        </div>

        <div className="guide-grid">
          <div className="guide-card reveal-item">
            <div className="guide-number">01</div>
            <h4 className="guide-card-title">{t("guide.step1Title")}</h4>
            <p className="guide-card-desc">{t("guide.step1Desc")}</p>
          </div>
          <div className="guide-card reveal-item">
            <div className="guide-number">02</div>
            <h4 className="guide-card-title">{t("guide.step2Title")}</h4>
            <p className="guide-card-desc">{t("guide.step2Desc")}</p>
          </div>
          <div className="guide-card reveal-item">
            <div className="guide-number">03</div>
            <h4 className="guide-card-title">{t("guide.step3Title")}</h4>
            <p className="guide-card-desc">{t("guide.step3Desc")}</p>
          </div>
          <div className="guide-card reveal-item">
            <div className="guide-number">04</div>
            <h4 className="guide-card-title">{t("guide.step4Title")}</h4>
            <p className="guide-card-desc">{t("guide.step4Desc")}</p>
          </div>
          <div className="guide-card reveal-item">
            <div className="guide-number">05</div>
            <h4 className="guide-card-title">{t("guide.step5Title")}</h4>
            <p className="guide-card-desc">{t("guide.step5Desc")}</p>
          </div>
          <div className="guide-card reveal-item">
            <div className="guide-number">06</div>
            <h4 className="guide-card-title">{t("guide.step6Title")}</h4>
            <p className="guide-card-desc">{t("guide.step6Desc")}</p>
          </div>
        </div>
      </section>

      {/* ──── Why AIslands ──── */}
      <section className="section why-section" ref={whyRef}>
        <div className="section-header reveal-item">
          <span className="section-badge">{t("why.badge")}</span>
          <h2 className="section-title">{t("why.title")}</h2>
        </div>

        <div className="why-grid">
          <div className="why-card reveal-item">
            <div className="why-icon">&#128274;</div>
            <h4 className="why-card-title">{t("why.privacyTitle")}</h4>
            <p className="why-card-desc">{t("why.privacyDesc")}</p>
          </div>
          <div className="why-card reveal-item">
            <div className="why-icon">&#9889;</div>
            <h4 className="why-card-title">{t("why.speedTitle")}</h4>
            <p className="why-card-desc">{t("why.speedDesc")}</p>
          </div>
          <div className="why-card reveal-item">
            <div className="why-icon">&#127760;</div>
            <h4 className="why-card-title">{t("why.multiTitle")}</h4>
            <p className="why-card-desc">{t("why.multiDesc")}</p>
          </div>
        </div>
      </section>

      {/* ──── CTA Section ──── */}
      <section className="cta-section" id="cta">
        <h2 className="cta-title">{t("cta.title")}</h2>
        <p className="cta-desc">{t("cta.description")}</p>
        <button
          className="pixel-btn pixel-btn-accent"
          onClick={() => router.push("/dashboard")}
        >
          {t("cta.button")}
        </button>
      </section>

      {/* ──── Footer ──── */}
      <Footer />
    </>
  );
}
