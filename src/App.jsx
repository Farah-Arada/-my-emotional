import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Smile, Home, Volume2, AlertCircle, Hand, Heart, Palette, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────
// 🔊 ملفات MP3 الثابتة
// ─────────────────────────────────────────────────
const STATIC_AUDIO = {
  welcome_boy: '/sounds/welcome_boy.mp3',
  welcome_girl: '/sounds/welcome_girl.mp3',
  question_feelings_boy: '/sounds/question_feelings_boy.mp3',
  question_feelings_girl: '/sounds/question_feelings_girl.mp3',
  question_needs_boy: '/sounds/question_needs_boy.mp3',
  question_needs_girl: '/sounds/question_needs_girl.mp3',
  question_draw_boy: '/sounds/question_draw_boy.mp3',
  question_draw_girl: '/sounds/question_draw_girl.mp3',
};

// ─────────────────────────────────────────────────
// 🎭 قائمة المشاعر
// ─────────────────────────────────────────────────
const feelings = [
  { id: 'happy', label: { boy: 'أَنَا سَعِيد', girl: 'أَنَا سَعِيدَة' }, audioSrc: { boy: '/sounds/happy_boy.mp3', girl: '/sounds/happy_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Big%20Eyes.png', color: 'bg-yellow-300' },
  { id: 'sad', label: { boy: 'أَنَا حَزِين', girl: 'أَنَا حَزِينَة' }, audioSrc: { boy: '/sounds/sad_boy.mp3', girl: '/sounds/sad_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Face.png', color: 'bg-blue-300' },
  { id: 'angry', label: { boy: 'أَنَا غَاضِب', girl: 'أَنَا غَاضِبَة' }, audioSrc: { boy: '/sounds/angry_boy.mp3', girl: '/sounds/angry_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Steam%20From%20Nose.png', color: 'bg-red-400' },
  { id: 'scared', label: { boy: 'أَنَا خَائِف', girl: 'أَنَا خَائِفَة' }, audioSrc: { boy: '/sounds/scared_boy.mp3', girl: '/sounds/scared_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Fearful%20Face.png', color: 'bg-purple-300' },
  { id: 'hungry', label: { boy: 'أَنَا جَائِع', girl: 'أَنَا جَائِعَة' }, audioSrc: { boy: '/sounds/hungry_boy.mp3', girl: '/sounds/hungry_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Savoring%20Food.png', color: 'bg-orange-300' },
  { id: 'tired', label: { boy: 'أَنَا مُتْعَب', girl: 'أَنَا مُتْعَبَة' }, audioSrc: { boy: '/sounds/tired_boy.mp3', girl: '/sounds/tired_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Yawning%20Face.png', color: 'bg-indigo-300' },
  { id: 'sick', label: { boy: 'أَنَا مَرِيض', girl: 'أَنَا مَرِيضَة' }, audioSrc: { boy: '/sounds/sick_boy.mp3', girl: '/sounds/sick_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Emojis/master/Emojis/Smilies/Face%20with%20Thermometer.png', color: 'bg-green-300' },
  { id: 'excited', label: { boy: 'أَنَا مُتَحَمِّس', girl: 'أَنَا مُتَحَمِّسَة' }, audioSrc: { boy: '/sounds/excited_boy.mp3', girl: '/sounds/excited_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png', color: 'bg-pink-300' },
];

// ─────────────────────────────────────────────────
// 🎯 قائمة الاحتياجات
// ─────────────────────────────────────────────────
const needs = [
  { id: 'play', label: { boy: 'أُرِيدُ أَنْ أَلْعَب', girl: 'أُرِيدُ أَنْ أَلْعَب' }, audioSrc: { boy: '/sounds/play_boy.mp3', girl: '/sounds/play_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png', color: 'bg-emerald-300' },
  { id: 'mom', label: { boy: 'أُرِيدُ أُمِّي', girl: 'أُرِيدُ أُمِّي' }, audioSrc: { boy: '/sounds/mom_boy.mp3', girl: '/sounds/mom_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman.png', color: 'bg-rose-300' },
  { id: 'sleep', label: { boy: 'أُرِيدُ أَنْ أَنَام', girl: 'أُرِيدُ أَنْ أَنَام' }, audioSrc: { boy: '/sounds/sleep_boy.mp3', girl: '/sounds/sleep_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sleeping%20Face.png', color: 'bg-indigo-300' },
  { id: 'bathroom', label: { boy: 'أُرِيدُ الْحَمَّام', girl: 'أُرِيدُ الْحَمَّام' }, audioSrc: { boy: '/sounds/bathroom_boy.mp3', girl: '/sounds/bathroom_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Toilet.png', color: 'bg-cyan-300' },
  { id: 'talk', label: { boy: 'أُرِيدُ أَنْ أَتَكَلَّم', girl: 'أُرِيدُ أَنْ أَتَكَلَّم' }, audioSrc: { boy: '/sounds/talk_boy.mp3', girl: '/sounds/talk_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Speaking%20Head.png', color: 'bg-amber-300' },
  { id: 'no_talk', label: { boy: 'لَا أُرِيدُ الْكَلَامَ الْآن', girl: 'لَا أُرِيدُ الْكَلَامَ الْآن' }, audioSrc: { boy: '/sounds/notalk_boy.mp3', girl: '/sounds/notalk_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Zipper-Mouth%20Face.png', color: 'bg-slate-300' },
];

// ─────────────────────────────────────────────────
// 🎵 مدير الصوت المُحسّن (Preload)
// ─────────────────────────────────────────────────
const useAudioManager = () => {
  const audioCache = useRef(new Map());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getAudio = useCallback((src) => {
    if (!src) return null;
    if (audioCache.current.has(src)) {
      return audioCache.current.get(src);
    }
    
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioCache.current.set(src, audio);
    return audio;
  }, []);

  const playAudio = useCallback((src) => {
    return new Promise((resolve) => {
      const audio = getAudio(src);
      if (!audio) {
        resolve();
        return;
      }

      // إعادة تعيين الوقت عشان نقدر نعيد التشغيل
      audio.currentTime = 0;
      
      const handleEnd = () => {
        setIsSpeaking(false);
        audio.removeEventListener('ended', handleEnd);
        audio.removeEventListener('error', handleError);
        resolve();
      };

      const handleError = () => {
        console.warn("Audio error:", src);
        setIsSpeaking(false);
        audio.removeEventListener('ended', handleEnd);
        audio.removeEventListener('error', handleError);
        resolve();
      };

      audio.addEventListener('ended', handleEnd);
      audio.addEventListener('error', handleError);

      setIsSpeaking(true);
      audio.play().catch((e) => {
        console.warn("Playback blocked:", e);
        setIsSpeaking(false);
        resolve();
      });
    });
  }, [getAudio]);

  const stopAll = useCallback(() => {
    audioCache.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    setIsSpeaking(false);
  }, []);

  return { playAudio, isSpeaking, setIsSpeaking, stopAll };
};

export default function App() {
  const [step, setStep] = useState('input');
  const [childGender, setChildGender] = useState('');
  const [currentMode, setCurrentMode] = useState('feelings');
  const [errorMessage, setErrorMessage] = useState('');
  
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [strokeColor, setStrokeColor] = useState('#8b5cf6');

  const { playAudio, isSpeaking, setIsSpeaking, stopAll } = useAudioManager();

  const showError = useCallback((msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 4000);
  }, []);

  // ─────────────────────────────────────────────────
  // 🚀 معالجة البداية
  // ─────────────────────────────────────────────────
  const handleStart = useCallback(async (e) => {
    e.preventDefault();
    if (!childGender) return;

    setStep('welcome');
    setCurrentMode('feelings');
    
    const welcomePath = childGender === 'boy' ? STATIC_AUDIO.welcome_boy : STATIC_AUDIO.welcome_girl;
    await playAudio(welcomePath);
    
    setStep('app');
  }, [childGender, playAudio]);

  // ─────────────────────────────────────────────────
  // 🎤 تشغيل السؤال
  // ─────────────────────────────────────────────────
  const playQuestion = useCallback(() => {
    if (!childGender) return;
    
    let questionPath = '';
    if (currentMode === 'feelings') {
      questionPath = childGender === 'boy' ? STATIC_AUDIO.question_feelings_boy : STATIC_AUDIO.question_feelings_girl;
    } else if (currentMode === 'needs') {
      questionPath = childGender === 'boy' ? STATIC_AUDIO.question_needs_boy : STATIC_AUDIO.question_needs_girl;
    } else if (currentMode === 'draw') {
      questionPath = childGender === 'boy' ? STATIC_AUDIO.question_draw_boy : STATIC_AUDIO.question_draw_girl;
    }
    
    playAudio(questionPath);
  }, [currentMode, childGender, playAudio]);

  // دالة لجلب نص السؤال الحالي بناءً على القسم والجنس
  const getQuestionText = useCallback(() => {
    if (currentMode === 'feelings') {
      return childGender === 'boy' 
        ? `كَيْفَ تَشْعُرُ الْيَوْمَ؟` 
        : `كَيْفَ حَالُكِ الْيَوْمَ؟`;
    } else if (currentMode === 'needs') {
      return childGender === 'boy' 
        ? `أَخْبِرْنِي مَاذَا تُرِيدُ؟` 
        : `أَخْبِرِينِي مَاذَا تُرِيدِينَ؟`;
    } else if (currentMode === 'draw') {
      return childGender === 'boy' 
        ? `هَلْ تَسْتَطِيعُ أَنْ تَرْسُمَ لِي بِمَاذَا تَشْعُرُ؟` 
        : `هَلْ تَسْتَطِيعِينَ أَنْ تَرْسُمِي لِي بِمَاذَا تَشْعُرِينَ؟`;
    }
    return '';
  }, [currentMode, childGender]);

  useEffect(() => {
    if (step === 'app' && childGender) {
      const timer = setTimeout(() => {
        playQuestion();
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [step, currentMode, childGender, playQuestion]);

  // 🎨 دوال الرسم
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (currentMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [currentMode]);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  const currentList = currentMode === 'feelings' ? feelings : needs;

  return (
    <div className="min-h-screen relative text-right overflow-x-hidden select-none" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');`}</style>
      
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-4 rounded-2xl z-50 shadow-2xl flex items-center gap-3 w-[90%] max-w-md"
          >
            <AlertCircle className="shrink-0" /> 
            <span className="text-sm font-bold">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 relative overflow-hidden"
          >
            {/* دوائر متحركة خلفية */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/40 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-white/40 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-1/2 right-10 w-24 h-24 bg-yellow-300/40 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/3 left-20 w-20 h-20 bg-pink-300/40 rounded-full blur-xl animate-pulse"></div>
            
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[3rem] shadow-2xl max-w-md w-full border-4 border-white text-center relative z-10">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
              >
                <Smile className="text-white" size={48} />
              </motion.div>
              
              <h1 className="text-4xl font-black text-purple-700 mb-2 leading-tight drop-shadow-sm">
                مرحباً بك!
              </h1>
              <p className="text-2xl font-black text-slate-600 mb-8">
                هل أنت؟ 👦👧
              </p>

              <form onSubmit={handleStart} className="space-y-8">
                <div className="flex gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={!childGender} 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl font-black py-5 rounded-[2rem] shadow-xl transition-transform disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  هيا بنا نلعب!
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-400 text-center relative overflow-hidden"
          >
            {/* خلفية حيوية */}
            <div className="absolute inset-0">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 left-10 w-40 h-40 bg-white/30 rounded-full blur-3xl"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute bottom-10 right-10 w-56 h-56 bg-white/30 rounded-full blur-3xl"
              />
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1/3 left-1/4 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl"
              />
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-pink-200/40 rounded-full blur-2xl"
              />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-8xl md:text-9xl mb-6 drop-shadow-2xl"
              >
                🎉
              </motion.div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-4"
              >
                أهلاً بك
              </motion.h1>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-7xl font-black text-yellow-200 drop-shadow-xl"
              >
                {childGender === 'boy' ? 'يا بطل!' : 'يا أميرة!'} 👋
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex gap-4"
              >
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="text-4xl">✨</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="text-4xl">🌟</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="text-4xl">✨</motion.span>
              </motion.div>
              
              {isSpeaking && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center gap-3"
                >
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-4 h-4 bg-white rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-4 h-4 bg-white rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.4 }} className="w-4 h-4 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'app' && (
          <motion.div 
            key="app"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#f8fafc] p-4 md:p-8 flex flex-col"
          >
            <div className="max-w-6xl mx-auto w-full flex-grow">
              
              <div className="flex justify-center gap-3 md:gap-6 mb-8 flex-wrap">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMode('feelings')}
                  className={`flex items-center gap-2 px-6 py-4 rounded-full font-black text-lg md:text-xl transition-all duration-300 shadow-md border-4 ${
                    currentMode === 'feelings' 
                      ? 'bg-purple-600 text-white border-purple-200 scale-105' 
                      : 'bg-white text-slate-500 border-white hover:bg-purple-50'
                  }`}
                >
                  <Heart size={24} className={currentMode === 'feelings' ? 'animate-pulse' : ''} /> 
                  المشاعر
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMode('needs')}
                  className={`flex items-center gap-2 px-6 py-4 rounded-full font-black text-lg md:text-xl transition-all duration-300 shadow-md border-4 ${
                    currentMode === 'needs' 
                      ? 'bg-pink-500 text-white border-pink-200 scale-105' 
                      : 'bg-white text-slate-500 border-white hover:bg-pink-50'
                  }`}
                >
                  <Hand size={24} className={currentMode === 'needs' ? 'animate-bounce' : ''} /> 
                  الاحتياجات
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMode('draw')}
                  className={`flex items-center gap-2 px-6 py-4 rounded-full font-black text-lg md:text-xl transition-all duration-300 shadow-md border-4 ${
                    currentMode === 'draw' 
                      ? 'bg-amber-500 text-white border-amber-200 scale-105' 
                      : 'bg-white text-slate-500 border-white hover:bg-amber-50'
                  }`}
                >
                  <Palette size={24} className={currentMode === 'draw' ? 'animate-bounce' : ''} /> 
                  الرسم
                </motion.button>
              </div>

              <header className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-10 flex flex-col md:flex-row justify-between items-center gap-4 border-2 border-slate-50">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 leading-tight">
                    {getQuestionText()}
                  </h1>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -30 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={playQuestion}
                    disabled={isSpeaking}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-all disabled:opacity-50 shadow-sm"
                    title="إعادة الاستماع"
                  >
                    <RotateCcw size={24} className={isSpeaking ? 'animate-spin' : ''} />
                  </motion.button>
                </div>
                {isSpeaking && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-blue-50 px-5 py-3 rounded-full text-blue-600 font-bold whitespace-nowrap"
                  >
                    <Volume2 size={24} className="animate-pulse" /> يتحدث الآن...
                  </motion.div>
                )}
              </header>

              {currentMode === 'draw' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-[3.5rem] shadow-lg border-4 border-slate-100 flex flex-col items-center"
                >
                  <div className="flex gap-3 mb-6 flex-wrap justify-center bg-slate-50 p-4 rounded-full shadow-inner border-2 border-slate-100 w-full max-w-2xl">
                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#000000'].map(c => (
                      <motion.button 
                        key={c}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setStrokeColor(c)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md border-4 transition-transform ${strokeColor === c ? 'scale-125 border-slate-300' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                        title="اختر هذا اللون"
                      />
                    ))}
                    <div className="w-1 bg-slate-200 mx-2 rounded-full"></div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearCanvas}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-red-500 hover:bg-red-50 border-2 border-slate-200 shadow-sm"
                      title="مسح اللوحة"
                    >
                      <Trash2 size={24} />
                    </motion.button>
                  </div>

                  <div className="w-full max-w-3xl rounded-[2rem] overflow-hidden border-4 border-amber-200 bg-white shadow-md touch-none relative cursor-crosshair">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={500}
                      className="w-full h-auto bg-white"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  <p className="mt-6 font-bold text-slate-400 text-sm md:text-base flex items-center gap-2">
                    <Smile size={20} className="text-amber-400" />
                    ارسم بحرية، لا توجد قواعد هنا!
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {currentList.map((item) => (
                      <motion.button 
                        layout
                        key={item.id} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => playAudio(item.audioSrc[childGender])} 
                        disabled={isSpeaking}
                        className={`${item.color} relative group flex flex-col items-center justify-center p-6 md:p-8 rounded-[3.5rem] border-4 border-white transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                      >
                        <motion.img 
                          whileHover={{ rotate: 12 }}
                          src={item.image} 
                          className="w-24 md:w-32 mb-4 drop-shadow-md" 
                          draggable="false" 
                          alt={item.label[childGender]}
                          loading="eager"
                        />
                        <div className="bg-white/90 px-6 py-3 rounded-2xl font-black text-xl md:text-2xl text-slate-800 shadow-sm text-center w-full">
                          {item.label[childGender]}
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              <div className="mt-20 flex justify-center pb-12">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { 
                    stopAll();
                    setStep('input'); 
                  }} 
                  className="bg-white text-slate-500 font-extrabold py-4 px-10 rounded-full border-2 border-slate-200 hover:bg-slate-100 hover:text-purple-600 transition-all flex items-center gap-3 shadow-md"
                >
                  <Home size={22} /> العودة للرئيسية
                </motion.button>
              </div>
            </div>

            <footer className="w-full mt-auto pt-6 border-t-2 border-slate-200/60 pb-2">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-slate-400 font-bold text-xs sm:text-sm md:text-base px-4 text-center">
                <p>
                  تصميم وبرمجة: <a href="https://www.linkedin.com/in/farah-arada-94b5b1339" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600 hover:underline transition-all">فرح عرادة</a>
                </p>
                <span className="hidden md:inline text-slate-300">|</span>
                <p>فكرة: ليلى أبو شباب / سارة أكرم</p>
                <span className="hidden md:inline text-slate-300">|</span>
                <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}