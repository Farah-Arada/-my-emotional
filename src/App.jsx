import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Smile, Home, Volume2, AlertCircle, Hand, Heart, Palette, Trash2, RotateCcw } from 'lucide-react';

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
  { id: 'happy', label: { boy: 'أنا سَعيد', girl: 'أنا سَعيدَة' }, audioSrc: { boy: '/sounds/happy_boy.mp3', girl: '/sounds/happy_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Big%20Eyes.png', color: 'bg-yellow-300' },
  { id: 'sad', label: { boy: 'أنا حَزين', girl: 'أنا حَزينَة' }, audioSrc: { boy: '/sounds/sad_boy.mp3', girl: '/sounds/sad_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Face.png', color: 'bg-blue-300' },
  { id: 'angry', label: { boy: 'أنا غاضِب', girl: 'أنا غاضِبَة' }, audioSrc: { boy: '/sounds/angry_boy.mp3', girl: '/sounds/angry_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Steam%20From%20Nose.png', color: 'bg-red-400' },
  { id: 'scared', label: { boy: 'أنا خائِف', girl: 'أنا خائِفَة' }, audioSrc: { boy: '/sounds/scared_boy.mp3', girl: '/sounds/scared_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Fearful%20Face.png', color: 'bg-purple-300' },
  { id: 'hungry', label: { boy: 'أنا جائِع', girl: 'أنا جائِعَة' }, audioSrc: { boy: '/sounds/hungry_boy.mp3', girl: '/sounds/hungry_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Savoring%20Food.png', color: 'bg-orange-300' },
  { id: 'tired', label: { boy: 'أنا مُتْعَب', girl: 'أنا مُتْعَبَة' }, audioSrc: { boy: '/sounds/tired_boy.mp3', girl: '/sounds/tired_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Yawning%20Face.png', color: 'bg-indigo-300' },
  { id: 'sick', label: { boy: 'أنا مَريض', girl: 'أنا مَريضَة' }, audioSrc: { boy: '/sounds/sick_boy.mp3', girl: '/sounds/sick_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Thermometer.png', color: 'bg-green-300' },
  { id: 'excited', label: { boy: 'أنا مُتَحَمِّس', girl: 'أنا مُتَحَمِّسَة' }, audioSrc: { boy: '/sounds/excited_boy.mp3', girl: '/sounds/excited_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png', color: 'bg-pink-300' },
];

// ─────────────────────────────────────────────────
// 🎯 قائمة الاحتياجات
// ─────────────────────────────────────────────────
const needs = [
  { id: 'play', label: { boy: 'أُريد أن أَلْعَب', girl: 'أُريد أن أَلْعَب' }, audioSrc: { boy: '/sounds/play_boy.mp3', girl: '/sounds/play_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png', color: 'bg-emerald-300' },
  { id: 'mom', label: { boy: 'أُريد أُمّي', girl: 'أُريد أُمّي' }, audioSrc: { boy: '/sounds/mom_boy.mp3', girl: '/sounds/mom_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman.png', color: 'bg-rose-300' },
  { id: 'sleep', label: { boy: 'أُريد أن أَنام', girl: 'أُريد أن أَنام' }, audioSrc: { boy: '/sounds/sleep_boy.mp3', girl: '/sounds/sleep_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sleeping%20Face.png', color: 'bg-indigo-300' },
  { id: 'bathroom', label: { boy: 'أُريد الحَمّام', girl: 'أُريد الحَمّام' }, audioSrc: { boy: '/sounds/bathroom_boy.mp3', girl: '/sounds/bathroom_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Toilet.png', color: 'bg-cyan-300' },
  { id: 'talk', label: { boy: 'أُريد أن أَتَكَلَّم', girl: 'أُريد أن أَتَكَلَّم' }, audioSrc: { boy: '/sounds/talk_boy.mp3', girl: '/sounds/talk_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Speaking%20Head.png', color: 'bg-amber-300' },
  { id: 'no_talk', label: { boy: 'لا أُريد الكَلام الآن', girl: 'لا أُريد الكَلام الآن' }, audioSrc: { boy: '/sounds/notalk_boy.mp3', girl: '/sounds/notalk_girl.mp3' }, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Zipper-Mouth%20Face.png', color: 'bg-slate-300' },
];

export default function App() {
  const [step, setStep] = useState('input');
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState('');
  const [currentMode, setCurrentMode] = useState('feelings');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [strokeColor, setStrokeColor] = useState('#8b5cf6');

  const showError = useCallback((msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 4000);
  }, []);

  // ─────────────────────────────────────────────────
  // 🎵 مشغل MP3 موحد
  // ─────────────────────────────────────────────────
  const playLocalAudio = useCallback((audioPath) => {
    return new Promise((resolve) => {
      if (!audioPath) {
        resolve();
        return;
      }

      const audio = new Audio(audioPath);
      audio.preload = 'auto';
      
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => { setIsSpeaking(false); resolve(); };
      audio.onerror = () => { 
        console.warn("MP3 not found:", audioPath);
        setIsSpeaking(false);
        showError("لم يتم العثور على ملف الصوت!");
        resolve(); 
      };
      
      audio.play().catch(e => { 
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

    setStep('welcome');
    setCurrentMode('feelings');
    
    const welcomePath = childGender === 'boy' ? STATIC_AUDIO.welcome_boy : STATIC_AUDIO.welcome_girl;
    await playLocalAudio(welcomePath);
    
    setStep('app');
  }, [childGender, playLocalAudio]);

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
    
    playLocalAudio(questionPath);
  }, [currentMode, childGender, playLocalAudio]);

  useEffect(() => {
    if (step === 'app' && childName && childGender) {
      const timer = setTimeout(() => {
        playQuestion();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [step, currentMode, childName, childGender, playQuestion]);

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
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const currentList = currentMode === 'feelings' ? feelings : needs;

  return (
    <div className="min-h-screen relative text-right overflow-x-hidden select-none" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');`}</style>
      
      {errorMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-4 rounded-2xl z-50 shadow-2xl flex items-center gap-3 animate-bounce w-[90%] max-w-md">
          <AlertCircle className="shrink-0" /> 
          <span className="text-sm font-bold">{errorMessage}</span>
        </div>
      )}

      {step === 'input' && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 relative overflow-hidden">
          {/* دوائر متحركة خلفية */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-yellow-300/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-20 w-20 h-20 bg-pink-300/40 rounded-full blur-xl animate-pulse"></div>
          
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[3rem] shadow-2xl max-w-md w-full border-4 border-white text-center relative z-10">
            <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce">
              <Smile className="text-white" size={48} />
            </div>
            <h1 className="text-4xl font-black text-purple-700 mb-8 leading-tight drop-shadow-sm">
              مرحباً بك يا بطل!
            </h1>
            <form onSubmit={handleStart} className="space-y-6">
              
              {/* ← جديد: نص "هل أنت؟" */}
              <div className="text-center">
                <p className="text-2xl font-black text-slate-600 mb-4">هل أنت؟ 👦👧</p>
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
                disabled={!childName.trim() || !childGender} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl font-black py-5 rounded-[2rem] shadow-xl transition-transform active:scale-95 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                هيا بنا نلعب!
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-400 text-center relative overflow-hidden">
          {/* خلفية حيوية بدون مربعات */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-pink-200/40 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-cyan-200/40 rounded-full blur-xl animate-bounce"></div>
          </div>
          
          {/* محتوى الترحيب - بدون مربع */}
          <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-700">
            {/* إيموجي متحرك */}
            <div className="text-8xl md:text-9xl mb-6 animate-[bounce_1s_infinite] drop-shadow-2xl">🎉</div>
            
            {/* نص الترحيب */}
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-4">
              أهلاً وسهلاً
            </h1>
            <h2 className="text-5xl md:text-7xl font-black text-yellow-200 drop-shadow-xl animate-pulse">
              يا {childName}! 👋
            </h2>
            
            {/* دوائر صغيرة متحركة */}
            <div className="mt-10 flex gap-4">
              <span className="text-4xl animate-bounce delay-100">✨</span>
              <span className="text-4xl animate-bounce delay-200">🌟</span>
              <span className="text-4xl animate-bounce delay-300">✨</span>
            </div>
            
            {isSpeaking && (
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
            
            {/* أزرار التنقل */}
            <div className="flex justify-center gap-3 md:gap-6 mb-8 flex-wrap">
              <button 
                onClick={() => setCurrentMode('feelings')}
                className={`flex items-center gap-2 px-6 py-4 rounded-full font-black text-lg md:text-xl transition-all duration-300 shadow-md border-4 ${
                  currentMode === 'feelings' 
                    ? 'bg-purple-600 text-white border-purple-200 scale-105' 
                    : 'bg-white text-slate-500 border-white hover:bg-purple-50'
                }`}
              >
                <Heart size={24} className={currentMode === 'feelings' ? 'animate-pulse' : ''} /> 
                المشاعر
              </button>
              
              <button 
                onClick={() => setCurrentMode('needs')}
                className={`flex items-center gap-2 px-6 py-4 rounded-full font-black text-lg md:text-xl transition-all duration-300 shadow-md border-4 ${
                  currentMode === 'needs' 
                    ? 'bg-pink-500 text-white border-pink-200 scale-105' 
                    : 'bg-white text-slate-500 border-white hover:bg-pink-50'
                }`}
              >
                <Hand size={24} className={currentMode === 'needs' ? 'animate-bounce' : ''} /> 
                الاحتياجات
              </button>

              <button 
                onClick={() => setCurrentMode('draw')}
                className={`flex items-center gap-2 px-6 py-4 rounded-full font-black text-lg md:text-xl transition-all duration-300 shadow-md border-4 ${
                  currentMode === 'draw' 
                    ? 'bg-amber-500 text-white border-amber-200 scale-105' 
                    : 'bg-white text-slate-500 border-white hover:bg-amber-50'
                }`}
              >
                <Palette size={24} className={currentMode === 'draw' ? 'animate-bounce' : ''} /> 
                الرسم
              </button>
            </div>

            {/* Header مع زر إعادة تشغيل الصوت */}
            <header className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-10 flex flex-col md:flex-row justify-between items-center gap-4 border-2 border-slate-50">
              <h1 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">
                {currentMode === 'feelings' 
                  ? `كيف ${childGender === 'boy' ? 'تَشْعُر' : 'تَشْعُرين'} اليوم يا `
                  : currentMode === 'needs'
                  ? `ماذا ${childGender === 'boy' ? 'تُريد' : 'تُريدين'} يا `
                  : `ارسم ${childGender === 'boy' ? 'شُعورَك' : 'شُعورَكِ'} يا `
                }
                <span className={currentMode === 'feelings' ? "text-purple-600" : currentMode === 'needs' ? "text-pink-500" : "text-amber-500"}>
                  {childName}
                </span>؟
              </h1>
              
              <div className="flex items-center gap-3">
                {isSpeaking && (
                  <div className="flex items-center gap-2 bg-blue-50 px-5 py-3 rounded-full text-blue-600 font-bold animate-pulse">
                    <Volume2 size={24} /> يتحدث الآن...
                  </div>
                )}
                
                {/* ← جديد: زر إعادة تشغيل الصوت */}
                <button
                  onClick={playQuestion}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 bg-white border-2 border-purple-200 hover:border-purple-400 text-purple-600 hover:text-purple-800 px-4 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  title="إعادة تشغيل السؤال"
                >
                  <RotateCcw size={20} className={isSpeaking ? 'animate-spin' : ''} />
                  <span className="hidden md:inline">اسمع مرة ثانية</span>
                </button>
              </div>
            </header>

            {currentMode === 'draw' ? (
              <div className="bg-white p-6 rounded-[3.5rem] shadow-lg border-4 border-slate-100 flex flex-col items-center animate-in zoom-in duration-500">
                <div className="flex gap-3 mb-6 flex-wrap justify-center bg-slate-50 p-4 rounded-full shadow-inner border-2 border-slate-100 w-full max-w-2xl">
                  {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#000000'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setStrokeColor(c)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md border-4 transition-transform ${strokeColor === c ? 'scale-125 border-slate-300' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <div className="w-1 bg-slate-200 mx-2 rounded-full"></div>
                  <button 
                    onClick={clearCanvas}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-red-500 hover:bg-red-50 border-2 border-slate-200 hover:scale-110 transition-transform shadow-sm"
                  >
                    <Trash2 size={24} />
                  </button>
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
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
                {currentList.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => playLocalAudio(item.audioSrc[childGender])} 
                    disabled={isSpeaking}
                    className={`${item.color} relative group flex flex-col items-center justify-center p-6 md:p-8 rounded-[3.5rem] border-4 border-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg active:shadow-inner active:translate-y-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                  >
                    <img 
                      src={item.image} 
                      className="w-24 md:w-32 mb-4 group-hover:rotate-12 transition-transform duration-300 drop-shadow-md" 
                      draggable="false" 
                      alt={item.label[childGender]}
                      loading="lazy"
                    />
                    <div className="bg-white/90 px-6 py-3 rounded-2xl font-black text-xl md:text-2xl text-slate-800 shadow-sm text-center w-full">
                      {item.label[childGender]}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-20 flex justify-center pb-12">
              <button 
                onClick={() => { 
                  if(audioRef.current) audioRef.current.pause();
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
              <p>فكرة: ليلى أبو شباب / سارة أكرم</p>
              <span className="hidden md:inline text-slate-300">|</span>
              <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}