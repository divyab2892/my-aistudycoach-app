import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from './common/Button';
import Card from './common/Card';

// --- Audio Utility Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
// --- End Audio Utility Functions ---


const VoiceCoachView: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
    const [transcript, setTranscript] = useState<{ speaker: 'user' | 'model'; text: string }[]>([]);
    const [error, setError] = useState<string>('');

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const stopConversation = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => {
                session.close();
            }).catch(console.error);
            sessionPromiseRef.current = null;
        }
        
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
           audioContextRef.current.close();
        }
       
        setStatus('idle');
    }, []);
    
    useEffect(() => {
        return () => {
            stopConversation();
        };
    }, [stopConversation]);

    const startConversation = async () => {
        setStatus('connecting');
        setTranscript([]);
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let nextStartTime = 0;
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const outputNode = outputAudioContext.createGain();
            outputNode.connect(outputAudioContext.destination);
            const sources = new Set<AudioBufferSourceNode>();
            
            let currentInputTranscription = '';
            let currentOutputTranscription = '';

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: async () => {
                        console.log('Session opened.');
                        setStatus('active');
                        // Start streaming microphone audio
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        mediaStreamRef.current = stream;
                        
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const source = audioContextRef.current.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;

                        const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                         if (message.serverContent?.inputTranscription) {
                            currentInputTranscription += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            if(currentInputTranscription.trim()){
                                setTranscript(prev => [...prev, {speaker: 'user', text: currentInputTranscription.trim()}]);
                            }
                            if(currentOutputTranscription.trim()){
                                setTranscript(prev => [...prev, {speaker: 'model', text: currentOutputTranscription.trim()}]);
                            }
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => sources.delete(source));
                            source.start(nextStartTime);
                            nextStartTime = nextStartTime + audioBuffer.duration;
                            sources.add(source);
                        }
                         if (message.serverContent?.interrupted) {
                            for (const source of sources.values()) {
                                source.stop();
                                sources.delete(source);
                            }
                            nextStartTime = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setError('An error occurred during the session. Please try again.');
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Session closed.');
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

        } catch (err) {
            console.error(err);
            setError('Failed to start the conversation. Check microphone permissions.');
            setStatus('error');
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900">Voice Coach</h2>
                <p className="mt-2 text-lg text-slate-600">
                    Talk directly with your AI coach.
                </p>
            </div>
            <Card>
                <div className="flex flex-col items-center gap-4">
                     {status === 'idle' && <Button onClick={startConversation}>Start Conversation</Button>}
                     {status === 'connecting' && <p className="text-slate-600">Connecting...</p>}
                     {status === 'active' && <Button variant="secondary" onClick={stopConversation}>Stop Conversation</Button>}
                     {status === 'error' && <p className="text-red-500">{error}</p>}

                     {status === 'active' &&
                        <div className="flex items-center gap-2 text-indigo-600">
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                            Listening...
                        </div>
                     }
                </div>
            </Card>

            {transcript.length > 0 &&
                <Card>
                    <div className="space-y-4 h-64 overflow-y-auto p-2">
                        {transcript.map((entry, index) => (
                            <div key={index} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${entry.speaker === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                    <p>{entry.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            }
        </div>
    );
};

export default VoiceCoachView;