import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint 1: Initialize Interview session with candidate resume + job description
app.post('/api/interview/init', async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription, targetRole, level, interviewType, language } = req.body;

    const interviewerOptions = [
      {
        name: 'David Keller',
        role: 'Director of Engineering',
        company: 'CloudScale Inc. (San Francisco)',
        avatarUrl: '/src/assets/images/interviewer_marcus_google_1793193588462.jpg',
        style: 'Direct, focused on trade-offs, architecture scalability, and clear verbal reasoning.',
        voice: 'Fenrir',
      },
      {
        name: 'Elena Vance',
        role: 'Principal Staff Architect',
        company: 'Vanguard Systems (London / New York)',
        avatarUrl: '/src/assets/images/interviewer_elena_staff_1793193587674.jpg',
        style: 'Incisive, probes for edge cases, deeply interested in how you think out loud under pressure.',
        voice: 'Kore',
      },
    ];

    // Randomize interviewer personality as agreed in Phase 5
    const selectedInterviewer = interviewerOptions[Math.floor(Math.random() * interviewerOptions.length)];

    let initialGreeting = `Hello! Welcome. I'm ${selectedInterviewer.name}, ${selectedInterviewer.role} at ${selectedInterviewer.company}. I've had a look at your resume and the requirements for the ${targetRole || 'Software Engineering'} position. Let's start with a brief overview of the most technically challenging system you designed recently. Walk me through your architectural decisions.`;
    let initialSnippet = '';

    if (ai) {
      try {
        const prompt = `You are ${selectedInterviewer.name}, ${selectedInterviewer.role} at ${selectedInterviewer.company}.
Interview Type: ${interviewType || 'Technical & System Design'}
Target Role: ${targetRole || 'Senior Software Engineer'}
Target Level: ${level || 'Senior'}
Candidate Resume Context:
${(resumeText || 'General Fullstack & Backend Engineer with 5+ years experience').slice(0, 1500)}

Target Job Description:
${(jobDescription || 'Senior Software Engineer building scalable distributed microservices in Go, TypeScript, AWS, and PostgreSQL').slice(0, 1500)}

Generate an authentic, professional opening question for a live Google Meet technical interview in English.
Keep it concise (2-4 sentences max), conversational, and directly referencing one relevant technology or challenge from the job requirements and resume.
Also optionally include a 2-4 line code snippet or architectural diagram snippet in markdown if appropriate for this stage.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                greeting: {
                  type: Type.STRING,
                  description: 'The verbal opening spoken by the interviewer in English.',
                },
                chatSnippet: {
                  type: Type.STRING,
                  description: 'Optional short code snippet or problem prompt sent in the Google Meet chat. Empty string if none.',
                },
              },
              required: ['greeting'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.greeting) {
          initialGreeting = parsed.greeting;
        }
        if (parsed.chatSnippet) {
          initialSnippet = parsed.chatSnippet;
        }
      } catch (err) {
        console.error('Gemini init interview fallback triggered:', err);
      }
    }

    res.json({
      success: true,
      interviewer: selectedInterviewer,
      greeting: initialGreeting,
      chatSnippet: initialSnippet,
    });
  } catch (error: any) {
    console.error('Error in /api/interview/init:', error);
    res.status(500).json({ error: error.message || 'Failed to initialize interview' });
  }
});

// Endpoint 2: Turn dialogue (Candidate speaks -> Interviewer reacts, challenges, or asks follow-up)
app.post('/api/interview/turn', async (req: Request, res: Response) => {
  try {
    const {
      interviewer,
      conversationHistory,
      candidateInput,
      questionNumber,
      totalQuestions = 4,
      targetRole,
      jobDescription,
    } = req.body;

    const isWrapUp = questionNumber >= totalQuestions;

    let interviewerReply = "That's an interesting approach. Could you elaborate on how you handle race conditions or failure states in that specific layer?";
    let chatSnippet = '';

    if (ai) {
      try {
        const historyText = (conversationHistory || [])
          .map((m: any) => `${m.speaker === 'interviewer' ? interviewer.name : 'Candidate'}: ${m.text}`)
          .slice(-6)
          .join('\n');

        const prompt = `You are ${interviewer?.name || 'Interviewer'}, ${interviewer?.role || 'Tech Lead'}.
You are in a live Google Meet technical interview in English.
Candidate latest response: "${candidateInput}"
Conversation history:
${historyText}

Target Job Context:
${(jobDescription || 'High-scale distributed systems, reliability, latency, English communication').slice(0, 1000)}

Current Question Number: ${questionNumber} of ${totalQuestions}.
${isWrapUp ? 'This is the final turn. Thank the candidate warmly, acknowledge their answers, and explain that our hiring committee will review their performance.' : 'Acknowledge their answer with realistic technical feedback, challenge any weak points or vague explanations, and ask the next technical follow-up question. Be realistic, sharp, professional.'}

Respond strictly in JSON. Keep verbal speech under 60 words so it sounds natural in a voice conversation.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                speech: {
                  type: Type.STRING,
                  description: 'The verbal response spoken by the interviewer in English.',
                },
                chatSnippet: {
                  type: Type.STRING,
                  description: 'Optional short code snippet or requirement to paste in the chat window.',
                },
              },
              required: ['speech'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.speech) {
          interviewerReply = parsed.speech;
        }
        if (parsed.chatSnippet) {
          chatSnippet = parsed.chatSnippet;
        }
      } catch (err) {
        console.error('Turn generation fallback:', err);
      }
    }

    res.json({
      success: true,
      reply: interviewerReply,
      chatSnippet,
      isWrapUp,
    });
  } catch (error: any) {
    console.error('Error in /api/interview/turn:', error);
    res.status(500).json({ error: error.message || 'Failed to process turn' });
  }
});

