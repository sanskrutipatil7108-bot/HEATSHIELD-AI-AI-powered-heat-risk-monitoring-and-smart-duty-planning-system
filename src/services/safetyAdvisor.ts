/**
 * HeatShield AI - Expert Occupational Heat-Stress & Climate Safety Advisor
 * Provides structured, actionable guidance for outdoor traffic police personnel
 * Supporting English, Hindi, and Marathi.
 */

export interface SafetyContext {
  locationName?: string;
  country?: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  riskCategory?: string;
  dutyPointsCount?: number;
  organization?: string;
  language?: 'en' | 'hi' | 'mr' | string;
}

export interface SafetyAdvisorResult {
  reply: string;
  mode: 'live_nugen' | 'gemini_live' | 'local_expert' | 'error';
  model: string;
  statusMessage?: string;
  timestamp: string;
}

export function generateSafetyAssistantResponse(
  userQuery: string,
  context?: SafetyContext
): string {
  const queryLower = (userQuery || '').toLowerCase();
  const locName = context?.locationName || 'the assigned duty intersection';
  const temp = context?.temperature !== undefined ? `${context.temperature}°C` : 'elevated ambient temperature';
  const humidity = context?.humidity !== undefined ? `${context.humidity}% RH` : 'relative humidity';
  const riskCategory = context?.riskCategory || 'Moderate';
  const lang = (context?.language || 'en').toLowerCase();

  const isHindi = lang === 'hi' || /[\u0900-\u097F]/.test(userQuery);
  const isMarathi = lang === 'mr';

  // 1. Heatstroke vs Heat Exhaustion & Emergency First Aid
  if (
    queryLower.includes('heat stroke') ||
    queryLower.includes('heatstroke') ||
    queryLower.includes('exhaustion') ||
    queryLower.includes('faint') ||
    queryLower.includes('unconscious') ||
    queryLower.includes('emergency') ||
    queryLower.includes('first aid') ||
    queryLower.includes('first-aid') ||
    queryLower.includes('stroke vs') ||
    queryLower.includes('difference') ||
    queryLower.includes('symptom') ||
    queryLower.includes('लक्षण') ||
    queryLower.includes('बेहोश') ||
    queryLower.includes('लू') ||
    queryLower.includes('चक्कर') ||
    queryLower.includes('प्रथमोपचार') ||
    queryLower.includes('उष्माघात') ||
    queryLower.includes('उपचार')
  ) {
    if (isMarathi) {
      return `🚨 **उष्माघात (HEATSTROKE) व उष्मा थकवा (HEAT EXHAUSTION) फरक आणि तातडीचा प्रथमोपचार प्रोटोकॉल**:

### १. लक्षणे कशी ओळखायची:
• **उष्मा थकवा (Heat Exhaustion)**: भरपूर घाम येणे, त्वचा थंड व चिकट पडणे, जलद नाडी, चक्कर येणे, डोकेदुखी, स्नायूंमध्ये पेटके.
• **उष्माघात (Heat Stroke - अतिगंभीर आपत्कालीन स्थिती)**: शरीराचे तापमान > ४०°से (१०४°फॅ), **घाम येणे पूर्णपणे बंद होणे**, त्वचा अतिउष्ण व कोरडी पडणे, मानसिक गोंधळ, बोलताना अडखळणे किंवा बेशुद्ध पडणे.

### २. तातडीची ४ प्रथमोपचार पावले:
१. **रुग्णवाहिका संपर्क**: स्थानिक आपत्कालीन सेवेशी (**१०८ किंवा ११२**) त्वरित संपर्क साधा आणि उष्माघाताची शक्यता सांगा.
२. **सावलीत हलवा**: वाहतूक अंमलदाराला डांबरी रस्त्यावरून तात्काळ वातानुकूलित वाहनात किंवा कॅनोपी शेडमध्ये हलवा. घट्ट गणवेश आणि बेल्ट सैल करा.
३. **सक्रिय जलद शीतकरण (Active Cooling)**:
   - मान, काख आणि पोटावर बर्फाचे पॅक किंवा थंड पाण्याच्या पट्ट्या ठेवा.
   - अंगावर थंड पाणी शिंपडा आणि सतत जोराने वारा घाला.
४. **द्रवपदार्थ देण्याचा नियम**: व्यक्ती बेशुद्ध किंवा अर्धवट शुद्धीत असल्यास **पाणी किंवा ओआरएस जबरदस्तीने पाजू नका**. शुद्धीत असल्यास हळूहळू घोट घोट थंड पाणी द्या.

*महत्त्वाची सूचना: हे तातडीचे प्रथमोपचार मार्गदर्शन आहे. रुग्णाला तात्काळ जवळच्या रुग्णालयात दाखल करणे अनिवार्य आहे.*`;
    }

    if (isHindi) {
      return `🚨 **हीट स्ट्रोक (लू लगना) एवं हीट एग्जॉशन: लक्षण पहचान एवं आपातकालीन प्राथमिक उपचार प्रोटोकॉल**:

### 1. लक्षणों में महत्वपूर्ण अंतर:
• **हीट एग्जॉशन (उष्मा थकान)**: अत्यधिक पसीना आना, त्वचा ठंडी व चिपचिपी होना, तेज नाड़ी, कमजोरी, चक्कर आना, मांसपेशियों में ऐंठन।
• **हीट स्ट्रोक (अति गंभीर मेडिकल इमरजेंसी)**: शरीर का तापमान > 40°C (104°F), **पसीना आना पूरी तरह बंद हो जाना**, त्वचा लाल, गर्म व सूखी होना, मानसिक भ्रम, लड़खड़ाहट या बेहोशी।

### 2. तत्काल 4-चरणीय फील्ड प्राथमिक उपचार:
1. **आपातकालीन कॉल**: तुरंत एम्बुलेंस (**108 या 112**) को कॉल करें और हीट स्ट्रोक की स्थिति बताएं।
2. **छायादार स्थान में स्थानांतरण**: कर्मी को गर्म डामर सड़क से हटाकर तुरंत वातानुकूलित वाहन या शेड में लाएं। भारी वर्दी और बेल्ट ढीली करें।
3. **सक्रिय तीव्र शीतलन (Rapid Active Cooling)**:
   - गर्दन, बगल और जांघों के जोड़ों पर बर्फ की थैली या ठंडे पानी की पट्टियां लगाएं।
   - शरीर पर ठंडा पानी छिड़कें और लगातार पंखा चलाएं।
4. **जलयोजन चेतावनी**: यदि व्यक्ति बेहोश या भ्रम में हो, तो जबरन पानी या ओआरएस **बिल्कुल न पिलाएं**। होश में होने पर ही धीरे-धीरे ठंडा पानी दें।

*सूचना: यह जीवन रक्षक प्राथमिक उपचार है। पीड़ित को तुरंत अस्पताल पहुंचाना आवश्यक है।*`;
    }

    return `🚨 **HEATSTROKE VS HEAT EXHAUSTION: SYMPTOMS & EMERGENCY FIRST-AID PROTOCOL**

### 1. Differentiating Critical Symptoms:
• **Heat Exhaustion (Early Warning)**: Heavy profuse sweating, cold/clammy skin, rapid weak pulse, dizziness, nausea, headache, and severe muscle cramps.
• **Heat Stroke (Life-Threatening Emergency)**: Core body temp > 40°C (104°F), **complete cessation of sweating**, hot dry red skin, confusion, delirium, slurred speech, or loss of consciousness.

### 2. Immediate 4-Step Field Action Plan:
1. **Trigger Emergency Medical Dispatch**: Dial **108 / 112 / 911** immediately and declare suspected heat stroke.
2. **Relocate from Roadway**: Move the officer immediately off the radiating asphalt into an air-conditioned patrol vehicle or deep canopy shade. Loosen uniform vests and gear.
3. **Aggressive Active Cooling**:
   - Place cold ice packs at major vascular points: neck (carotid), axillae (armpits), and groin.
   - Spritz continuous cool water over torso and fan vigorously.
4. **Hydration Rule**: **DO NOT force fluids** if the officer is semi-conscious, disoriented, or vomiting. Offer small chilled sips only when fully alert.`;
  }

  // 2. Hydration, ORS, Water Schedules & Dehydration
  if (
    queryLower.includes('hydration') ||
    queryLower.includes('water') ||
    queryLower.includes('drink') ||
    queryLower.includes('ors') ||
    queryLower.includes('electrolyte') ||
    queryLower.includes('dehydration') ||
    queryLower.includes('fluid') ||
    queryLower.includes('पाणी') ||
    queryLower.includes('जल') ||
    queryLower.includes('पानी') ||
    queryLower.includes('ओआरएस')
  ) {
    if (isMarathi) {
      return `💧 **${locName} येथील वाहतूक पोलिसांसाठी शास्त्रीय हायड्रेशन व ओआरएस (ORS) वेळापत्रक**:

सध्याचे तापमान **${temp}** आणि आर्द्रता **${humidity}** (जोखीम पातळी: **${riskCategory}**):

### १. पाणी पिण्याचे वेळापत्रक:
• **दर १५ ते २० मिनिटांनी २५० मिली (१ ग्लास) थंड पाणी अवश्य प्या**. तहान लागण्याची वाट पाहू नका; तहान लागणे हे डिहायड्रेशनचे सुरुवातीचे लक्षण आहे.
• सलग १ तासाच्या भर उन्हातील ड्युटीदरम्यान **किमान ७५० मिली ते १ लिटर पाणी** शरीरात जाणे आवश्यक आहे.

### २. ओआरएस (ORS) व इलेक्ट्रोलाइट्स नियम:
• घामातून शरीरातील सोडियम व पोटॅशियम मोठ्या प्रमाणात बाहेर पडते.
• २ तासांपेक्षा जास्त वेळेच्या ड्युटीसाठी १ लिटर थंड पाण्यात **१ पाकीट WHO प्रमाणित ORS** मिसळून घोट घोट प्यावे.
• नारळपाणी, लिंबू-पाणी (किंचित मीठ घालून) किंवा ताक हे उत्तम नैसर्गिक पर्याय आहेत.

### ३. डिहायड्रेशन तपासणी (यूरिन कलर स्केल):
• **फिकट पिवळा किंवा पारदर्शक रंग**: उत्तम हायड्रेशन स्थिती.
• **गडद पिवळा किंवा लालसर रंग**: गंभीर डिहायड्रेशन; तात्काळ सावलीत विश्रांती घेऊन इलेक्ट्रोलाइट्सयुक्त पाणी प्या.

### ४. काय टाळावे:
• अति साखरयुक्त शीतपेये, चहा किंवा कॉफीचे अतिसेवन टाळा, कारण यामुळे लघवीचे प्रमाण वाढून डिहायड्रेशन वेगाने होते.`;
    }

    if (isHindi) {
      return `💧 **${locName} पर तैनात ट्रैफिक पुलिसकर्मियों के लिए वैज्ञानिक जलयोजन (हाइड्रेशन) एवं ओआरएस निर्देश**:

वर्तमान पर्यावरणीय स्थिति: **${temp}** एवं **${humidity}** (जोखिम: **${riskCategory}**):

### 1. पानी पीने का अनिवार्य शेड्यूल:
• **हर 15 से 20 मिनट में 250 मिली (एक बड़ा गिलास) ठंडा पानी अवश्य पिएं**। प्यास लगने की प्रतीक्षा न करें।
• धूप में 1 घंटे की ड्यूटी में शरीर को कम से कम **750 मिली से 1 लीटर तरल पदार्थ** मिलना चाहिए।

### 2. ओआरएस (ORS) एवं इलेक्ट्रोलाइट्स का उपयोग:
• पसीने के माध्यम से शरीर से सोडियम और पोटैशियम की भारी हानि होती है।
• 2 घंटे से अधिक की ड्यूटी पर 1 लीटर पानी में **1 पैकेट ओआरएस (WHO फॉर्मूला)** घोलकर पिएं।
• नींबू पानी (हल्का नमक युक्त), छाछ या नारियल पानी इलेक्ट्रोलाइट संतुलन के लिए सर्वश्रेष्ठ हैं।

### 3. निर्जलीकरण (Dehydration) की पहचान:
• **हल्का पीला / साफ यूरिन**: शरीर में पानी की मात्रा संतुलित है।
• **गहरा पीला / भूरा यूरिन**: गंभीर डिहायड्रेशन की चेतावनी; तुरंत 500 मिली ओआरएस पानी पिएं।

### 4. क्या न पिएं:
• अत्यधिक चाय, कॉफी और ज्यादा शक्कर वाले कोल्ड ड्रिंक्स शरीर से पानी तेजी से बाहर निकालते हैं, इनसे बचें।`;
    }

    return `💧 **SCIENTIFIC HYDRATION & ORS PROTOCOLS FOR OUTDOOR OFFICERS AT ${locName.toUpperCase()}**

Current Conditions: **${temp}** | **${humidity}** | Risk Level: **${riskCategory}**

### 1. Point Duty Hydration Schedule:
• **Interval & Volume**: Drink **250 ml (1 full cup) of cool water every 15–20 minutes** on point duty. Do not wait for thirst sensation.
• Target fluid intake: **750 ml to 1,000 ml per hour** under high solar thermal exposure.

### 2. Oral Rehydration Salts (ORS) & Electrolyte Replacement:
• Profuse sweating depletes essential sodium, potassium, and chloride ions.
• For shifts exceeding 90 minutes in direct sun, consume **1 packet of WHO-formula ORS per 1 Liter of water**.
• Natural alternatives: Fresh coconut water, lightly salted lemon water, or buttermilk.

### 3. Dehydration Self-Check (Urine Color Metric):
• **Pale straw / clear**: Optimal hydration equilibrium.
• **Dark amber / brownish**: Critical dehydration; mandatory immediate shade rest and electrolyte intake.

### 4. Substances to Strictly Avoid:
• High-fructose energy drinks, sodas, and excessive black tea/coffee, which accelerate renal fluid loss.`;
  }

  // 3. Duty Hours, Shift Rotation, Rest Breaks & WBGT
  if (
    queryLower.includes('rotation') ||
    queryLower.includes('schedule') ||
    queryLower.includes('shift') ||
    queryLower.includes('duty hours') ||
    queryLower.includes('break') ||
    queryLower.includes('rest') ||
    queryLower.includes('wbgt') ||
    queryLower.includes('30°c') ||
    queryLower.includes('hours') ||
    queryLower.includes('रोटेशन') ||
    queryLower.includes('बदली') ||
    queryLower.includes('शिफ्ट') ||
    queryLower.includes('वेळापत्रक') ||
    queryLower.includes('विश्रांती') ||
    queryLower.includes('काम के घंटे')
  ) {
    if (isMarathi) {
      return `🔄 **${locName} साठी स्मार्ट ड्युटी रोटेशन, कामाचे तास व विश्रांती धोरण (WBGT > ३०°C)**:

सध्याची जोखीम पातळी: **${riskCategory}** (${temp}, ${humidity}):

### १. सलग उन्हातील ड्युटी मर्यादा:
• **दुपारी १२:०० ते १६:०० (अति उष्णतेचा काळ)**: डांबरी रस्त्यावर उभे राहण्याची सलग वेळ जास्तीत जास्त **४५ मिनिटे** ठेवावी.
• तापमान ४०°से पेक्षा जास्त असल्यास सलग ड्युटी **३० मिनिटांवर** मर्यादित करावी.

### २. अनिवार्य सावलीतील विश्रांती:
• प्रत्येक ४५ मिनिटांच्या ड्युटीनंतर किमान **१५ मिनिटे कॅनोपी शेड किंवा वातानुकूलित बूथमध्ये विश्रांती** देणे बंधनकारक आहे.
• विश्रांतीदरम्यान अंमलदारांनी टोपी व जाकीट सैल करून ५०० मिली पाणी किंवा ओआरएस प्यावे.

### ३. जोडीने रोटेशन मॉडेल:
• मुख्य ट्रॅफिक बेट (भर ऊन) आणि बाजूचे सावलीतील बूथ यांच्यात दोन अंमलदारांची आलटून-पालटून ड्युटी लावावी.
• रोटेशन सुरळीत चालण्यासाठी १५% अतिरिक्त राखीव मनुष्यबळ चौकात सज्ज ठेवावे.

### ४. संवेदनशील अंमलदारांची काळजी:
• उच्च रक्तदाब, मधुमेह, हृदयविकार किंवा पूर्वी उष्माघात झालेल्या अंमलदारांना दुपारच्या वेळी भर उन्हात ड्युटी देऊ नये.`;
    }

    if (isHindi) {
      return `🔄 **${locName} के लिए स्मार्ट ड्यूटी रोटेशन, कार्य घंटे एवं विश्राम नीति (WBGT > 30°C)**:

वर्तमान जोखिम स्तर: **${riskCategory}** (${temp}, ${humidity}):

### 1. लगातार आउटडोर ड्यूटी की समय सीमा:
• **दोपहर 12:00 से 16:00 (तीव्र सौर समय)**: मुख्य चौराहे पर सीधी धूप में अधिकतम **45 मिनट** की ड्यूटी सीमित करें।
• यदि तापमान 40°C से अधिक हो, तो लगातार ड्यूटी **30 मिनट** पर सीमित की जानी चाहिए।

### 2. अनिवार्य छायादार विश्रांति (Mandatory Rest):
• प्रत्येक 45 मिनट की पॉइंट ड्यूटी के बाद कम से कम **15 मिनट की छायादार विश्रांति** अनिवार्य है।
• विश्राम के समय हेलमेट/कैप उतारकर चेहरे पर ठंडे पानी के छींटे मारें और ओआरएस पिएं।

### 3. पेयर रोटेशन (Pair Rotation) प्रणाली:
• धूप वाले मुख्य ट्रैफिक द्वीप और छायादार सहायक बूथ के बीच कर्मियों को रोटेट करें।
• ड्यूटी पर राहत देने के लिए 15% रिजर्व बल को रोटेशन में शामिल करें।

### 4. स्वास्थ्य संवेदनशीलता नियम:
• 50 वर्ष से अधिक आयु अथवा बीपी/शुगर से पीड़ित कर्मियों को दोपहर की पीक धूप में तैनात न करें।`;
    }

    return `🔄 **SMART DUTY ROTATION, WORK HOUR LIMITS & REST INTERVAL STRATEGY FOR ${locName.toUpperCase()}**

Current Threat Category: **${riskCategory}** (${temp}, ${humidity})

### 1. Maximum Continuous Exposure Caps:
• **Solar Apex (12:00 – 16:00)**: Under WBGT > 30°C, cap continuous roadway deployment to **45 minutes maximum**.
• When ambient dry-bulb exceeds 40°C, reduce continuous stint to **30 minutes**.

### 2. Mandatory Shaded Recovery Intervals:
• Enforce a strict **1:3 work-to-rest ratio**: 45 minutes on point followed by a minimum **15 minutes active shaded cooling**.
• Officers must loosen gear, sit in a ventilated shelter, and hydrate with 300–500 ml cool fluid during breaks.

### 3. Paired Staggered Rotation:
• Deploy officers in synchronized buddy pairs: while Officer A commands the central unshaded island, Officer B rests or manages a shaded booth, swapping every 45 minutes.

### 4. Vulnerability Screening:
• Personnel with prior heat exhaustion, hypertension, or chronic conditions must be restricted to shaded perimeter posts.`;
  }

  // 4. Cooling Facilities, Misting, Canopies & Shade Infrastructure
  if (
    queryLower.includes('cooling') ||
    queryLower.includes('shelter') ||
    queryLower.includes('facility') ||
    queryLower.includes('misting') ||
    queryLower.includes('umbrella') ||
    queryLower.includes('shade') ||
    queryLower.includes('canopy') ||
    queryLower.includes('छाया') ||
    queryLower.includes('छतरी') ||
    queryLower.includes('सावली') ||
    queryLower.includes('थंडावा') ||
    queryLower.includes('शेड')
  ) {
    if (isMarathi) {
      return `🏗️ **${locName} साठी थंडावा देणाऱ्या सुविधा व शेड इन्फ्रास्ट्रक्चर प्राधान्यक्रम**:

तापमान **${temp}** असताना अंमलदारांच्या संरक्षणासाठी खालील सुविधा सज्ज ठेवा:
१. **अल्ट्राव्हायोलेट संरक्षक कॅनोपी / मोठी छत्री**: ट्रॅफिक बेटावर थेट डोक्यावर किमान ८५% यूव्ही रोखणारी रिफ्लेक्टिव्ह कॅनोपी बसवा.
२. **हाय-प्रेशर मिस्टिंग फॅन्स**: हवेचे तापमान ४°ते ७°से ने त्वरित कमी करण्यासाठी सौरऊर्जेवर चालणारे मिस्टिंग फॅन्स सुरू करा.
३. **थर्मल इन्सुलेटेड थंड पाण्याचे जार**: ड्युटी पॉईंटच्या ३० मीटरच्या आत २० लिटरचे इन्सुलेटेड थंड पाणी आणि ओआरएस डिस्पेंसर ठेवा.
४. **फेज-चेंज कूलिंग जॅकेट्स (PCM Vests)**: भर उन्हात थांबणाऱ्या अंमलदारांना शरीराचे तापमान नियंत्रित ठेवणारे कूलिंग वेस्ट पुरवा.`;
    }

    if (isHindi) {
      return `🏗️ **${locName} के लिए कूलिंग इंफ्रास्ट्रक्चर एवं शेड प्राथमिकताएं**:

तापमान **${temp}** के दौरान कर्मियों की सुरक्षा हेतु आवश्यक कदम:
1. **यूवी रिफ्लेक्टिव कैनोपी / भारी छाता**: चौराहे के मुख्य ट्रैफिक आइलैंड पर न्यूनतम 85% यूवी ब्लॉक वाली कैनोपी लगाएं।
2. **मिस्टिंग स्प्रे यूनिट / कूलर पंखे**: हवा का तापमान 4°C से 7°C तक तुरंत कम करने के लिए मिस्टिंग सिस्टम सक्रिय करें।
3. **इंसुलेटेड ठंडा पानी एवं ओआरएस जार**: ड्यूटी पोस्ट से अधिकतम 30 मीटर की दूरी पर 20 लीटर का ठंडा वाटर डिस्पेंसर सुनिश्चित करें।
4. **फेज-चेंज कूलिंग वेस्ट (Cooling Jackets)**: दोपहर 12:00 से 15:00 की शिफ्ट में तैनात अधिकारियों को कूलिंग वेस्ट उपलब्ध कराएं।`;
    }

    return `🏗️ **COOLING INFRASTRUCTURE & RESPITE FACILITY SPECIFICATIONS FOR ${locName.toUpperCase()}**

Operating under ${temp} Ambient Conditions:
1. **Primary Radiant Barrier**: Install cantilevered modular shade canopies with minimum 85% UV deflection over all stationary junction podiums.
2. **Evaporative Misting Systems**: Deploy high-pressure micro-nozzle misting fans capable of depressing ambient air temperature by 4°C–7°C around officer booths.
3. **Chilled Water Hub**: Place insulated 20-liter chilled electrolyte water stations within 30 meters of the active intersection line.
4. **Phase-Change Material (PCM) Vests**: Issue rechargeable cooling vests engineered to maintain core torso temperature below 37.5°C during peak midday exposure.`;
  }

  // 5. Default General Operational Heat Assessment
  if (isMarathi) {
    return `☀️ **${locName} साठी हीटशील्ड सुरक्षा सल्लागार अहवाल**:

• **पर्यावरणीय स्थिती**: तापमान **${temp}** | आर्द्रता **${humidity}** | जोखीम श्रेणी: **${riskCategory}**
• **डांबरी रस्त्यावरील उष्णता परिणाम**: डांबराच्या उष्णता परावर्तनामुळे रस्त्यावरील प्रत्यक्ष तापमान सामान्य हवेपेक्षा ३° ते ६°से जास्त असते.
• **मुख्य मार्गदर्शक तत्त्वे**:
  १. **हायड्रेशन**: दर १५ ते २० मिनिटांनी २५० मिली थंड पाणी किंवा ओआरएस प्या.
  २. **रोटेशन मर्यादा**: सलग उन्हातील ड्युटी ४५ मिनिटांवर मर्यादित ठेवा आणि १५ मिनिटे सावलीत विश्रांती घ्या.
  ३. **लक्षणे तपासणी**: चक्कर येणे, स्नायूंमध्ये पेटके किंवा मळमळ जाणवल्यास तात्काळ सावलीत विश्रांती घ्या.
  ४. **आपत्कालीन मदत**: उष्माघाताची लक्षणे दिसल्यास त्वरित **१०८ किंवा ११२** क्रमांकावर संपर्क साधा.`;
  }

  if (isHindi) {
    return `☀️ **${locName} के लिए हीटशील्ड सुरक्षा सलाहकार रिपोर्ट**:

• **पर्यावरणीय प्रोफ़ाइल**: तापमान **${temp}** | आर्द्रता **${humidity}** | जोखिम स्तर: **${riskCategory}**
• **डामर रोड हीट प्रभाव**: डामर की सड़क और वाहनों के धुएं के कारण हवा का तापमान सामान्य थर्मामीटर से 3°C से 6°C अधिक गर्म रहता है।
• **मुख्य सुरक्षा निर्देश**:
  1. **नियमित जलयोजन**: हर 15-20 मिनट में 250 मिली ठंडा पानी या ओआरएस अवश्य पिएं।
  2. **ड्यूटी रोटेशन**: धूप में अधिकतम 45 मिनट ड्यूटी के बाद 15 मिनट की छायादार विश्रांति अनिवार्य है।
  3. **प्रारंभिक लक्षण**: अत्यधिक कमजोरी, चक्कर या सिरदर्द होने पर तुरंत छायादार स्थान पर जाएं।
  4. **आपातकालीन प्रोटोकॉल**: बेहोशी या हीट स्ट्रोक की स्थिति में बिना देरी किए **108 या 112** पर कॉल करें।`;
  }

  return `☀️ **HEATSHIELD OPERATIONAL THERMAL ASSESSMENT FOR ${locName.toUpperCase()}**

• **Microclimate Profile**: ${temp} | ${humidity} | Evaluated Risk: **${riskCategory}**
• **Roadway Urban Heat Island**: Radiant black asphalt and vehicular idling elevate intersection air temperatures by 3°C–6°C above standard meteorological readings.
• **Core Safety Recommendations**:
  1. **Hydration Rhythm**: Consume 200–250 ml of chilled water or ORS every 15–20 minutes.
  2. **Continuous Stint Limit**: Cap unshaded roadway exposure at 45 minutes, backed by mandatory 15-minute shaded recovery.
  3. **Early Warning Vigilance**: Monitor officers for dizziness, sudden pale clammy skin, or disorientation.
  4. **Emergency Dispatch**: If core body temperature spikes or sweating stops, initiate immediate 108/112/911 medical evacuation.`;
}
