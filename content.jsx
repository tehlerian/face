import { useState, useRef } from "react";

const BRAND_CONTEXT = `
You are a senior social media strategist and copywriter for yourfacetalk.com — a professional face reading (physiognomy) consulting and training business in Bulgaria, certified by the Psychosomatic Therapy College, Australia.

BUSINESS CONTEXT:
- Specialization: Long-term structural facial markers (NOT microexpressions)
- Core services: HR training (hiring accuracy), management consulting (business partners, team dynamics), sales team training
- Target audience: HR managers, C-level executives, corporate decision-makers, sales team leaders in Bulgaria
- Key challenge: Low market awareness — audience doesn't know what face reading is
- Brand positioning: Scientifically-grounded, results-oriented, professional B2B tool
- Website: yourfacetalk.com
- Language market: Bulgarian

MESSAGING RULES:
- NEVER lead with "face reading" as a concept — lead with BUSINESS OUTCOMES
- Frame as: hiring accuracy, team performance, sales results, partnership risk reduction
- Use proof/credibility language: data, results, case studies
- Call to action always points toward: booking a consultation or training session
- Tone: authoritative, professional, intriguing — NOT mystical or entertainment-focused

PLATFORM STRATEGIES:
- LinkedIn: Thought leadership, B2B case insights, "did you know" business angles, professional storytelling
- Facebook: Community warmth, relatable scenarios, questions that spark discussion
- Instagram: Visual hooks, short punchy statements, behind-the-scenes of consultations
- YouTube: Educational long-form, "how face reading improves X" topics

CONTENT FUNNEL:
- Awareness posts: Educate about the problem (bad hires, wrong partnerships, low sales close rates)
- Authority posts: Show expertise without selling (insights, mini case studies, counterintuitive facts)
- Conversion posts: Direct CTA, testimonials, offer-focused

OUTPUT FORMAT: Return ONLY the post content, ready to copy-paste. No intro, no explanation. Include relevant emojis for the platform. For LinkedIn include hashtags at the end. For Facebook include a discussion question. Always write with conviction and specificity.
`;

