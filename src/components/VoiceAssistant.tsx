import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";

export const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const startAssistant = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // 1. Setup Audio Context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      await audioContextRef.current.resume();

      // 2. Connect to Live API
      const sessionPromise = ai.live.connect({
        model: MODEL,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
          },
          systemInstruction: "You are a luxury Moroccan Caftan brand assistant. You are a sophisticated Moroccan woman named 'Lalla L'Or'. You speak Darija (Moroccan Arabic) fluently and elegantly. You help customers with their style choices, explain the heritage of Moroccan caftans, and provide a premium experience. Be warm, sophisticated, and helpful. Always respond in Darija unless asked otherwise. Keep your responses concise and conversational.",
        },
        callbacks: {
          onopen: () => {
            console.log("Live API connected");
            startMic();
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              if (base64Audio) {
                handleIncomingAudio(base64Audio);
              }
            }
            if (message.serverContent?.interrupted) {
              stopPlayback();
            }
          },
          onclose: () => {
            console.log("Live API closed");
            stopAssistant();
          },
          onerror: (err: any) => {
            console.error("Live API error:", err);
            setError("Connection error. Please try again.");
            stopAssistant();
          }
        }
      });

      sessionRef.current = await sessionPromise;
      setIsActive(true);
      setIsConnecting(false);
    } catch (err: any) {
      console.error("Failed to start assistant:", err);
      setError(err.message || "Could not access microphone or connect to AI.");
      setIsConnecting(false);
      stopAssistant();
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = audioContextRef.current!.createMediaStreamSource(stream);
      // Use 2048 for lower latency
      const processor = audioContextRef.current!.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!sessionRef.current) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        let binary = '';
        const bytes = new Uint8Array(pcmData.buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);
        
        try {
          sessionRef.current.sendRealtimeInput({
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        } catch (e) {
          console.error("Error sending audio", e);
        }
      };

      source.connect(processor);
      processor.connect(audioContextRef.current!.destination);
    } catch (err) {
      console.error("Mic error:", err);
      setError("Microphone access denied.");
      stopAssistant();
    }
  };

  const handleIncomingAudio = (base64Data: string) => {
    if (!audioContextRef.current) return;
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }
    
    // Gemini Live API returns audio at 24000Hz
    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    const currentTime = audioContextRef.current.currentTime;
    if (nextPlayTimeRef.current < currentTime) {
      nextPlayTimeRef.current = currentTime;
    }
    
    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += buffer.duration;
    
    activeSourcesRef.current.push(source);
    setIsSpeaking(true);
    
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
      if (activeSourcesRef.current.length === 0) {
        setIsSpeaking(false);
      }
    };
  };

  const stopPlayback = () => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
    setIsSpeaking(false);
  };

  const stopAssistant = () => {
    stopPlayback();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 glass-panel p-6 rounded-2xl w-72 border border-[#D4AF37]/40 shadow-2xl"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                  <Sparkles className="text-[#0D0D0D] w-6 h-6" />
                </div>
                {isSpeaking && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -inset-1 border border-[#D4AF37] rounded-full opacity-50"
                  />
                )}
              </div>
              <div>
                <h4 className="font-serif text-[#F5F5DC] text-lg">Lalla L'Or</h4>
                <p className="text-xs text-[#D4AF37] uppercase tracking-widest">AI Assistant</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-[#F5F5DC]/80 font-light leading-relaxed">
                {isSpeaking ? "Lalla L'Or is speaking..." : "Listening to your requests in Darija..."}
              </p>
              
              <div className="flex items-center justify-center space-x-1 h-8">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: isActive ? [8, Math.random() * 24 + 8, 8] : 8 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.5, 
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-1 bg-[#D4AF37] rounded-full"
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-400 text-center">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={isActive ? stopAssistant : startAssistant}
        disabled={isConnecting}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border ${
          isActive 
            ? 'bg-[#0D0D0D] border-red-500/50 text-red-500' 
            : 'bg-gold-lux border-[#D4AF37]/50 text-[#0D0D0D]'
        } ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
      >
        {isConnecting ? (
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isActive ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>
    </div>
  );
};
