import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  Train,
  QrCode,
  Banknote,
  Sparkles,
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Plane,
  GraduationCap,
  Trees,
  Users,
  PhoneCall,
  ArrowRight,
  Sliders
} from 'lucide-react';

// Hardcoded 12 Delhi/NCR Metro Stations with phonetic aliases, colors, fares, and landmarks
const METRO_STATIONS = [
  {
    id: 'kashmere-gate',
    name: 'Kashmere Gate',
    hindiName: 'कश्मीरी गेट',
    line: 'Yellow & Red',
    lineColor: '#EAB308',
    lineTextColor: '#09090B',
    fare: 30,
    popular: true,
    landmark: 'ISBT Bus Terminal',
    icon: Train,
    aliases: ['kashmere gate', 'kasmiri gate', 'kashmiri gate', 'kashmir gate', 'kasmire', 'isbt']
  },
  {
    id: 'rajiv-chowk',
    name: 'Rajiv Chowk',
    hindiName: 'राजीव चौक',
    line: 'Yellow & Blue',
    lineColor: '#2563EB',
    lineTextColor: '#FFFFFF',
    fare: 30,
    popular: true,
    landmark: 'Connaught Place',
    icon: Landmark,
    aliases: ['rajiv chowk', 'rajeev chauk', 'rajiv chauk', 'rajeev chowk', 'cp', 'connaught place']
  },
  {
    id: 'aiims',
    name: 'AIIMS',
    hindiName: 'एम्स अस्पताल',
    line: 'Yellow',
    lineColor: '#EAB308',
    lineTextColor: '#09090B',
    fare: 40,
    popular: true,
    landmark: 'Main Hospital',
    icon: HeartPulse,
    aliases: ['aiims', 'aims', 'hospital', 'aspatal', 'ames']
  },
  {
    id: 'new-delhi',
    name: 'New Delhi',
    hindiName: 'नई दिल्ली',
    line: 'Yellow & Airport',
    lineColor: '#EAB308',
    lineTextColor: '#09090B',
    fare: 20,
    popular: true,
    landmark: 'Railway Station',
    icon: Train,
    aliases: ['new delhi', 'nai dilli', 'nayi dilli', 'railway station', 'delhi station']
  },
  {
    id: 'chandni-chowk',
    name: 'Chandni Chowk',
    hindiName: 'चांदनी चौक',
    line: 'Yellow',
    lineColor: '#EAB308',
    lineTextColor: '#09090B',
    fare: 20,
    popular: true,
    landmark: 'Red Fort / Market',
    icon: ShoppingBag,
    aliases: ['chandni chowk', 'chandni chauk', 'chandani chowk', 'lal qila', 'red fort']
  },
  {
    id: 'hauz-khas',
    name: 'Hauz Khas',
    hindiName: 'हौज खास',
    line: 'Yellow & Magenta',
    lineColor: '#C026D3',
    lineTextColor: '#FFFFFF',
    fare: 40,
    popular: false,
    landmark: 'IIT / Fort',
    icon: GraduationCap,
    aliases: ['hauz khas', 'hauj khas', 'haus khas', 'iit']
  },
  {
    id: 'noida-sector-18',
    name: 'Noida Sector 18',
    hindiName: 'नोएडा सेक्टर 18',
    line: 'Blue',
    lineColor: '#2563EB',
    lineTextColor: '#FFFFFF',
    fare: 50,
    popular: true,
    landmark: 'Atta Market / Mall',
    icon: Building2,
    aliases: ['noida sector 18', 'sector 18', 'noida 18', 'atta market']
  },
  {
    id: 'noida-city-centre',
    name: 'Noida City Centre',
    hindiName: 'नोएडा सिटी सेंटर',
    line: 'Blue',
    lineColor: '#2563EB',
    lineTextColor: '#FFFFFF',
    fare: 50,
    popular: false,
    landmark: 'Noida Bus Stand',
    icon: Building2,
    aliases: ['noida city centre', 'noida city center', 'city centre', 'city center']
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    hindiName: 'बोटैनिकल गार्डन',
    line: 'Blue & Magenta',
    lineColor: '#C026D3',
    lineTextColor: '#FFFFFF',
    fare: 50,
    popular: false,
    landmark: 'Interchange / Park',
    icon: Trees,
    aliases: ['botanical garden', 'botanical', 'batanical garden']
  },
  {
    id: 'vaishali',
    name: 'Vaishali',
    hindiName: 'वैशाली',
    line: 'Blue',
    lineColor: '#2563EB',
    lineTextColor: '#FFFFFF',
    fare: 40,
    popular: false,
    landmark: 'Ghaziabad Border',
    icon: Train,
    aliases: ['vaishali', 'veshali', 'baishali']
  },
  {
    id: 'dwarka-sector-21',
    name: 'Dwarka Sector 21',
    hindiName: 'द्वारका सेक्टर 21',
    line: 'Blue & Airport',
    lineColor: '#2563EB',
    lineTextColor: '#FFFFFF',
    fare: 60,
    popular: false,
    landmark: 'Airport Express Link',
    icon: Plane,
    aliases: ['dwarka sector 21', 'dwarka 21', 'dwarka', 'duarka']
  },
  {
    id: 'huda-city-centre',
    name: 'Huda City Centre',
    hindiName: 'हुडा सिटी सेंटर',
    line: 'Yellow',
    lineColor: '#EAB308',
    lineTextColor: '#09090B',
    fare: 60,
    popular: false,
    landmark: 'Gurugram Terminus',
    icon: Building2,
    aliases: ['huda city centre', 'huda city center', 'huda', 'gurgaon', 'gurugram']
  }
];

