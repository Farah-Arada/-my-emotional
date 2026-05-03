import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Smile, Home, Volume2, AlertCircle, Loader2 } from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// ─────────────────────────────────────────────────
// 🔧 دوال تحويل الصوت (للـ API)
// ─────────────────────────────────────────────────
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcmData, sampleRate) => {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.byteLength;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));
  return new Blob([buffer], { type: 'audio/wav' });
};

// ─────────────────────────────────────────────────
// 🎭 قائمة المشاعر (مع مسارات ملفات MP3)
// ─────────────────────────────────────────────────
// 📁 ضعي ملفات الصوت في مجلد public/sounds/
const feelings = [
  { 
    id: 'happy', 
    label: { boy: 'أنا سَعيد', girl: 'أنا سَعيدَة' }, 
    audioSrc: { boy: '/sounds/happy_boy.mp3', girl: '/sounds/happy_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Big%20Eyes.png', 
    color: 'bg-yellow-300' 
  },
  { 
    id: 'sad', 
    label: { boy: 'أنا حَزين', girl: 'أنا حَزينَة' }, 
    audioSrc: { boy: '/sounds/sad_boy.mp3', girl: '/sounds/sad_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Face.png', 
    color: 'bg-blue-300' 
  },
  { 
    id: 'angry', 
    label: { boy: 'أنا غاضِب', girl: 'أنا غاضِبَة' }, 
    audioSrc: { boy: '/sounds/angry_boy.mp3', girl: '/sounds/angry_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Steam%20From%20Nose.png', 
    color: 'bg-red-400' 
  },
  { 
    id: 'scared', 
    label: { boy: 'أنا خائِف', girl: 'أنا خائِفَة' }, 
    audioSrc: { boy: '/sounds/scared_boy.mp3', girl: '/sounds/scared_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Fearful%20Face.png', 
    color: 'bg-purple-300' 
  },
  { 
    id: 'hungry', 
    label: { boy: 'أنا جائِع', girl: 'أنا جائِعَة' }, 
    audioSrc: { boy: '/sounds/hungry_boy.mp3', girl: '/sounds/hungry_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Savoring%20Food.png', 
    color: 'bg-orange-300' 
  },
  { 
    id: 'tired', 
    label: { boy: 'أنا مُتْعَب', girl: 'أنا مُتْعَبَة' }, 
    audioSrc: { boy: '/sounds/tired_boy.mp3', girl: '/sounds/tired_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Yawning%20Face.png', 
    color: 'bg-indigo-300' 
  },
  { 
    id: 'sick', 
    label: { boy: 'أنا مَريض', girl: 'أنا مَريضَة' }, 
    audioSrc: { boy: '/sounds/sick_boy.mp3', girl: '/sounds/sick_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Thermometer.png', 
    color: 'bg-green-300' 
  },
  { 
    id: 'excited', 
    label: { boy: 'أنا مُتَحَمِّس', girl: 'أنا مُتَحَمِّسَة' }, 
    audioSrc: { boy: '/sounds/excited_boy.mp3', girl: '/sounds/excited_girl.mp3' }, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png', 
    color: 'bg-pink-300' 
  },
];

export default function App() {
  const [step, setStep] = useState('input');
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const audioRef = useRef(null);
  const audioCache = useRef({});

  const showError = useCallback((msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 4000);
  }, []);

  // ─────────────────────────────────────────────────
  // 🎙️ TTS الاحتياطي (إذا فشل API)
  // ─────────────────────────────────────────────────
  const speakFallback = useCallback((text, gender) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) { resolve(); return; }
      
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.pitch = gender === 'girl' ? 1.1 : 0.7;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.includes('ar') && v.name.includes('Female') === (gender === 'girl'));
      if (arabicVoice) utterance.voice = arabicVoice;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };
      
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // ─────────────────────────────────────────────────
  // 🎙️ الصوت الديناميكي (API) - للترحيب والسؤال فقط
  // ─────────────────────────────────────────────────
  const playDynamicAudio = useCallback(async (text, gender) => {
    const cacheKey = text + "_" + gender;
    setIsLoading(true);

    // تشغيل من الذاكرة المؤقتة
    if (audioCache.current[cacheKey]) {
      try {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.pause();
        audioRef.current.src = audioCache.current[cacheKey];
        
        await new Promise((resolve) => {
          audioRef.current.onplay = () => { setIsSpeaking(true); setIsLoading(false); };
          audioRef.current.onended = () => { setIsSpeaking(false); resolve(); };
          audioRef.current.onerror = () => { setIsSpeaking(false); resolve(); };
          audioRef.current.play().catch(() => { setIsSpeaking(false); resolve(); });
        });
        return;
      } catch (e) {
        console.warn("Cache play failed", e);
      }
    }

    try {
      const prompt = "Speak naturally in Arabic with a warm, friendly adult voice.";
      let response = null;
      let lastError = null;
      
      // محاولات مع تأخير تصاعدي
      for (let i = 0; i < 3; i++) {
        try {
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `${prompt} Say: "${text}"` }] }],
                generationConfig: {
                  responseModalities: ["AUDIO"],
                  speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: {
                        voiceName: gender === 'girl' ? 'Kore' : 'Puck'
                      }
                    }
                  }
                }
              })
            }
          );
          
          if (response.status === 429) {
            const delay = Math.pow(2, i) * 1000;
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
          
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          break;
          
        } catch (err) {
          lastError = err;
          if (i === 2) throw lastError;
        }
      }

      const data = await response.json();
      const base64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      const mimeType = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || "";
      const rate = parseInt(mimeType.match(/rate=(\d+)/)?.[1] || "24000");

      if (base64) {
        const url = URL.createObjectURL(pcmToWav(base64ToArrayBuffer(base64), rate));
        audioCache.current[cacheKey] = url;
        
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.pause();
        audioRef.current.src = url;
        
        await new Promise((resolve) => {
          audioRef.current.onplay = () => { setIsSpeaking(true); setIsLoading(false); };
          audioRef.current.onended = () => { setIsSpeaking(false); resolve(); };
          audioRef.current.onerror = () => { setIsSpeaking(false); resolve(); };
          audioRef.current.play().catch(() => { setIsSpeaking(false); resolve(); });
        });
      } else {
        throw new Error("No audio data received");
      }
    } catch (e) {
      console.warn("API failed, falling back to native TTS", e);
      setIsLoading(false);
      await speakFallback(text, gender);
    }
  }, [apiKey, speakFallback]);

  // ─────────────────────────────────────────────────
  // 🎵 تشغيل المشاعر (ملفات MP3 محلية)
  // ─────────────────────────────────────────────────
  const playLocalAudio = useCallback((audioPath) => {
    return new Promise((resolve) => {
      if (!audioRef.current) audioRef.current = new Audio();
      
      audioRef.current.pause();
      audioRef.current.src = audioPath;
      
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => { setIsSpeaking(false); resolve(); };
      audioRef.current.onerror = () => { 
        console.warn("MP3 not found:", audioPath);
        setIsSpeaking(false);
        showError("لم يتم العثور على ملف الصوت! تأكدي من وضعه في المجلد الصحيح.");
        resolve(); 
      };
      
      audioRef.current.play().catch(e => { 
        console.warn("Browser blocked audio:", e); 
        setIsSpeaking(false); 
        resolve(); 
      });
    });
  }, [showError]);

  // ─────────────────────────────────────────────────
  // 🚀 معالجة البداية
  // ─────────────────────────────────────────────────
  const handleStart = useCallback(async (e) => {
    e.preventDefault();
    if (!childName.trim() || !childGender) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
    }

    setStep('welcome');
    
    const welcomeText = childGender === 'boy' 
      ? `أهلاً بكَ يا ${childName}.` 
      : `أهلاً بكِ يا ${childName}.`;
    
    await playDynamicAudio(welcomeText, childGender);
    setStep('app');
  }, [childName, childGender, playDynamicAudio]);

  // ─────────────────────────────────────────────────
  // 🎤 تشغيل السؤال عند دخول التطبيق (API)
  // ─────────────────────────────────────────────────
  useEffect(() => {
    if (step === 'app' && childName && childGender) {
      const qText = childGender === 'boy' 
        ? `كيف تشعر اليوم يا ${childName}؟` 
        : `كيف تشعرين اليوم يا ${childName}؟`;
      
      const timer = setTimeout(() => {
        playDynamicAudio(qText, childGender);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [step, childName, childGender, playDynamicAudio]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen relative text-right overflow-x-hidden select-none" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');`}</style>
      
      {errorMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-4 rounded-2xl z-50 shadow-2xl flex items-center gap-3 animate-bounce w-[90%] max-w-md">
          <AlertCircle className="shrink-0" /> 
          <span className="text-sm font-bold">{errorMessage}</span>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-3">
            <Loader2 className="animate-spin text-purple-600" size={24} />
            <span className="font-bold text-purple-800">جاري تحضير الصوت...</span>
          </div>
        </div>
      )}

      {step === 'input' && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 relative overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-yellow-300/40 rounded-full blur-xl animate-pulse"></div>
          
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[3rem] shadow-2xl max-w-md w-full border-4 border-white text-center relative z-10">
            <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce">
              <Smile className="text-white" size={48} />
            </div>
            <h1 className="text-4xl font-black text-purple-700 mb-8 leading-tight drop-shadow-sm">
              مرحباً بك يا بطل!
            </h1>
            <form onSubmit={handleStart} className="space-y-6">
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setChildGender('boy')} 
                  className={`flex-1 p-5 rounded-3xl border-4 transition-all duration-300 ${
                    childGender === 'boy' 
                      ? 'border-blue-400 bg-blue-100 scale-105 shadow-xl' 
                      : 'border-slate-100 bg-slate-50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-5xl block mb-2 drop-shadow-md">👦</span>
                  <span className="font-extrabold text-blue-700 text-lg">وَلَد</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setChildGender('girl')} 
                  className={`flex-1 p-5 rounded-3xl border-4 transition-all duration-300 ${
                    childGender === 'girl' 
                      ? 'border-pink-400 bg-pink-100 scale-105 shadow-xl' 
                      : 'border-slate-100 bg-slate-50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-5xl block mb-2 drop-shadow-md">👧</span>
                  <span className="font-extrabold text-pink-700 text-lg">بِنْت</span>
                </button>
              </div>
              <input 
                type="text" 
                value={childName} 
                onChange={(e) => setChildName(e.target.value)} 
                placeholder="ما اسمك الجميل؟" 
                className="w-full text-center text-2xl p-5 rounded-3xl border-4 border-purple-100 focus:border-purple-400 outline-none transition-all placeholder-purple-300 text-purple-800 font-bold bg-white" 
                autoFocus 
              />
              <button 
                type="submit" 
                disabled={!childName.trim() || !childGender || isLoading} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl font-black py-5 rounded-[2rem] shadow-xl transition-transform active:scale-95 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري التحميل...' : 'هيا بنا نلعب!'}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-400 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="animate-in zoom-in duration-1000 z-10 bg-white/30 p-8 md:p-10 rounded-[3rem] backdrop-blur-sm border-4 border-white/50 shadow-2xl">
            <div className="text-6xl md:text-7xl mb-4 animate-[bounce_1.5s_infinite]">🎉</div>
            <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg px-4 leading-tight">
              أهلاً بك <span className="text-yellow-200 block mt-2 md:mt-3 text-4xl md:text-6xl">{childName}</span>!
            </h1>
            {(isSpeaking || isLoading) && (
              <div className="mt-8 flex justify-center gap-3 animate-pulse">
                <div className="w-4 h-4 bg-white rounded-full"></div>
                <div className="w-4 h-4 bg-white rounded-full delay-75"></div>
                <div className="w-4 h-4 bg-white rounded-full delay-150"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'app' && (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 flex flex-col">
          <div className="max-w-6xl mx-auto w-full flex-grow animate-in slide-in-from-bottom-10 duration-700">
            <header className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-10 flex flex-col md:flex-row justify-between items-center gap-4 border-2 border-slate-50">
              <h1 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">
                كيف {childGender === 'boy' ? 'تَشْعُر' : 'تَشْعُرين'} اليوم يا <span className="text-purple-600">{childName}</span>؟
              </h1>
              {isSpeaking && (
                <div className="flex items-center gap-2 bg-blue-50 px-5 py-3 rounded-full text-blue-600 font-bold animate-pulse">
                  <Volume2 size={24} /> يتحدث الآن...
                </div>
              )}
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {feelings.map((f) => (
                <button 
                  key={f.id} 
                  onClick={() => playLocalAudio(f.audioSrc[childGender])} 
                  disabled={isSpeaking || isLoading}
                  className={`${f.color} relative group flex flex-col items-center justify-center p-6 md:p-8 rounded-[3.5rem] border-4 border-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg active:shadow-inner active:translate-y-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                >
                  <img 
                    src={f.image} 
                    className="w-24 md:w-32 mb-4 group-hover:rotate-12 transition-transform duration-300 drop-shadow-md" 
                    draggable="false" 
                    alt={f.label[childGender]}
                    loading="lazy"
                  />
                  <div className="bg-white/90 px-6 py-3 rounded-2xl font-black text-xl md:text-2xl text-slate-800 shadow-sm">
                    {f.label[childGender]}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-20 flex justify-center pb-12">
              <button 
                onClick={() => { 
                  if(audioRef.current) audioRef.current.pause();
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setStep('input'); 
                }} 
                className="bg-white text-slate-500 font-extrabold py-4 px-10 rounded-full border-2 border-slate-200 hover:bg-slate-100 hover:text-purple-600 transition-all flex items-center gap-3 shadow-md"
              >
                <Home size={22} /> العودة للرئيسية
              </button>
            </div>
          </div>

          <footer className="w-full mt-auto pt-6 border-t-2 border-slate-200/60 pb-2">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-slate-400 font-bold text-xs sm:text-sm md:text-base px-4 text-center">
              <p>
                تصميم وبرمجة: <a href="https://www.linkedin.com/in/farah-arada-94b5b1339" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600 hover:underline transition-all">فرح عرادة</a>
              </p>
              <span className="hidden md:inline text-slate-300">|</span>
              <p>فكرة:ليلى أبو شباب / سارة أكرم</p>
              <span className="hidden md:inline text-slate-300">|</span>
              <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}