// Endpoint 3: Complete Tech Lead Diagnostic & Gamified Veredito
app.post('/api/interview/evaluate', async (req: Request, res: Response) => {
  try {
    const { conversation = [], jobDescription, resumeText, cameraOn, targetRole, level } = req.body;

    const candidateMessages = (conversation || []).filter((c: any) => c.speaker === 'candidate');
    const isEarlyExit = candidateMessages.length === 0;

    // Default calibrated evaluation
    let evaluation = {
      score: isEarlyExit ? 42 : 68,
      status: 'REPROVADO_NA_ETAPA' as 'APROVADO' | 'REPROVADO_NA_ETAPA' | 'RISCO_ALTO',
      cameraFactor: cameraOn
        ? { status: 'OPTIMAL', message: 'Câmera ligada: Demonstrou engajamento visual pleno, alinhado com padrões de trabalho remoto global.' }
        : { status: 'CRITICAL_RISK', message: 'Câmera desligada: Em mais de 90% das empresas dos EUA/Europa, manter a câmera fechada é motivo de desclassificação imediata por políticas de segurança.' },
      englishScore: isEarlyExit ? 40 : 65,
      technicalScore: isEarlyExit ? 45 : 72,
      communicationScore: isEarlyExit ? 40 : 67,
      summary: isEarlyExit
        ? 'A simulação foi encerrada antes do candidato responder às perguntas técnicas. Em entrevistas reais internacionais, encerrar a chamada sem concluir as etapas gera desclassificação imediata.'
        : 'O candidato possui base técnica sólida, mas hesitou em momentos críticos de explicação de arquitetura em inglês e usou expressões pouco assertivas.',
      detailedStrengths: isEarlyExit
        ? [
            'Pontualidade ao ingressar na sala da videoconferência.',
            'Currículo bem estruturado para o perfil técnico solicitado.',
          ]
        : [
            'Boa compreensão dos conceitos fundamentais de desacoplamento e microserviços.',
            'Capacidade de propor soluções viáveis para persistência e armazenamento em cache.',
          ],
      criticalWeaknesses: isEarlyExit
        ? [
            'Encerramento precoce da entrevista sem formulação de respostas.',
            'Falta de dados para validação da fluência em inglês sob pressão.',
          ]
        : [
            'Hesitação frequente com vícios de linguagem ("uhm", "like", "you know") durante momentos de pressão.',
            'Dificuldade em pensar em voz alta ("think out loud") ao formular trade-offs de escalabilidade.',
          ],
      rephrasingExamples: [
        {
          candidateQuote: "I think maybe we can put Redis because it is fast and easy to do.",
          seniorTechLeadRephrase: "We should introduce an in-memory Redis cluster as a look-aside cache to protect the primary PostgreSQL database from read spikes, reducing P99 latency to sub-5ms.",
          explanation: "Substitui uma fala hesitante ('I think maybe') por uma justificativa arquitetural precisa com métricas quantitativas (P99 latency).",
        },
        {
          candidateQuote: "If the server breaks, we just restart and see what happened in logs.",
          seniorTechLeadRephrase: "To ensure high availability and fast MTTR, we should configure health-check probes in Kubernetes for automated pod eviction, paired with distributed tracing via OpenTelemetry to diagnose the root cause.",
          explanation: "Demonstra maturidade sênior com termos da indústria (MTTR, OpenTelemetry, automated eviction).",
        },
      ],
      actionPlan: [
        'Treinar o framework STAR (Situation, Task, Action, Result) especificamente para System Design em inglês.',
        'Eliminar vícios de fala praticando pausas silenciosas intencionais em vez de interjeições como "uhm" e "ehh".',
        'Estudar vocabulário de concorrência e consistência de dados (CAP theorem, eventual consistency, idempotency).',
      ],
    };

    // If early exit, return instant evaluation without slow AI call
    if (isEarlyExit) {
      return res.json({ success: true, evaluation });
    }

    if (ai) {
      try {
        const convoSummary = (conversation || [])
          .map((c: any) => `${c.speaker.toUpperCase()}: ${c.text}`)
          .join('\n\n');

        const prompt = `You are a Principal Engineering Director and Senior Hiring Committee Lead at a top US tech enterprise.
Evaluate this candidate's performance in a high-stakes technical interview in English.

Candidate Camera Status: ${cameraOn ? 'CAMERA ON' : 'CAMERA OFF'}
Target Role: ${targetRole || 'Senior Software Engineer'}
Target Level: ${level || 'Senior'}

Candidate Context & Resume:
${(resumeText || 'Fullstack/Backend Dev').slice(0, 800)}

Job Description:
${(jobDescription || 'Distributed systems').slice(0, 800)}

Transcript of the Interview:
${convoSummary}

Provide a rigorous evaluation in JSON format according to the schema.
Scores should be on a scale of 0 to 100:
- If overall score >= 75: status is 'APROVADO'
- If overall score between 60 and 74: status is 'RISCO_ALTO'
- If overall score < 60: status is 'REPROVADO_NA_ETAPA'
Include authentic quote comparisons and a 3-step action plan in Portuguese.`;

        // 4.5 second timeout race so user never hangs
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 4500)
        );

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER, description: 'Overall score from 0 to 100' },
                status: {
                  type: Type.STRING,
                  description: "'APROVADO', 'RISCO_ALTO', or 'REPROVADO_NA_ETAPA'",
                },
                englishScore: { type: Type.INTEGER, description: 'English fluency score 0-100' },
                technicalScore: { type: Type.INTEGER, description: 'Technical accuracy score 0-100' },
                communicationScore: { type: Type.INTEGER, description: 'Communication under pressure 0-100' },
                summary: { type: Type.STRING, description: 'Executive verdict summary in Portuguese' },
                detailedStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of 2-3 specific technical strengths demonstrated',
                },
                criticalWeaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of 2-3 specific points of failure or hesitation',
                },
                rephrasingExamples: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      candidateQuote: { type: Type.STRING },
                      seniorTechLeadRephrase: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ['candidateQuote', 'seniorTechLeadRephrase', 'explanation'],
                  },
                },
                actionPlan: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 concrete immediate action items to prepare for the real interview',
                },
              },
              required: [
                'score',
                'status',
                'englishScore',
                'technicalScore',
                'communicationScore',
                'summary',
                'detailedStrengths',
                'criticalWeaknesses',
                'rephrasingExamples',
                'actionPlan',
              ],
            },
          },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || '{}');
        if (parsed.score !== undefined) {
          evaluation = {
            ...parsed,
            cameraFactor: cameraOn
              ? { status: 'OPTIMAL', message: 'Câmera ligada: Demonstrou engajamento visual pleno, alinhado com padrões de trabalho remoto global.' }
              : { status: 'CRITICAL_RISK', message: 'Câmera desligada: Em mais de 90% das empresas dos EUA/Europa, manter a câmera fechada é motivo de desclassificação imediata por políticas de segurança e autenticidade.' },
          };
        }
      } catch (err) {
        console.warn('Gemini evaluation timeout/fallback triggered:', err);
      }
    }

    res.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error('Error in /api/interview/evaluate:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate interview' });
  }
});

// Endpoint 4: Text-To-Speech with gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Fenrir' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [{ text: text.slice(0, 500) }],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName || 'Fenrir' },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({
            success: true,
            audioBase64: base64Audio,
            mimeType: 'audio/wav',
          });
        }
      } catch (ttsErr) {
        console.warn('Gemini TTS generation error, falling back to browser synthesis flag:', ttsErr);
      }
    }

    // If no API key or TTS failed, inform client to use browser speech synthesis
    res.json({
      success: false,
      useBrowserFallback: true,
    });
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    res.json({ success: false, useBrowserFallback: true });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