// Helper: Extract ticket count from Hindi/English/Hinglish speech
const extractTicketCount = (text) => {
  const lower = text.toLowerCase();
  if (/\b(1|ek|one|single|ak)\b/.test(lower)) return 1;
  if (/\b(2|do|two|double|doo)\b/.test(lower)) return 2;
  if (/\b(3|teen|three|tin)\b/.test(lower)) return 3;
  if (/\b(4|char|four|chaar)\b/.test(lower)) return 4;
  return null;
};

// Helper: Levenshtein distance for accent & spelling tolerance
const levenshtein = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

// Helper: Match station name or detect ambiguity
const matchStationInput = (rawText) => {
  const cleaned = rawText
    .toLowerCase()
    .replace(/mujhe|jaana hai|jana hai|ki|ke|liye|ticket|tickets|chahiye|please|to|go|want|i/g, ' ')
    .replace(/\b(1|2|3|4|ek|do|teen|char|one|two|three|four)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return { type: 'unknown' };

  // Check explicit ambiguity for "noida"
  if (cleaned === 'noida' || (cleaned.includes('noida') && !cleaned.includes('18') && !cleaned.includes('city') && !cleaned.includes('center') && !cleaned.includes('centre'))) {
    const noidaOptions = METRO_STATIONS.filter((s) => s.id.startsWith('noida-'));
    return { type: 'ambiguous', options: noidaOptions };
  }

  // Exact or substring match against aliases
  for (const station of METRO_STATIONS) {
    for (const alias of station.aliases) {
      if (cleaned.includes(alias) || alias.includes(cleaned)) {
        return { type: 'match', station };
      }
    }
  }

  // Fuzzy match for regional accents (e.g., "Kasmiri Gate", "Rajeev Chauk")
  let bestStation = null;
  let bestScore = Infinity;
  for (const station of METRO_STATIONS) {
    for (const alias of station.aliases) {
      const dist = levenshtein(cleaned, alias);
      const threshold = Math.max(2, Math.floor(alias.length * 0.35));
      if (dist <= threshold && dist < bestScore) {
        bestScore = dist;
        bestStation = station;
      }
    }
  }

  if (bestStation) {
    return { type: 'match', station: bestStation };
  }

  return { type: 'unknown' };
};

export default function App() {
  // Kiosk State Machine: IDLE | COUNT | CONFIRM | PAYMENT | DISPENSED | AMBIGUOUS | FALLBACK | STAFF_HELP
  const [step, setStep] = useState('IDLE');
  const [selectedStation, setSelectedStation] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [ambiguousOptions, setAmbiguousOptions] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [noiseWarning, setNoiseWarning] = useState(false);

  // Speech & UI States
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [spokenText, setSpokenText] = useState(
    'Namaste! Mic dabayein ya bolein: Mujhe [station] jaana hai.'
  );
  const [lastHeard, setLastHeard] = useState('');
  const [countdown, setCountdown] = useState(7);

  const recognitionRef = useRef(null);

  // Text-to-Speech Function
  const speak = useCallback(
    (message) => {
      setSpokenText(message);
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      if (isMuted) return;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92; // Slightly slower for elderly clarity
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  // Speak initial greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Namaste! Mic dabayein ya bolein: Mujhe station ka naam jaana hai.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Auto-reset timer on Ticket Dispensed screen
  useEffect(() => {
    if (step !== 'DISPENSED') return;
    setCountdown(7);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          resetKiosk();
          return 7;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Reset Kiosk to Step 1
  const resetKiosk = () => {
    setStep('IDLE');
    setSelectedStation(null);
    setTicketCount(1);
    setAmbiguousOptions([]);
    setErrorCount(0);
    setNoiseWarning(false);
    setLastHeard('');
    setIsListening(false);
    speak('Namaste! Mic dabayein ya bolein: Mujhe station ka naam jaana hai.');
  };

  // Handle Noise / Misheard Error & 2-Strike Fallback
  const triggerNoiseOrError = (customPrompt) => {
    const nextErrors = errorCount + 1;
    setErrorCount(nextErrors);

    if (nextErrors >= 2) {
      setNoiseWarning(false);
      setStep('FALLBACK');
      speak(
        'Koi baat nahi. Neeche diye gaye bade button dabayein, ya Staff Help ke liye laal button chunein.'
      );
    } else {
      setNoiseWarning(true);
      speak(
        customPrompt ||
          'Maaf kijiye, station mein shor ki wajah se sun nahi paaya. Mic ke paas aakar phir se bolein.'
      );
    }
  };

  // Process any voice or simulated user utterance
  const processUserSpeech = (transcript) => {
    const raw = transcript.trim();
    if (!raw) return;
    setLastHeard(raw);
    setNoiseWarning(false);
    const lower = raw.toLowerCase();

    // Global cancel / reset
    if (/\b(cancel|ruko|band|reset|shuru)\b/.test(lower)) {
      resetKiosk();
      return;
    }

    // Step-specific handling
    if (step === 'IDLE' || step === 'FALLBACK') {
      const countFound = extractTicketCount(raw);
      const stationResult = matchStationInput(raw);

      if (stationResult.type === 'ambiguous') {
        setErrorCount(0);
        setAmbiguousOptions(stationResult.options);
        setStep('AMBIGUOUS');
        speak(
          `Kya aap ${stationResult.options[0].name} jaana chahte hain ya ${stationResult.options[1].name}? Ek ya Do bolein.`
        );
        return;
      }

      if (stationResult.type === 'match') {
        const st = stationResult.station;
        setErrorCount(0);
        setSelectedStation(st);

        if (countFound) {
          setTicketCount(countFound);
          setStep('CONFIRM');
          const total = st.fare * countFound;
          speak(
            `${st.name} ke liye ${countFound} tickets, kul ${total} rupaye. Kya yeh sahi hai? Haan ya Naa bolein.`
          );
        } else {
          setStep('COUNT');
          speak(`${st.name}, ${st.line} Line. Kitni tickets chahiye? Ek, do, ya teen?`);
        }
        return;
      }

      // Unrecognized input
      triggerNoiseOrError(
        'Maaf kijiye, station ka naam samajh nahi aaya. Kripya mic ke paas aakar phir se station bolein.'
      );
      return;
    }

    if (step === 'AMBIGUOUS') {
      const countFound = extractTicketCount(raw);
      if (countFound === 1 || lower.includes('18') || lower.includes('pehla')) {
        const chosen = ambiguousOptions[0];
        setSelectedStation(chosen);
        setStep('COUNT');
        speak(`${chosen.name}, ${chosen.line} Line. Kitni tickets chahiye? Ek, do, ya teen?`);
        return;
      }
      if (countFound === 2 || lower.includes('city') || lower.includes('doosra')) {
        const chosen = ambiguousOptions[1];
        setSelectedStation(chosen);
        setStep('COUNT');
        speak(`${chosen.name}, ${chosen.line} Line. Kitni tickets chahiye? Ek, do, ya teen?`);
        return;
      }
      triggerNoiseOrError('Kripya Ek ya Do bolein, ya screen par apna station chunein.');
      return;
    }

    if (step === 'COUNT') {
      const countFound = extractTicketCount(raw);
      if (countFound && selectedStation) {
        setErrorCount(0);
        setTicketCount(countFound);
        setStep('CONFIRM');
        const total = selectedStation.fare * countFound;
        speak(
          `${selectedStation.name} ke liye ${countFound} tickets, kul ${total} rupaye. Kya yeh sahi hai? Haan ya Naa bolein.`
        );
      } else {
        triggerNoiseOrError('Kitni tickets chahiye? Ek, do, teen, ya chaar bolein.');
      }
      return;
    }

    if (step === 'CONFIRM') {
      if (/\b(haan|ha|han|yes|theek|sahi|ok|okay|bilkul)\b/.test(lower)) {
        setErrorCount(0);
        setStep('PAYMENT');
        speak('Payment karne ke liye cash daalein ya QR code scan karein.');
        return;
      }
      if (/\b(naa|na|nahi|no|galat|change|badlo)\b/.test(lower)) {
        setErrorCount(0);
        setStep('IDLE');
        setSelectedStation(null);
        speak('Theek hai. Kripya dobara batayein aapko kahan jaana hai?');
        return;
      }
      triggerNoiseOrError('Kya yeh sahi hai? Kripya Haan ya Naa bolein.');
      return;
    }

    if (step === 'PAYMENT') {
      if (/\b(done|paid|ho gaya|payment|complete)\b/.test(lower)) {
        handlePaymentSuccess();
      }
    }
  };

  // Start Real Browser SpeechRecognition
  const startListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      speak('Browser voice mic uplabdh nahi hai. Neeche Simulator buttons ka upyog karein.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setNoiseWarning(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        processUserSpeech(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          triggerNoiseOrError();
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Manual Touch Handlers (for elderly / fallback mode)
  const handleSelectStationCard = (station) => {
    setErrorCount(0);
    setNoiseWarning(false);
    setSelectedStation(station);
    setStep('COUNT');
    speak(`${station.name}, ${station.line} Line. Kitni tickets chahiye? Ek, do, ya teen?`);
  };

  const handleSelectCount = (count) => {
    if (!selectedStation) return;
    setErrorCount(0);
    setNoiseWarning(false);
    setTicketCount(count);
    setStep('CONFIRM');
    const total = selectedStation.fare * count;
    speak(
      `${selectedStation.name} ke liye ${count} tickets, kul ${total} rupaye. Kya yeh sahi hai? Haan ya Naa bolein.`
    );
  };

  const handleConfirmYes = () => {
    setStep('PAYMENT');
    speak('Payment karne ke liye cash daalein ya QR code scan karein.');
  };

  const handleConfirmNo = () => {
    setStep('IDLE');
    setSelectedStation(null);
    speak('Theek hai. Kripya dobara batayein aapko kahan jaana hai?');
  };

  const handlePaymentSuccess = () => {
    setStep('DISPENSED');
    speak('Payment safal hui! Kripya neeche se apni ticket lein. Shubh yatra!');
  };

  const handleStaffHelp = () => {
    setStep('STAFF_HELP');
    speak('Sahayata bulaayi gayi hai. Metro staff 1 minute mein aapke paas aa rahe hain.');
  };

  const popularStations = METRO_STATIONS.filter((s) => s.popular).slice(0, 6);
  const totalFare = selectedStation ? selectedStation.fare * ticketCount : 0;

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between font-sans select-none">
      {/* TOP ACCESSIBILITY HEADER */}
      <header className="w-full border-b-4 border-yellow-400 bg-zinc-950 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-zinc-950 p-3 rounded-2xl">
            <Train className="w-9 h-9 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-yellow-400 uppercase">
              Metro Bol-Ticket
            </h1>
            <p className="text-base sm:text-lg font-bold text-zinc-300">
              आवाज़ से टिकट लें • Voice Kiosk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Replay Audio Button */}
          <button
            onClick={() => speak(spokenText)}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded-2xl text-lg sm:text-xl font-extrabold transition"
            aria-label="Replay Voice Instruction"
          >
            <Volume2 className="w-7 h-7" />
            <span>Sunayein</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => {
              if (!isMuted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsMuted(!isMuted);
            }}
            className={`p-3.5 rounded-2xl border-2 font-bold transition ${
              isMuted
                ? 'bg-red-600 border-red-400 text-white'
                : 'bg-zinc-800 border-zinc-600 text-zinc-200'
            }`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
          </button>

          {/* Staff Help Quick Trigger */}
          <button
            onClick={handleStaffHelp}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-4 py-3 rounded-2xl text-lg sm:text-xl font-black border-2 border-red-300 transition"
          >
            <HelpCircle className="w-7 h-7" />
            <span className="hidden sm:inline">Help / मदद</span>
          </button>
        </div>
      </header>

      {/* LIVE VOICE PROMPT BANNER (High-Contrast Subtitle Readout) */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-5">
        <div className="bg-zinc-900 border-4 border-yellow-400 rounded-3xl p-5 sm:p-6 shadow-2xl flex items-start gap-4">
          <div className="bg-yellow-400 text-zinc-950 p-3 rounded-2xl shrink-0 mt-1">
            <Volume2 className="w-8 h-8 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-300 leading-snug">
              “{spokenText}”
            </p>
            {lastHeard && (
              <p className="mt-2 text-lg sm:text-xl font-bold text-zinc-400">
                Aapne kaha: <span className="text-white underline">"{lastHeard}"</span>
              </p>
            )}
          </div>
        </div>

        {/* STATION NOISE WARNING BANNER */}
        {noiseWarning && (
          <div className="mt-4 bg-amber-500 text-zinc-950 rounded-3xl p-5 border-4 border-white flex items-center gap-4 animate-bounce">
            <AlertTriangle className="w-12 h-12 shrink-0 stroke-[2.5]" />
            <div>
              <p className="text-2xl sm:text-3xl font-black">
                Station mein shor zyada hai! (Attempt {errorCount}/2)
              </p>
              <p className="text-xl font-bold">
                Kripya mic ke paas aakar saaf aawaaz mein phir bolein.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MAIN KIOSK STAGE */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center justify-center">
        {/* STEP 1: IDLE / WAKE STATE */}
        {step === 'IDLE' && (
          <div className="w-full flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl font-black text-white">
                Kahan Jaana Hai?
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
                Bolein: “Mujhe Kashmere Gate jaana hai”
              </p>
            </div>

            {/* Massive Pulsing Microphone Button */}
            <button
              onClick={startListening}
              className={`relative group w-52 h-52 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center border-8 transition-all active:scale-95 shadow-[0_0_60px_rgba(250,204,21,0.45)] ${
                isListening
                  ? 'bg-red-600 border-white text-white animate-pulse'
                  : 'bg-yellow-400 hover:bg-yellow-300 border-white text-zinc-950'
              }`}
            >
              <Mic className="w-24 h-24 sm:w-28 sm:h-28 stroke-[2.5]" />
              <span className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-wide">
                {isListening ? 'Sun Raha Hoon...' : 'Bolein / Tap'}
              </span>
            </button>

            {/* Quick Tap Popular Stations Hint */}
            <div className="w-full pt-4">
              <p className="text-xl font-bold text-zinc-400 mb-3">
                Ya neeche station chunein (Tap Station):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {popularStations.slice(0, 3).map((st) => {
                  const IconComp = st.icon;
                  return (
                    <button
                      key={st.id}
                      onClick={() => handleSelectStationCard(st)}
                      className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-yellow-400 p-4 rounded-2xl flex items-center gap-3 text-left transition"
                    >
                      <span
                        className="w-5 h-12 rounded-full shrink-0"
                        style={{ backgroundColor: st.lineColor }}
                      />
                      <div>
                        <div className="text-xl sm:text-2xl font-black text-white">{st.name}</div>
                        <div className="text-base font-bold text-yellow-400">₹{st.fare}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AMBIGUOUS STATION CHOICE (Max 2 Huge Cards) */}
        {step === 'AMBIGUOUS' && (
          <div className="w-full space-y-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-yellow-400">
              Kaun sa Noida Station? (1 ya 2 chunein)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ambiguousOptions.map((st, idx) => {
                const IconComp = st.icon;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleSelectStationCard(st)}
                    className="bg-zinc-900 hover:bg-zinc-800 border-4 border-yellow-400 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 active:scale-95 transition"
                  >
                    <span className="bg-yellow-400 text-zinc-950 text-3xl font-black w-14 h-14 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <IconComp className="w-16 h-16 text-yellow-400" />
                    <div className="text-3xl sm:text-4xl font-black text-white">{st.name}</div>
                    <div className="text-2xl font-bold text-zinc-300">{st.hindiName}</div>
                    <span
                      className="px-5 py-2 rounded-full text-xl font-black"
                      style={{ backgroundColor: st.lineColor, color: st.lineTextColor }}
                    >
                      {st.line} Line • ₹{st.fare}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 -> 3: PASSENGER COUNT SELECTION */}
        {step === 'COUNT' && selectedStation && (
          <div className="w-full space-y-8 text-center">
            <div className="bg-zinc-900 border-4 border-zinc-700 rounded-3xl p-6 inline-flex flex-col sm:flex-row items-center gap-4">
              <span
                className="px-5 py-2 rounded-2xl text-2xl font-black"
                style={{
                  backgroundColor: selectedStation.lineColor,
                  color: selectedStation.lineTextColor
                }}
              >
                {selectedStation.line} Line
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                {selectedStation.name}
              </h2>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-yellow-400">
              Kitni Tickets Chahiye? (Bolein ya Dabayein)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[
                { num: 1, hindi: 'एक (Ek)' },
                { num: 2, hindi: 'दो (Do)' },
                { num: 3, hindi: 'तीन (Teen)' },
                { num: 4, hindi: 'चार (Chaar)' }
              ].map((item) => (
                <button
                  key={item.num}
                  onClick={() => handleSelectCount(item.num)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-zinc-950 border-4 border-white rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 active:scale-95 transition shadow-xl"
                >
                  <span className="text-5xl sm:text-6xl font-black">{item.num}</span>
                  <span className="text-2xl font-extrabold">{item.hindi}</span>
                </button>
              ))}
            </div>

            <button
              onClick={startListening}
              className="inline-flex items-center gap-3 bg-zinc-800 border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-full text-2xl font-black"
            >
              <Mic className="w-8 h-8" />
              <span>Mic se bolein (Ek, Do, Teen...)</span>
            </button>
          </div>
        )}

        {/* STEP 3: HIGH-CONTRAST CONFIRMATION (Only 4 Huge Elements) */}
        {step === 'CONFIRM' && selectedStation && (
          <div className="w-full space-y-6">
            <div className="bg-zinc-900 border-4 border-yellow-400 rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center items-center">
              {/* Element 1: Station + Line Badge */}
              <div className="space-y-2">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-lg font-black"
                  style={{
                    backgroundColor: selectedStation.lineColor,
                    color: selectedStation.lineTextColor
                  }}
                >
                  {selectedStation.line} Line
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white">
                  {selectedStation.name}
                </div>
              </div>

              {/* Element 2: Ticket Count */}
              <div className="border-y-2 sm:border-y-0 sm:border-x-2 border-zinc-700 py-4 sm:py-0">
                <div className="text-xl font-bold text-zinc-400 uppercase">Tickets</div>
                <div className="text-5xl sm:text-6xl font-black text-yellow-400">
                  {ticketCount}
                </div>
              </div>

              {/* Element 3: Total Fare */}
              <div>
                <div className="text-xl font-bold text-zinc-400 uppercase">Kul Kiraya</div>
                <div className="text-5xl sm:text-6xl font-black text-white">₹{totalFare}</div>
              </div>
            </div>

            {/* Element 4: Massive GREEN (Haan) & RED (Naa) Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={handleConfirmYes}
                className="bg-green-500 hover:bg-green-400 text-zinc-950 border-4 border-white rounded-3xl p-8 flex items-center justify-center gap-4 text-4xl sm:text-5xl font-black active:scale-95 transition shadow-2xl"
              >
                <Check className="w-14 h-14 stroke-[3.5]" />
                <span>HAAN / YES</span>
              </button>

              <button
                onClick={handleConfirmNo}
                className="bg-red-600 hover:bg-red-500 text-white border-4 border-white rounded-3xl p-8 flex items-center justify-center gap-4 text-4xl sm:text-5xl font-black active:scale-95 transition shadow-2xl"
              >
                <X className="w-14 h-14 stroke-[3.5]" />
                <span>NAA / NO</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT (UPI QR + Cash Slot) */}
        {step === 'PAYMENT' && selectedStation && (
          <div className="w-full space-y-6 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white">
              Kul Bhugtan: <span className="text-yellow-400 text-5xl">₹{totalFare}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* UPI QR Box */}
              <div className="bg-white text-zinc-950 rounded-3xl p-6 border-4 border-yellow-400 flex flex-col items-center justify-center gap-3">
                <QrCode className="w-40 h-40 stroke-[1.75]" />
                <div className="text-2xl sm:text-3xl font-black">UPI QR Scan Karein</div>
                <div className="text-lg font-bold text-zinc-600">GPay / PhonePe / Paytm</div>
              </div>

              {/* Cash Slot Visual */}
              <div className="bg-zinc-900 rounded-3xl p-6 border-4 border-yellow-400 flex flex-col items-center justify-center gap-4">
                <div className="w-48 h-6 bg-zinc-950 border-4 border-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.7)] animate-pulse" />
                <Banknote className="w-24 h-24 text-emerald-400 animate-bounce" />
                <div className="text-2xl sm:text-3xl font-black text-white">
                  Ya Note (Cash) Daalein
                </div>
                <div className="text-lg font-bold text-zinc-400">₹10, ₹20, ₹50, ₹100</div>
              </div>
            </div>

            <button
              onClick={handlePaymentSuccess}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 border-4 border-white px-10 py-5 rounded-3xl text-2xl sm:text-3xl font-black inline-flex items-center justify-center gap-3 active:scale-95 transition shadow-xl"
            >
              <Check className="w-9 h-9 stroke-[3]" />
              <span>Payment Done (Ticket Nikalein)</span>
            </button>
          </div>
        )}

        {/* STEP 5: TICKET DISPENSED */}
        {step === 'DISPENSED' && selectedStation && (
          <div className="w-full max-w-2xl bg-zinc-900 border-4 border-emerald-400 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500 text-zinc-950 mx-auto">
              <Check className="w-16 h-16 stroke-[3.5]" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-emerald-400">
              Ticket Taiyaar Hai!
            </h2>

            {/* Simulated Sliding Metro QR Ticket */}
            <div className="bg-yellow-400 text-zinc-950 rounded-2xl p-6 border-4 border-dashed border-zinc-950 flex items-center justify-between gap-4 animate-pulse">
              <div className="text-left">
                <div className="text-sm font-black uppercase tracking-wider">DMRC QR TOKEN</div>
                <div className="text-3xl font-black">{selectedStation.name}</div>
                <div className="text-xl font-extrabold">
                  {ticketCount} Passenger • ₹{totalFare} PAID
                </div>
              </div>
              <QrCode className="w-20 h-20 shrink-0" />
            </div>

            <p className="text-2xl font-bold text-white">
              Neeche slot se apni ticket lein. ({countdown}s mein reset)
            </p>

            <button
              onClick={resetKiosk}
              className="bg-white text-zinc-950 px-8 py-4 rounded-2xl text-2xl font-black inline-flex items-center gap-2 hover:bg-yellow-300 transition"
            >
              <RotateCcw className="w-7 h-7" />
              <span>Nayi Ticket (New)</span>
            </button>
          </div>
        )}

        {/* 2-STRIKE FALLBACK MODE (6 Big Icon Station Cards + Staff Help) */}
        {step === 'FALLBACK' && (
          <div className="w-full space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-black text-yellow-400">
                Station Chunein (Tap Karein):
              </h2>
              <button
                onClick={handleStaffHelp}
                className="bg-red-600 hover:bg-red-500 text-white border-4 border-white px-6 py-4 rounded-2xl text-2xl font-black flex items-center gap-3 animate-pulse"
              >
                <Users className="w-8 h-8" />
                <span>STAFF HELP / SAHAYATA</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {popularStations.map((st) => {
                const IconComp = st.icon;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleSelectStationCard(st)}
                    className="bg-zinc-900 hover:bg-zinc-800 border-4 border-yellow-400 rounded-3xl p-6 flex flex-col items-start gap-2 text-left active:scale-95 transition"
                  >
                    <div className="w-full flex items-center justify-between">
                      <IconComp className="w-11 h-11 text-yellow-400" />
                      <span
                        className="px-3 py-1 rounded-full text-base font-black"
                        style={{ backgroundColor: st.lineColor, color: st.lineTextColor }}
                      >
                        ₹{st.fare}
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                      {st.name}
                    </div>
                    <div className="text-xl font-bold text-zinc-300">{st.hindiName}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STAFF HELP ALERT SCREEN */}
        {step === 'STAFF_HELP' && (
          <div className="w-full max-w-2xl bg-red-950 border-4 border-red-500 rounded-3xl p-8 text-center space-y-6">
            <PhoneCall className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Sahayata Aa Rahi Hai!
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-300">
              Kripya yahin rukein. Metro staff 1 minute mein aapki madad ke liye pahunch rahe hain.
            </p>
            <button
              onClick={resetKiosk}
              className="bg-yellow-400 text-zinc-950 px-8 py-4 rounded-2xl text-2xl font-black inline-flex items-center gap-3"
            >
              <RotateCcw className="w-7 h-7" />
              <span>Wapas Shuru Karein</span>
            </button>
          </div>
        )}
      </main>

      {/* EVALUATOR / DEMO & EDGE-CASE SIMULATOR BAR */}
      <footer className="w-full bg-zinc-950 border-t-2 border-zinc-800 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-yellow-400 mb-2">
            <Sliders className="w-4 h-4" />
            <span>Demo & Edge-Case Simulator (1-Click Voice Testing)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => processUserSpeech('Mujhe Kashmere Gate jaana hai')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 px-3 py-2 rounded-xl text-sm font-bold transition"
            >
              1. "Mujhe Kashmere Gate jaana hai"
            </button>

            <button
              onClick={() => processUserSpeech('Rajeev Chauk 2 tickets')}
              className="bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-700 px-3 py-2 rounded-xl text-sm font-bold transition"
            >
              2. Accent + Count: "Rajeev Chauk 2 tickets"
            </button>

            <button
              onClick={() => processUserSpeech('Noida')}
              className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-700 px-3 py-2 rounded-xl text-sm font-bold transition"
            >
              3. Ambiguous: "Noida"
            </button>

            <button
              onClick={() => triggerNoiseOrError()}
              className="bg-zinc-800 hover:bg-zinc-700 text-red-300 border border-red-700 px-3 py-2 rounded-xl text-sm font-bold transition"
            >
              4. Station Noise Error (2x = Fallback)
            </button>

            <button
              onClick={() => processUserSpeech('Do')}
              className="bg-zinc-800 hover:bg-zinc-700 text-sky-300 border border-sky-700 px-3 py-2 rounded-xl text-sm font-bold transition"
            >
              Say "Do (2)"
            </button>

            <button
              onClick={() => processUserSpeech('Haan')}
              className="bg-zinc-800 hover:bg-zinc-700 text-green-300 border border-green-700 px-3 py-2 rounded-xl text-sm font-bold transition"
            >
              Say "Haan (Yes)"
            </button>

            <button
              onClick={resetKiosk}
              className="ml-auto bg-yellow-400 hover:bg-yellow-300 text-zinc-950 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Kiosk</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
