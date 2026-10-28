import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { Video, VideoOff, Mic, MicOff, ArrowLeft, ArrowRight, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SetupScreenProps {
  language: Language;
  onBack: () => void;
  onLaunchMeeting: (setupData: {
    resumeText: string;
    jobDescription: string;
    targetRole: string;
    level: string;
    interviewType: string;
    cameraOn: boolean;
  }) => void;
  isInitializing: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  language,
  onBack,
  onLaunchMeeting,
  isInitializing,
}) => {
  const t = translations[language];

  // Form State
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');
  const [level, setLevel] = useState('Senior');
  const [interviewType, setInterviewType] = useState('technical');

  // Media Permissions State
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [hasMediaPermission, setHasMediaPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sample templates for rapid testing & user convenience
  const sampleResume = `Lucas Silva - Senior Fullstack & Distributed Systems Engineer
Experience:
- 6+ years building microservices with TypeScript, Node.js, Go, PostgreSQL, and AWS (ECS, Lambda, S3, SQS).
- Designed a high-throughput payment webhook processing pipeline handling 12,000 req/sec with Redis caching.
- Led migration of legacy monolith to event-driven architecture using Apache Kafka.
- Languages: Portuguese (Native), English (Advanced technical comprehension, working on verbal fluency).`;

  const sampleJob = `Company: CloudScale Inc. (US Remote)
Role: Senior Distributed Systems Engineer
Requirements:
- 5+ years of production experience in backend systems (Go, Node.js, or Rust).
- Strong understanding of distributed systems principles: CAP theorem, idempotency, data partitioning, and eventual consistency.
- Experience with relational (PostgreSQL) and caching layers (Redis/Memcached).
- Proven ability to communicate complex architectural trade-offs in English during live team discussions.`;

  const handleLoadSampleResume = () => {
    setResumeText(sampleResume);
  };

  const handleLoadSampleJob = () => {
    setJobDescription(sampleJob);
    setTargetRole('Senior Distributed Systems Engineer');
    setLevel('Senior');
  };

  // Setup webcam preview
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startMedia() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasMediaPermission(true);
      } catch (err) {
        console.warn('Could not access media devices or permission denied:', err);
        setHasMediaPermission(false);
      }
    }

    startMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !cameraOn;
      });
    }
    setCameraOn(!cameraOn);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !micOn;
      });
    }
    setMicOn(!micOn);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLaunchMeeting({
      resumeText: resumeText || sampleResume,
      jobDescription: jobDescription || sampleJob,
      targetRole,
      level,
      interviewType: interviewType === 'technical' ? t.typeTechnical : t.typeRecruiter,
      cameraOn,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'pt' ? 'Voltar para Início' : 'Back to Home'}</span>
          </button>
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            {language === 'pt' ? 'Fase de Calibração' : 'Calibration Phase'}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.setupTitle}</h1>
          <p className="text-sm text-slate-400 max-w-2xl">{t.setupSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Data Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Target Role & Format */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {language === 'pt' ? 'Definições do Cargo' : 'Position Setup'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.targetRoleLabel}
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Ex: Senior Software Engineer"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.seniorityLabel}
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Junior">Junior Engineer</option>
                    <option value="Pleno">Mid-Level Engineer</option>
                    <option value="Senior">Senior Engineer</option>
                    <option value="Staff/Lead">Staff / Principal Architect</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  {t.interviewTypeLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setInterviewType('recruiter')}
                    className={`p-3 rounded-lg text-left text-xs transition-colors border ${
                      interviewType === 'recruiter'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-white mb-0.5">1ª Fase: Screening</div>
                    <div className="text-[11px] text-slate-400">Recrutador, fit cultural e trajetória</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInterviewType('technical')}
                    className={`p-3 rounded-lg text-left text-xs transition-colors border ${
                      interviewType === 'technical'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-white mb-0.5">2ª Fase: Tech Lead</div>
                    <div className="text-[11px] text-slate-400">System Design, arquitetura e lógica</div>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Resume Box */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t.stepResume}
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleResume}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  {t.useExampleResume}
                </button>
              </div>
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Cole seu currículo em texto ou principais tecnologias e projetos..."
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 3. Target Job Box */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t.stepJob}
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleJob}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  {t.useExampleJob}
                </button>
              </div>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Cole o texto da vaga do LinkedIn, Indeed ou site da empresa contratante..."
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Camera / Mic Hardware Check & Launch (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  {t.cameraPermission}
                </h2>

                {/* Video Monitor Tile */}
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center">
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
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                        <VideoOff className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {language === 'pt' ? 'Câmera desativada' : 'Camera is off'}
                      </div>
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`p-2 rounded-full transition-colors ${
                        micOn ? 'text-white hover:bg-slate-800' : 'bg-red-600 text-white'
                      }`}
                      title={micOn ? t.muteMic : t.unmuteMic}
                    >
                      {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleCamera}
                      className={`p-2 rounded-full transition-colors ${
                        cameraOn ? 'text-white hover:bg-slate-800' : 'bg-red-600 text-white'
                      }`}
                      title={cameraOn ? t.turnCameraOff : t.turnCameraOn}
                    >
                      {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Professionalism Warning Banner */}
                <div
                  className={`mt-4 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    cameraOn
                      ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                  }`}
                >
                  {cameraOn ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold mb-0.5">
                      {cameraOn
                        ? language === 'pt'
                          ? 'Excelente: Presença de vídeo ativada'
                          : 'Excellent: Video presence enabled'
                        : language === 'pt'
                        ? 'Atenção ao risco da câmera fechada'
                        : 'Warning: Camera turned off'}
                    </div>
                    <div className="text-[11px] opacity-90 leading-relaxed">
                      {cameraOn
                        ? language === 'pt'
                          ? 'Recrutadores da gringa valorizam contato visual para validar autenticidade e raciocínio.'
                          : 'Global hiring teams require video to verify candidate authenticity and engagement.'
                        : t.cameraWarning}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 mt-6 border-t border-slate-700/80">
                <button
                  type="submit"
                  disabled={isInitializing}
                  className="w-full py-3.5 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInitializing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{language === 'pt' ? 'Cruzando CV e montando sala...' : 'Building custom room...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.joinCallBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="text-center text-[11px] text-slate-500 mt-2">
                  {language === 'pt'
                    ? 'A entrevista será conduzida em inglês pelo entrevistador da IA.'
                    : 'The interview will be conducted in English by the AI interviewer.'}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
