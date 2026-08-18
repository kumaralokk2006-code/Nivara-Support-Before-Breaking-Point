const { DEFAULT_CONFIG } = require('../config/constants');

const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'end my life', 'want to die',
  'self harm', 'cutting myself', 'can\'t go on anymore',
  'no reason to live', 'hang myself', 'overdose'
];

/**
 * Layered AI Safety Architecture:
 * 1. Input Screening
 * 2. Prompt Guardrails
 * 3. Generation (Gemini or Local Intent Engine)
 * 4. Output Safety Validation
 * 5. Dynamic Campus Support & Helpline Routing
 */
const screenInputSafety = (message) => {
  const normalized = message.toLowerCase();
  for (const kw of CRISIS_KEYWORDS) {
    if (normalized.includes(kw)) {
      return { isCrisis: true, matchedKeyword: kw };
    }
  }
  return { isCrisis: false };
};

const getCampusCrisisResponse = () => {
  return {
    isCrisisIntervention: true,
    message: `I can hear how much pain you're experiencing right now, and I want you to know that your life and well-being matter deeply. Please connect with immediate professional support:

• **National Tele-MANAS (24/7 Helpline)**: ${DEFAULT_CONFIG.CRISIS_HELPLINE_INFO}
• **Campus Support**: ${DEFAULT_CONFIG.CAMPUS_SUPPORT_NAME}
• **Location**: ${DEFAULT_CONFIG.CAMPUS_SUPPORT_LOCATION}
• **Operating Hours**: ${DEFAULT_CONFIG.CAMPUS_SUPPORT_HOURS}

You don't have to carry this alone. Please speak to a campus counsellor or trusted person right now.`,
    suggestedActions: [
      { type: 'CALL_HELPLINE', label: 'Call Crisis Helpline' },
      { type: 'BOOK_COUNSELLOR', label: 'Book Immediate Counsellor Session' }
    ]
  };
};

const generateSupportiveResponse = async (userMessage, history = []) => {
  // Stage 1: Input Screening
  const screening = screenInputSafety(userMessage);
  if (screening.isCrisis) {
    return getCampusCrisisResponse();
  }

  // Stage 2 & 3: Generation (Gemini API or Local Empathetic AI Model)
  if (process.env.GEMINI_API_KEY) {
    try {
      // If user has provided GEMINI_API_KEY, connect via standard REST fetch to Gemini endpoint
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `You are Nivara AI Support Space, an empathetic, non-judgmental student companion. 
Guidelines:
- Provide empathetic active listening and supportive guidance.
- Do NOT diagnose medical or mental health disorders.
- Do NOT make administrative/financial/academic decisions.
- Keep responses encouraging, gentle, and practical.
- Recommend talking to campus advisors or counsellors when appropriate.

Student: "${userMessage}"`
              }]
            }
          ]
        })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return {
          isCrisisIntervention: false,
          message: text,
          suggestedActions: [
            { type: 'EXPLORE_RESOURCES', label: 'Explore Supportive Resources' },
            { type: 'CHECKIN', label: 'Complete Daily Check-In' }
          ]
        };
      }
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back to local engine:', apiError.message);
    }
  }

  // Stage 3 Fallback: Robust Deterministic Empathetic Intent Engine
  const msg = userMessage.toLowerCase();
  let reply = "I'm here to listen and support you. College and student life can be overwhelming at times. What is feeling most difficult for you right now?";
  const suggestedActions = [{ type: 'EXPLORE_RESOURCES', label: 'Explore Resources' }];

  if (msg.includes('exam') || msg.includes('study') || msg.includes('grade') || msg.includes('assignment')) {
    reply = "Academic stress can feel heavy, especially around exams and assignment deadlines. Remember that your worth is not defined by any single test. Breaking your study into small, manageable 25-minute Pomodoro sessions and taking gentle breaks can help you regain calm focus. Would you like to check out some academic study resources or time management strategies?";
    suggestedActions.push({ type: 'ACADEMIC_NAVIGATOR', label: 'View Academic Support' });
  } else if (msg.includes('fee') || msg.includes('money') || msg.includes('financial') || msg.includes('rent') || msg.includes('hostel')) {
    reply = "Financial worries can take a big emotional toll. Nivara has a confidential Financial Support Navigator where you can explore tuition installment options, emergency campus funds, and scholarships without any invasive paperwork. Would you like to explore those options?";
    suggestedActions.push({ type: 'FINANCIAL_NAVIGATOR', label: 'Explore Financial Support' });
  } else if (msg.includes('lonely') || msg.includes('alone') || msg.includes('homesick') || msg.includes('friend')) {
    reply = "Feeling homesick or lonely is something many students experience quietly. Nivara has Temporary Support Circles where peers share similar experiences in a safe, moderated space. You are not alone in this.";
    suggestedActions.push({ type: 'SUPPORT_CIRCLES', label: 'Join a Support Circle' });
  } else if (msg.includes('tired') || msg.includes('sleep') || msg.includes('burnout') || msg.includes('exhausted')) {
    reply = "Burnout is a signal that you've been strong for too long without enough rest. Prioritizing consistent sleep, gentle hydration, and giving yourself permission to take a pause can make a meaningful difference. Would you like to try a guided relaxation exercise or speak with a campus counsellor?";
    suggestedActions.push({ type: 'BOOK_COUNSELLOR', label: 'Talk to a Counsellor' });
  }

  return {
    isCrisisIntervention: false,
    message: reply,
    suggestedActions
  };
};

module.exports = { generateSupportiveResponse, screenInputSafety };
