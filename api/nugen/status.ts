export default function handler(_req: any, res: any) {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  const hasNugen = Boolean(process.env.NUGEN_API_KEY && process.env.NUGEN_API_KEY.trim().length > 0);
  const isConfigured = hasGemini || hasNugen;

  res.status(200).json({
    configured: isConfigured,
    provider: hasNugen
      ? 'Nugen Intelligence (api.nugen.in)'
      : hasGemini
      ? 'Google Gemini AI'
      : 'HeatShield Local Safety Advisor',
    status: isConfigured ? 'live' : 'demo_mode',
    message: isConfigured
      ? 'Live AI Intelligence connected.'
      : 'Running in verified offline HeatShield Local Expert mode.',
    docs: 'https://docs.nugen.in/'
  });
}
