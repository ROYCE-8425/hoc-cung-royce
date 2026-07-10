// Supported premium AI voices (Edge Neural voices)
export interface PremiumVoice {
  id: string;
  name: string;
  lang: string;
}

export const PREMIUM_VOICES: PremiumVoice[] = [
  { id: 'en-US-AriaNeural', name: 'Aria (US Female - Professional)', lang: 'en-US' },
  { id: 'en-US-GuyNeural', name: 'Guy (US Male - Natural)', lang: 'en-US' },
  { id: 'en-US-JennyNeural', name: 'Jenny (US Female - Warm/Friendly)', lang: 'en-US' },
  { id: 'en-US-ChristopherNeural', name: 'Christopher (US Male - Conversational)', lang: 'en-US' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (UK Female - Classy)', lang: 'en-GB' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (UK Male - Natural)', lang: 'en-GB' },
  { id: 'en-AU-NatashaNeural', name: 'Natasha (AU Female - Expressive)', lang: 'en-AU' },
  { id: 'en-AU-WilliamNeural', name: 'William (AU Male - Natural)', lang: 'en-AU' },
];

let currentAudio: HTMLAudioElement | null = null;

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const getCurrentAudio = (): HTMLAudioElement | null => {
  return currentAudio;
};

export const speakTextWithAI = async (
  text: string,
  voiceId: string,
  rate: number = 0.9,
  onEnd?: () => void
): Promise<HTMLAudioElement | null> => {
  const isPremium = PREMIUM_VOICES.some((v) => v.id === voiceId);
  
  if (!isPremium) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.voiceURI === voiceId);
      if (voice) utterance.voice = voice;
      if (onEnd) utterance.onend = onEnd;
      window.speechSynthesis.speak(utterance);
    }
    return null;
  }

  // Handle premium AI voice using direct browser audio streaming from the public backend endpoint
  try {
    stopSpeech();

    // Use VITE_API_URL if defined, otherwise derive from current location
    const baseApiUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : 'https://api.trannhuy.online/api/v1');
    const audioUrl = `${baseApiUrl}/ai/tts?text=${encodeURIComponent(text)}&voice=${voiceId}`;
    
    const audio = new Audio(audioUrl);
    audio.playbackRate = rate;
    if (onEnd) {
      audio.addEventListener('ended', onEnd);
    }
    currentAudio = audio;
    
    await audio.play();
    return audio;
  } catch (error) {
    console.error('Failed to stream premium TTS, falling back to browser voice:', error);
    // Fallback to browser default
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      if (onEnd) utterance.onend = onEnd;
      window.speechSynthesis.speak(utterance);
    }
    return null;
  }
};
