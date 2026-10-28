import React, { useState, useEffect, useRef } from 'react';
import { Interviewer, Language, Message } from '../types';
import { translations } from '../utils/translations';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  PhoneOff,
  Subtitles,
  Send,
  Sparkles,
  Volume2,
  AlertTriangle,
  Code2,
} from 'lucide-react';

interface GoogleMeetRoomProps {
  language: Language;
  interviewer: Interviewer;
  initialGreeting: string;
  initialChatSnippet?: string;
  cameraInitiallyOn: boolean;
  onFinishInterview: (conversation: Message[], cameraOn: boolean) => void;
  onLeaveHome: () => void;
  targetRole: string;
}

export const GoogleMeetRoom: React.FC<GoogleMeetRoomProps> = ({
  language,
  interviewer,
  initialGreeting,
  initialChatSnippet,
  cameraInitiallyOn,
  onFinishInterview,
  onLeaveHome,
  targetRole,
}) => {
  const t = translations[language];

  // Call & Audio states
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(cameraInitiallyOn);
  const [isCaptionsOn, setIsCaptionsOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [showEndCallModal, setShowEndCallModal] = useState(false);

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_0',
      speaker: 'interviewer',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const totalTurns = 4;
  const [interviewerStatus, setInterviewerStatus] = useState<'speaking' | 'listening' | 'evaluating'>('speaking');

  // Input state
  const [candidateSpeechText, setCandidateSpeechText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [liveCaptionText, setLiveCaptionText] = useState(initialGreeting);

  // Time remaining (starts at 15:00 = 900 seconds)
  const [secondsLeft, setSecondsLeft] = useState(900);

  // Audio & Video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Play audio for a spoken response
  const playSpeech = async (text: string) => {
    setInterviewerStatus('speaking');
    setLiveCaptionText(text);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: interviewer.voice || 'Fenrir' }),
      });
      const data = await res.json();

      if (data.success && data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audioPlayerRef.current = audio;
        audio.onended = () => {
          setInterviewerStatus('listening');
          startSpeechRecognition();
        };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Backend TTS failed, using browser speech synthesis:', e);
    }

    // Fallback to Web Speech Synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.onend = () => {
        setInterviewerStatus('listening');
        startSpeechRecognition();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setInterviewerStatus('listening');
      startSpeechRecognition();
    }
  };

  // Start browser speech recognition (Web Speech API)
  const startSpeechRecognition = () => {
    if (!micOn) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecognizing(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateSpeechText(transcript);
        setLiveCaptionText(transcript);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecognizing(false);
      };

      recognition.onend = () => {
        setIsRecognizing(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecognizing(false);
    }
  };

  // Initial greeting playback and webcam setup
  useEffect(() => {
    // 1. Play first question
    playSpeech(initialGreeting);

    // If there was an initial chat snippet, inject it
    if (initialChatSnippet) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_snippet_0',
          speaker: 'interviewer',
          text: initialChatSnippet,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSnippet: true,
        },
      ]);
      setUnreadChatCount((c) => c + 1);
    }

    // 2. Camera feed
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Webcam stream not accessible:', err);
      }
    }

    if (cameraOn) {
      startWebcam();
    }

    // 3. Countdown timer
    const timerInterval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
      stopSpeechRecognition();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Submit candidate answer and get interviewer's next turn
  const handleSendAnswer = async () => {
    if (!candidateSpeechText.trim()) return;

    stopSpeechRecognition();
    const candidateMsg: Message = {
      id: 'msg_' + Date.now(),
      speaker: 'candidate',
      text: candidateSpeechText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, candidateMsg];
    setMessages(updatedMessages);
    setCandidateSpeechText('');
    setInterviewerStatus('evaluating');

    try {
      const res = await fetch('/api/interview/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewer,
          conversationHistory: updatedMessages,
          candidateInput: candidateMsg.text,
          questionNumber: currentTurn + 1,
          totalQuestions: totalTurns,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const interviewerReply: Message = {
          id: 'msg_rep_' + Date.now(),
          speaker: 'interviewer',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const newHistory = [...updatedMessages, interviewerReply];

        if (data.chatSnippet) {
          newHistory.push({
            id: 'msg_snip_' + Date.now(),
            speaker: 'interviewer',
            text: data.chatSnippet,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSnippet: true,
          });
          setUnreadChatCount((c) => c + 1);
        }

        setMessages(newHistory);
        setCurrentTurn((t) => t + 1);

        // Speak the reply
        await playSpeech(data.reply);

        if (data.isWrapUp || currentTurn >= totalTurns) {
          setTimeout(() => {
            onFinishInterview(newHistory, cameraOn);
          }, 4000);
        }
      }
    } catch (err) {
      console.error('Failed to get interviewer turn:', err);
      setInterviewerStatus('listening');
    }
  };

  const handleEndCallClick = () => {
    setShowEndCallModal(true);
  };

  const confirmEndCallWithVerdict = () => {
    stopSpeechRecognition();
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowEndCallModal(false);
    onFinishInterview(messages, cameraOn);
  };

  const handleExitToHome = () => {
    stopSpeechRecognition();
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowEndCallModal(false);
    onLeaveHome();
  };

  const toggleMic = () => {
    if (micOn) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !cameraOn;
      });
    }
    setCameraOn(!cameraOn);
  };

  return (
    <div className="fixed inset-0 bg-[#202124] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* 1. TOP BAR */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-white/10 shrink-0 bg-[#202124]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-xs font-bold">
            M
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-200">
            {t.meetTitle}
          </span>
          <span className="text-xs text-slate-400 border-l border-white/20 pl-3">
            {targetRole}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-300">
          <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-md border border-white/10">
            <span>{formatTime(secondsLeft)}</span>
            <span className="text-slate-500">|</span>
            <span className="text-blue-400 font-sans font-semibold">
              {language === 'pt'
                ? `Pergunta ${currentTurn} de ${totalTurns}`
                : `Question ${currentTurn} of ${totalTurns}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN VIDEO STAGE */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Video Grid (Interviewer & Candidate) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Tile 1: Interviewer */}
          <div className="relative rounded-2xl overflow-hidden bg-[#2d2e30] border border-white/10 shadow-lg flex items-center justify-center">
            <img
              src={interviewer.avatarUrl}
              alt={interviewer.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Speaking Pulse Ripple */}
            {interviewerStatus === 'speaking' && (
              <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl animate-pulse pointer-events-none" />
            )}

            {/* Interviewer Overlay Info */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <div
                className={`w-2 h-2 rounded-full ${
                  interviewerStatus === 'speaking' ? 'bg-blue-400 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span className="font-semibold">{interviewer.name}</span>
              <span className="text-slate-400">({interviewer.company})</span>
            </div>

            {/* Interviewer Status Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-slate-300 border border-white/10 flex items-center gap-1.5">
              {interviewerStatus === 'speaking' && (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
                  <span>{t.interviewerSpeaking}</span>
                </>
              )}
              {interviewerStatus === 'listening' && (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.interviewerListening}</span>
                </>
              )}
              {interviewerStatus === 'evaluating' && (
                <>
                  <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>{t.interviewerThinking}</span>
                </>
              )}
            </div>
          </div>

          {/* Tile 2: Candidate (Webcam Feed) */}
          <div className="relative rounded-2xl overflow-hidden bg-[#2d2e30] border border-white/10 shadow-lg flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                !cameraOn ? 'hidden' : 'block'
              }`}
            />

            {!cameraOn && (
              <div className="text-center p-6">
                <div className="w-20 h-20 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-white/10">
                  <VideoOff className="w-8 h-8" />
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  {language === 'pt' ? 'Você (Câmera Desligada)' : 'You (Camera Off)'}
                </div>
                <div className="mt-2 text-xs text-amber-400 flex items-center justify-center gap-1.5 bg-amber-950/40 px-3 py-1 rounded-md border border-amber-800/60 max-w-xs mx-auto">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {language === 'pt'
                      ? 'Risco de desclassificação em vagas dos EUA'
                      : 'High risk of rejection in US interviews'}
                  </span>
                </div>
              </div>
            )}

            {/* Candidate Bottom Tag */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <div className={`w-2 h-2 rounded-full ${micOn ? 'bg-emerald-400' : 'bg-red-500'}`} />
              <span className="font-semibold">{language === 'pt' ? 'Você (Candidato)' : 'You (Candidate)'}</span>
              {isRecognizing && (
                <span className="text-emerald-400 font-mono text-[11px] animate-pulse">
                  [MIC ON: LISTENING]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Drawer: Google Meet In-Call Chat */}
        {isChatOpen && (
          <div className="w-80 md:w-96 bg-[#2d2e30] rounded-2xl border border-white/10 flex flex-col h-full shadow-2xl shrink-0 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {t.openChat}
              </h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl ${
                    msg.speaker === 'interviewer'
                      ? msg.isSnippet
                        ? 'bg-slate-900 border border-blue-500/50 text-blue-200 font-mono'
                        : 'bg-white/5 border border-white/10 text-slate-200'
                      : 'bg-blue-600/30 border border-blue-500/40 text-blue-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {msg.speaker === 'interviewer' ? interviewer.name : 'You'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.isSnippet ? (
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Code / Architecture Challenge:</span>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-[11px] bg-black/40 p-2 rounded">
                        {msg.text}
                      </pre>
                    </div>
                  ) : (
                    <p className="leading-relaxed">{msg.text}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Answer Sender inside Chat */}
            <div className="p-3 border-t border-white/10 bg-[#202124]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={candidateSpeechText}
                  onChange={(e) => setCandidateSpeechText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
                  placeholder={t.chatPlaceholder}
                  className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendAnswer}
                  disabled={!candidateSpeechText.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. CAPTION & VERBAL SPEECH INPUT STRIP */}
      {isCaptionsOn && (
        <div className="px-6 py-2 bg-black/50 border-t border-white/5 flex items-center justify-between gap-4 text-xs">
          <div className="flex-1 flex items-center gap-3">
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider shrink-0">
              {interviewerStatus === 'speaking' ? 'Interviewer Audio:' : 'Live Speech-to-Text:'}
            </span>
            <span className="text-slate-200 truncate italic">
              "{liveCaptionText || (language === 'pt' ? 'Fale em inglês agora...' : 'Speak now in English...')}"
            </span>
          </div>

          <button
            onClick={handleSendAnswer}
            disabled={!candidateSpeechText.trim()}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>{t.sendBtn}</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 4. GOOGLE MEET BOTTOM CONTROL BAR */}
      <div className="h-18 px-6 bg-[#202124] border-t border-white/10 flex items-center justify-between shrink-0">
        {/* Left: Meeting Details */}
        <div className="text-xs text-slate-400 hidden sm:block">
          <div className="font-semibold text-slate-200">
            {language === 'pt' ? 'Simulação em Andamento' : 'Live Mock Interview'}
          </div>
          <div className="text-[11px]">meet.google.com/sim-tech-eng</div>
        </div>

        {/* Center: Iconic Google Meet Action Circles */}
        <div className="flex items-center gap-3">
          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              micOn ? 'bg-[#3c4043] hover:bg-[#474a4d] text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={micOn ? t.muteMic : t.unmuteMic}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleCamera}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              cameraOn
                ? 'bg-[#3c4043] hover:bg-[#474a4d] text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={cameraOn ? t.turnCameraOff : t.turnCameraOn}
          >
            {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Captions Button */}
          <button
            onClick={() => setIsCaptionsOn(!isCaptionsOn)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isCaptionsOn ? 'bg-blue-600 text-white' : 'bg-[#3c4043] hover:bg-[#474a4d] text-white'
            }`}
            title="Closed Captions"
          >
            <Subtitles className="w-5 h-5" />
          </button>

          {/* Chat Button */}
          <button
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              setUnreadChatCount(0);
            }}
            className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isChatOpen ? 'bg-blue-600 text-white' : 'bg-[#3c4043] hover:bg-[#474a4d] text-white'
            }`}
            title={t.openChat}
          >
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Red End Call Button */}
          <button
            onClick={handleEndCallClick}
            className="px-6 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors ml-2 shadow-md cursor-pointer"
            title={t.endCall}
          >
            <PhoneOff className="w-4 h-4" />
            <span>{t.endCall}</span>
          </button>
        </div>

        {/* Right: Participants count */}
        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{language === 'pt' ? '2 Participantes' : '2 Participants'}</span>
        </div>
      </div>

      {/* Confirmation Modal when Leaving Call */}
      {showEndCallModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#2d2e30] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <PhoneOff className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {language === 'pt' ? 'Encerrar a Entrevista?' : 'Leave Interview?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'pt'
                  ? 'Você deseja encerrar a chamada e calcular seu Veredito e Diagnóstico agora, ou voltar para a página inicial?'
                  : 'Would you like to finish and calculate your Verdict Report, or return to the home screen?'}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={confirmEndCallWithVerdict}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-md"
              >
                {language === 'pt' ? 'Sim, Gerar Meu Veredito' : 'Yes, Generate My Verdict'}
              </button>

              <button
                onClick={handleExitToHome}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                {language === 'pt' ? 'Descartar e Voltar ao Início' : 'Discard and Exit to Home'}
              </button>

              <button
                onClick={() => setShowEndCallModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {language === 'pt' ? 'Continuar na Chamada' : 'Cancel and Stay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