const platforms = [
  { id: "linkedin", label: "LinkedIn", icon: "💼", color: "#0077B5" },
  { id: "facebook", label: "Facebook", icon: "👥", color: "#1877F2" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
  { id: "youtube", label: "YouTube", icon: "▶️", color: "#FF0000" },
];

const contentGoals = [
  { id: "awareness", label: "Awarness", sublabel: "Образовай аудиторията", icon: "🎯" },
  { id: "authority", label: "Authority", sublabel: "Изгради авторитет", icon: "🏆" },
  { id: "conversion", label: "Conversion", sublabel: "Генерирай запитвания", icon: "💰" },
  { id: "engagement", label: "Engagement", sublabel: "Стимулирай коментари", icon: "🔥" },
];

const contentTypes = [
  { id: "story", label: "Случай от практиката", icon: "📖" },
  { id: "insight", label: "Неочакван факт / Insight", icon: "💡" },
  { id: "tip", label: "Практически съвет", icon: "🛠️" },
  { id: "question", label: "Провокиращ въпрос", icon: "❓" },
  { id: "cta", label: "Директна оферта / CTA", icon: "📣" },
  { id: "myth", label: "Развенчан мит", icon: "🔍" },
];

const languages = [
  { id: "bg", label: "Български", flag: "🇧🇬" },
  { id: "en", label: "English", flag: "🇬🇧" },
];

const tones = [
  { id: "professional", label: "Авторитетен" },
  { id: "storytelling", label: "Разказвач" },
  { id: "provocative", label: "Провокиращ" },
  { id: "empathetic", label: "Емпатичен" },
];

export default function ContentAssistant() {
  const [platform, setPlatform] = useState("linkedin");
  const [goal, setGoal] = useState("awareness");
  const [contentType, setContentType] = useState("insight");
  const [language, setLanguage] = useState("bg");
  const [tone, setTone] = useState("professional");
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [variations, setVariations] = useState([]);
  const [activeVar, setActiveVar] = useState(0);
  const outputRef = useRef(null);

  const buildPrompt = () => {
    const plat = platforms.find(p => p.id === platform)?.label;
    const goalLabel = contentGoals.find(g => g.id === goal)?.label;
    const typeLabel = contentTypes.find(t => t.id === contentType)?.label;
    const toneLabel = tones.find(t => t.id === tone)?.label;
    const lang = language === "bg" ? "Bulgarian" : "English";

    return `Create a ${plat} social media post for yourfacetalk.com with these specifications:

FUNNEL STAGE: ${goalLabel}
CONTENT TYPE: ${typeLabel}
TONE: ${toneLabel}
LANGUAGE: Write entirely in ${lang}
${topic ? `SPECIFIC TOPIC/ANGLE: ${topic}` : "Choose the most impactful angle for this platform and goal combination."}

Requirements:
- Platform-optimized length (LinkedIn: 150-300 words, Facebook: 80-150 words, Instagram: 50-100 words, YouTube: title + description outline)
- Hook in the first line — must stop the scroll
- Business outcome framing (NOT face reading jargon)
- Specific, credible, not vague
- End with appropriate CTA for ${goalLabel} stage
- Ready to publish — no placeholders

Write only the post. Nothing else.`;
  };

  const generate = async () => {
    setIsGenerating(true);
    setError("");
    setGeneratedContent("");
    setVariations([]);
    setActiveVar(0);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: BRAND_CONTEXT,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setGeneratedContent(text);
      setVariations([text]);
    } catch (err) {
      setError("Грешка при генериране. Опитай отново.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVariation = async () => {
    if (variations.length >= 3) return;
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: BRAND_CONTEXT,
          messages: [
            { role: "user", content: buildPrompt() },
            { role: "assistant", content: variations[0] },
            { role: "user", content: `Write a completely different variation of this post — different hook, different angle, different structure. Same platform, goal, and language. Only the post, nothing else.` },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const newVars = [...variations, text];
      setVariations(newVars);
      setActiveVar(newVars.length - 1);
      setGeneratedContent(text);
    } catch (err) {
      setError("Грешка при генериране на вариация.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlatformColor = platforms.find(p => p.id === platform)?.color || "#0d9488";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e0d0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #0a0f1e, #0d2137)",
        borderBottom: "1px solid rgba(180,150,80,0.3)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#b49650", textTransform: "uppercase", marginBottom: "4px" }}>
            yourfacetalk.com
          </div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "400", color: "#f0e8d0", letterSpacing: "1px" }}>
            Social Media Content Studio
          </h1>
        </div>
        <div style={{
          background: "rgba(180,150,80,0.1)",
          border: "1px solid rgba(180,150,80,0.3)",
          borderRadius: "20px",
          padding: "6px 16px",
          fontSize: "12px",
          color: "#b49650",
          letterSpacing: "1px",
        }}>
          AI-POWERED
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Platform Selection */}
        <Section title="01  ПЛАТФОРМА" subtitle="Избери канал">
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  flex: "1",
                  minWidth: "120px",
                  padding: "14px 12px",
                  background: platform === p.id
                    ? `linear-gradient(135deg, ${p.color}22, ${p.color}11)`
                    : "rgba(255,255,255,0.03)",
                  border: platform === p.id
                    ? `1px solid ${p.color}88`
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  color: platform === p.id ? "#f0e8d0" : "#888",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "20px" }}>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Goal + Content Type */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <Section title="02  ЦЕЛЬ" subtitle="Фуния на продажби">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {contentGoals.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  style={{
                    padding: "12px 14px",
                    background: goal === g.id ? "rgba(180,150,80,0.12)" : "rgba(255,255,255,0.02)",
                    border: goal === g.id ? "1px solid rgba(180,150,80,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    color: goal === g.id ? "#d4b870" : "#777",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{g.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontFamily: "sans-serif", fontWeight: "600" }}>{g.label}</div>
                    <div style={{ fontSize: "11px", opacity: 0.7 }}>{g.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="03  ТИП СЪДЪРЖАНИЕ" subtitle="Формат на поста">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {contentTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setContentType(t.id)}
                  style={{
                    padding: "12px 14px",
                    background: contentType === t.id ? "rgba(13,148,136,0.12)" : "rgba(255,255,255,0.02)",
                    border: contentType === t.id ? "1px solid rgba(13,148,136,0.4)" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    color: contentType === t.id ? "#5eead4" : "#777",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.2s",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* Tone + Language */}
        <Section title="04  СТИЛ И ЕЗИК">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#666", letterSpacing: "2px", marginBottom: "10px", fontFamily: "sans-serif" }}>ТОН</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {tones.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    style={{
                      padding: "8px 14px",
                      background: tone === t.id ? "rgba(180,150,80,0.15)" : "rgba(255,255,255,0.03)",
                      border: tone === t.id ? "1px solid rgba(180,150,80,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "20px",
                      color: tone === t.id ? "#d4b870" : "#666",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                      transition: "all 0.2s",
                    }}
                  >{t.label}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "#666", letterSpacing: "2px", marginBottom: "10px", fontFamily: "sans-serif" }}>ЕЗИК</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {languages.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    style={{
                      padding: "8px 20px",
                      background: language === l.id ? "rgba(180,150,80,0.15)" : "rgba(255,255,255,0.03)",
                      border: language === l.id ? "1px solid rgba(180,150,80,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "20px",
                      color: language === l.id ? "#d4b870" : "#666",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontFamily: "sans-serif",
                      transition: "all 0.2s",
                    }}
                  >{l.flag} {l.label}</button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Custom Topic */}
        <Section title="05  ТЕМА / ЪГЪЛ" subtitle="По избор — остави празно за автоматичен избор">
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Пример: Как четенето на лице помогна на HR мениджър да избегне скъпа грешка при наемане на ключова позиция..."
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#d0c8b8",
              fontSize: "14px",
              fontFamily: "Georgia, serif",
              resize: "vertical",
              minHeight: "80px",
              outline: "none",
              boxSizing: "border-box",
              lineHeight: "1.6",
            }}
          />
        </Section>

        {/* Generate Button */}
        <div style={{ textAlign: "center", margin: "32px 0" }}>
          <button
            onClick={generate}
            disabled={isGenerating}
            style={{
              padding: "18px 60px",
              background: isGenerating
                ? "rgba(180,150,80,0.1)"
                : "linear-gradient(135deg, #b49650, #d4b870)",
              border: "none",
              borderRadius: "50px",
              color: isGenerating ? "#b49650" : "#0a0f1e",
              fontSize: "15px",
              fontWeight: "700",
              fontFamily: "sans-serif",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: isGenerating ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              boxShadow: isGenerating ? "none" : "0 8px 32px rgba(180,150,80,0.3)",
            }}
          >
            {isGenerating ? "⏳  Генерира се..." : "✦  Генерирай пост"}
          </button>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            padding: "14px 18px",
            color: "#f87171",
            fontSize: "14px",
            fontFamily: "sans-serif",
            marginBottom: "24px",
          }}>{error}</div>
        )}

        {/* Output */}
        {generatedContent && (
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(180,150,80,0.25)",
            borderRadius: "16px",
            overflow: "hidden",
          }}>
            {/* Output Header */}
            <div style={{
              background: "rgba(180,150,80,0.06)",
              borderBottom: "1px solid rgba(180,150,80,0.15)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: "#b49650", fontSize: "12px", letterSpacing: "2px", fontFamily: "sans-serif", textTransform: "uppercase" }}>
                  Готов пост
                </span>
                {/* Variation tabs */}
                {variations.length > 1 && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    {variations.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setActiveVar(i); setGeneratedContent(variations[i]); }}
                        style={{
                          padding: "3px 10px",
                          background: activeVar === i ? "rgba(180,150,80,0.2)" : "transparent",
                          border: "1px solid rgba(180,150,80,0.3)",
                          borderRadius: "10px",
                          color: activeVar === i ? "#d4b870" : "#666",
                          fontSize: "11px",
                          cursor: "pointer",
                          fontFamily: "sans-serif",
                        }}
                      >V{i + 1}</button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {variations.length < 3 && (
                  <button
                    onClick={generateVariation}
                    disabled={isGenerating}
                    style={{
                      padding: "8px 16px",
                      background: "rgba(13,148,136,0.1)",
                      border: "1px solid rgba(13,148,136,0.3)",
                      borderRadius: "8px",
                      color: "#5eead4",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {isGenerating ? "..." : "＋ Вариация"}
                  </button>
                )}
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: "8px 20px",
                    background: copied ? "rgba(34,197,94,0.1)" : "rgba(180,150,80,0.1)",
                    border: copied ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(180,150,80,0.4)",
                    borderRadius: "8px",
                    color: copied ? "#4ade80" : "#d4b870",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "sans-serif",
                    letterSpacing: "1px",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ Копирано!" : "Копирай"}
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div
              ref={outputRef}
              style={{
                padding: "28px 32px",
                fontSize: "15px",
                lineHeight: "1.8",
                color: "#e0d8c8",
                whiteSpace: "pre-wrap",
                fontFamily: "Georgia, serif",
                minHeight: "150px",
              }}
            >
              {generatedContent}
            </div>

            {/* Platform badge */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              padding: "12px 24px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}>
              <span style={{ fontSize: "11px", color: "#555", fontFamily: "sans-serif", letterSpacing: "1px" }}>
                {platforms.find(p => p.id === platform)?.icon} {platforms.find(p => p.id === platform)?.label}
                &nbsp;·&nbsp;
                {contentGoals.find(g => g.id === goal)?.label}
                &nbsp;·&nbsp;
                {contentTypes.find(t => t.id === contentType)?.label}
              </span>
            </div>
          </div>
        )}

        {/* Footer hint */}
        <div style={{ textAlign: "center", marginTop: "48px", paddingBottom: "32px" }}>
          <p style={{ fontSize: "12px", color: "#444", fontFamily: "sans-serif", letterSpacing: "1px" }}>
            Генерирай до 3 вариации на всеки пост · Копирай директно в социалните медии
          </p>
        </div>

      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#b49650",
            fontFamily: "sans-serif",
            textTransform: "uppercase",
          }}>{title}</span>
          {subtitle && (
            <span style={{ fontSize: "12px", color: "#555", fontFamily: "sans-serif" }}>
              — {subtitle}
            </span>
          )}
        </div>
        <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(180,150,80,0.3), transparent)", marginTop: "8px" }} />
      </div>
      {children}
    </div>
  );
}
