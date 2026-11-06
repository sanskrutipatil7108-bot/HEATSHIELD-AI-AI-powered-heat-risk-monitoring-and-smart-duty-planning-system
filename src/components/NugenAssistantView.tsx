import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  AlertTriangle,
  Sparkles,
  Info,
  ShieldAlert,
  Droplets,
  Clock,
  ExternalLink,
  Flame,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Shield
} from 'lucide-react';
import { getLocationDisplayName } from '../services/translations';
import { generateSafetyAssistantResponse } from '../services/safetyAdvisor';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode?: string;
  model?: string;
  notice?: string;
}

function formatInlineMarkdown(text: string): React.ReactNode[] {
  // Parse **bold**, *italic*, and `code`
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-main-theme">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && part.length >= 2) {
      return (
        <em key={i} className="italic text-secondary-theme">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1 py-0.5 rounded bg-subtle-theme border border-theme font-mono text-[11px] text-teal-600 dark:text-teal-400 break-all"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderMarkdownContent(content: string) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 break-words [overflow-wrap:anywhere] min-w-0">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.replace(/^[-•*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 sm:pl-1.5">
              <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1 min-w-0">{formatInlineMarkdown(itemText)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 sm:pl-1.5">
              <span className="font-mono font-semibold text-[#2563EB] shrink-0">{numMatch[1]}.</span>
              <span className="flex-1 min-w-0">{formatInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }

        // Header / title
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-main-theme text-xs mt-2.5 mb-1">
              {formatInlineMarkdown(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          return (
            <h3 key={idx} className="font-bold text-main-theme text-xs sm:text-sm mt-3 mb-1 border-b border-theme pb-1">
              {formatInlineMarkdown(trimmed.replace(/^#+\s+/, ''))}
            </h3>
          );
        }

        return <p key={idx} className="leading-relaxed">{formatInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}

function getInitialGreeting(locName: string, temp: number, humidity: number, lang: string): string {
  if (lang === 'mr') {
    return `नमस्कार, पर्यवेक्षक महोदय. मी आपला हीटशील्ड एआय सुरक्षा अधिकारी आहे. मी **${locName}** (${temp.toFixed(1)}°C, ${humidity}% आर्द्रता) साठी उष्मा ताण गणना, ड्युटी रोटेशन मार्गदर्शक, पाणी पिण्याचे वेळापत्रक आणि तातडीचा उष्माघात प्रथमोपचार यात मदत करू शकतो.\n\nआज मी आपल्या ड्युटी नियोजनात कशी मदत करू?`;
  }
  if (lang === 'hi') {
    return `नमस्ते, सुपरवाइजर महोदय। मैं आपका हीटशील्ड एआई सुरक्षा अधिकारी हूँ। मैं **${locName}** (${temp.toFixed(1)}°C, ${humidity}% आर्द्रता) के लिए हीट स्ट्रेस गणना, ड्यूटी रोटेशन दिशा-निर्देश, जलपान समय-सारणी, एवं आपातकालीन हीटस्ट्रोक उपचार में सहायता कर सकता हूँ।\n\nआज मैं आपके ड्यूटी नियोजन में किस प्रकार सहयोग करूँ?`;
  }
  return `Hello, Supervisor. I am your HeatShield AI Safety Officer. I can assist with occupational heat stress calculations, officer rotation guidelines, hydration schedules, and emergency heatstroke triage for **${locName}** (${temp.toFixed(1)}°C, ${humidity}% RH).\n\nHow can I support your duty planning today?`;
}

export const NugenAssistantView: React.FC = () => {
  const { selectedLocation, currentLocationWeather, currentLocationDutyPoints, activeOrg, language, t } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init_1',
      sender: 'assistant',
      text: getInitialGreeting(
        getLocationDisplayName(selectedLocation, language),
        currentLocationWeather.temperature,
        currentLocationWeather.relativeHumidity,
        language
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'local_expert'
    }
  ]);

  // Update initial greeting if user switches language and hasn't chatted yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'init_1') {
        return [
          {
            id: 'init_1',
            sender: 'assistant',
            text: getInitialGreeting(
              getLocationDisplayName(selectedLocation, language),
              currentLocationWeather.temperature,
              currentLocationWeather.relativeHumidity,
              language
            ),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mode: 'local_expert'
          }
        ];
      }
      return prev;
    });
  }, [language, selectedLocation, currentLocationWeather.temperature, currentLocationWeather.relativeHumidity]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nugenStatus, setNugenStatus] = useState<{
    configured: boolean;
    provider: string;
    status: string;
    message: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Nugen backend status on load
  useEffect(() => {
    fetch('/api/nugen/status')
      .then((res) => {
        if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setNugenStatus(data))
      .catch(() =>
        setNugenStatus({
          configured: false,
          provider: 'HeatShield Local Expert Safety Advisor',
          status: 'demo_mode',
          message: 'Running in verified offline HeatShield Safety Advisor mode.'
        })
      );
  }, []);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    // Build location and weather context with language parameter
    const context = {
      locationName: selectedLocation.name,
      country: selectedLocation.country,
      temperature: currentLocationWeather.temperature,
      humidity: currentLocationWeather.relativeHumidity,
      windSpeed: currentLocationWeather.windSpeed,
      riskCategory: currentLocationWeather.temperature >= 38 ? 'High' : 'Moderate',
      dutyPointsCount: currentLocationDutyPoints.length,
      organization: activeOrg.name,
      language
    };

    try {
      const resp = await fetch('/api/nugen/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          context
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: data.mode || (nugenStatus?.configured ? 'live_nugen' : 'local_expert'),
          model: data.model,
          notice: data.statusMessage || data.notice
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // HTTP 400, 401, 403, 404, 429, 500: Fall back immediately to local expert engine
        console.warn(`[Safety Assistant API ${resp.status}] Falling back to HeatShield local expert advisor`);
        const fallbackReply = generateSafetyAssistantResponse(textToSend.trim(), context);
        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'local_expert',
          model: 'heatshield-climate-safety-rule-engine'
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      // In case of complete network disconnect / CORS / static hosting, local expert answers directly
      console.warn('Network unreachable, local safety engine active:', err.message);
      const fallbackReply = generateSafetyAssistantResponse(textToSend.trim(), context);
      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'local_expert',
        model: 'heatshield-climate-safety-rule-engine'
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    t('nugen.q1'),
    t('nugen.q2'),
    t('nugen.q3'),
    t('nugen.q4')
  ];

  return (
    <div className="space-y-4 max-w-full min-w-0">
      {/* Header Bar */}
      <div className="bg-card-theme border-theme shadow-card-theme rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold text-main-theme">{t('nugen.title')}</h1>
                {nugenStatus?.configured ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#16A34A] border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{t('nugen.statusLive')}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] border border-blue-200 dark:border-blue-800 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>
                      {language === 'hi'
                        ? 'स्थानीय विशेषज्ञ सुरक्षा सलाहकार'
                        : language === 'mr'
                        ? 'स्थानिक तज्ज्ञ सुरक्षा सल्लागार'
                        : 'Local Safety Advisor (Verified)'}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-theme mt-0.5 truncate">
                {t('nugen.subtitle')}
              </p>
            </div>
          </div>

          <a
            href="https://docs.nugen.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-theme hover:text-[#2563EB] flex items-center gap-1 shrink-0 transition-colors self-start sm:self-auto"
          >
            <span>Nugen Intelligence API</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* API Key Status Notice */}
        {!nugenStatus?.configured && (
          <div className="mt-3.5 p-3 bg-subtle-theme border border-theme rounded-xl text-xs text-secondary-theme flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed min-w-0">
              <strong className="text-main-theme">
                {language === 'hi' ? 'सक्रिय सुरक्षा मोड:' : language === 'mr' ? 'सक्रिय सुरक्षा मोड:' : 'Active Safety Architecture:'}{' '}
              </strong>
              {language === 'hi'
                ? 'हीटशील्ड एआई स्थानीय विशेषज्ञ सुरक्षा सलाहकार इंजन पर चल रहा है (100% अपटाइम)। लाइव न्यूजेन इंटेलिजेंस सक्षम करने हेतु सर्वर वातावरण में NUGEN_API_KEY सेट करें।'
                : language === 'mr'
                ? 'हीटशील्ड एआई स्थानिक तज्ज्ञ सुरक्षा सल्लागार इंजिनवर चालत आहे (१००% अपटाइम). थेट न्यूजेन इंटेलिजन्स सक्षम करण्यासाठी सर्व्हर वातावरणात NUGEN_API_KEY सेट करा.'
                : 'HeatShield AI is currently powered by the built-in expert occupational heat-stress engine (100% offline uptime). To enable live cloud inference from Nugen Intelligence, configure NUGEN_API_KEY in server environment variables.'}
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-card-theme border-theme shadow-card-theme rounded-2xl flex flex-col h-[600px] max-h-[82vh] overflow-hidden min-w-0">
        {/* Messages Scroll Area */}
        <div className="p-3.5 sm:p-5 flex-1 overflow-y-auto space-y-4 min-w-0 overscroll-contain">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 min-w-0 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2563EB] text-white font-medium rounded-tr-none'
                    : 'bg-subtle-theme text-main-theme border border-theme rounded-tl-none'
                }`}
              >
                {renderMarkdownContent(msg.text)}

                <div
                  className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono ${
                    msg.sender === 'user'
                      ? 'border-blue-400/40 text-blue-100'
                      : 'border-theme text-muted-theme'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-1">
                      {msg.mode === 'live_nugen' ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Nugen AI (api.nugen.in)</span>
                        </span>
                      ) : msg.mode === 'gemini_live' ? (
                        <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-semibold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Gemini 2.5 Flash</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[#2563EB] dark:text-blue-400 border border-blue-500/20 font-semibold flex items-center gap-1">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          <span>
                            {language === 'hi'
                              ? 'हीटशील्ड विशेषज्ञ सुरक्षा सलाहकार'
                              : language === 'mr'
                              ? 'हीटशील्ड तज्ज्ञ सुरक्षा सल्लागार'
                              : 'HeatShield Local Safety Advisor'}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5 sm:gap-3 justify-start animate-in fade-in">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="bg-subtle-theme border border-theme rounded-2xl p-3 sm:p-3.5 text-xs text-muted-theme flex items-center gap-2 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-500" />
                <span>{t('nugen.thinking')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Responsive Quick Question Suggestions */}
        <div className="p-2.5 sm:p-3 bg-subtle-theme border-t border-theme shrink-0">
          <div className="text-[10px] font-mono uppercase text-muted-theme mb-1.5 px-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2563EB]" />
            <span>
              {language === 'hi'
                ? 'सुझाए गए त्वरित सुरक्षा प्रश्न:'
                : language === 'mr'
                ? 'सुचवलेले त्वरित सुरक्षा प्रश्न:'
                : 'Suggested Safety Inquiries:'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-2.5 py-1.5 sm:px-3 text-[11px] font-medium rounded-xl bg-card-theme border-theme text-secondary-theme hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors shadow-xs text-left max-w-full disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Sticky Input Bar */}
        <div className="p-3 sm:p-3.5 bg-card-theme border-t border-theme sticky bottom-0 z-10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={t('nugen.inputPlaceholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs input-theme rounded-xl placeholder:text-muted-theme focus:outline-hidden min-w-0"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nugen.send')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
