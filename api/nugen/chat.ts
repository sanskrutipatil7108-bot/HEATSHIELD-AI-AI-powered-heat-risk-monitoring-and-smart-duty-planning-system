import { generateSafetyAssistantResponse } from '../../src/services/safetyAdvisor';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, context } = req.body || {};
  const nugenKey = process.env.NUGEN_API_KEY?.trim();
  const rawBase = process.env.NUGEN_BASE_URL?.trim() || 'https://api.nugen.in';
  const cleanBase = rawBase.replace(/\/v1\/?$/, '').replace(/\/+$/, '');
  const nugenModel = process.env.NUGEN_MODEL?.trim() || 'Qwen/Qwen2.5-7B-Instruct';
  const lang = (context?.language || 'en').toLowerCase();

  // 1. Try Nugen Intelligence API if key is present
  if (nugenKey) {
    const candidateEndpoints = [
      `${cleanBase}/api/v3/chat/completions`,
      `${cleanBase}/api/v3/openai/chat/completions`,
      `${cleanBase}/chat/completions`
    ];

    const langName = lang === 'mr' ? 'Marathi' : lang === 'hi' ? 'Hindi' : 'English';
    const nugenPayload = {
      model: nugenModel,
      messages: [
        {
          role: 'system',
          content: `You are HeatShield AI Safety Officer, an expert occupational heat stress and climate safety specialist for traffic police and outdoor municipal workers.
Location context: ${JSON.stringify(context || {})}.
Answer naturally, accurately, and completely in ${langName} with clear markdown bullet points and structured sections.
Cover hydration, ORS, duty rotation intervals, and heat illness first aid.`
        },
        ...(messages || []).map((m: any) => ({
          role: m.role || (m.sender === 'user' ? 'user' : 'assistant'),
          content: m.content || m.text || ''
        }))
      ],
      temperature: 0.6,
      max_tokens: 800
    };

    for (const endpoint of candidateEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nugenKey}`
          },
          body: JSON.stringify(nugenPayload),
          signal: AbortSignal.timeout(9000)
        });

        if (response.ok) {
          const data = await response.json();
          const content =
            data.choices?.[0]?.message?.content ||
            data.choices?.[0]?.text ||
            data.reply ||
            data.content;

          if (content && content.trim().length > 0) {
            return res.status(200).json({
              reply: content.trim(),
              mode: 'live_nugen',
              model: data.model || nugenModel,
              timestamp: new Date().toISOString()
            });
          }
        } else {
          console.warn(`[Nugen API HTTP ${response.status}] on ${endpoint}`);
          if (response.status === 404) continue;
          break;
        }
      } catch (err: any) {
        console.warn(`[Nugen API Error] on ${endpoint}:`, err.message);
      }
    }
  }

  // 2. Fallback to HeatShield Local Expert Safety Advisor
  const lastUserMsg = messages?.[messages.length - 1]?.content || messages?.[messages.length - 1]?.text || '';
  const localReply = generateSafetyAssistantResponse(lastUserMsg, context);

  return res.status(200).json({
    reply: localReply,
    mode: 'local_expert',
    model: 'heatshield-local-rule-engine',
    timestamp: new Date().toISOString(),
    statusMessage: nugenKey
      ? 'Live Nugen AI service temporarily unreachable. Response provided by HeatShield Local Expert Advisor.'
      : 'Active in verified HeatShield Local Expert Safety mode.'
  });
}
