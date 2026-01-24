'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
   Mic,
   Video,
   Sparkles,
   BrainCircuit,
   BarChart3,
   Play,
   Settings,
   Loader2,
   CheckCircle2,
   ArrowRight,
   Volume2,
   MessageSquare,
   History,
   XCircle,
   ChevronDown,
   ChevronUp,
   Calendar,
   Clock,
} from 'lucide-react'
import axios from 'axios'
import dayjs from 'dayjs'

type Step = 'LANDING' | 'SETUP' | 'LOADING' | 'INTERVIEW' | 'RESULTS' | 'HISTORY'

export default function IntervoAIPage() {
   const [step, setStep] = useState<Step>('LANDING')
   const [topic, setTopic] = useState('')
   const [region, setRegion] = useState('Dubai, UAE')
   const [sessionId, setSessionId] = useState('')
   const [currentQuestion, setCurrentQuestion] = useState('')
   const [transcript, setTranscript] = useState('')
   const [isRecording, setIsRecording] = useState(false)
   const [progress, setProgress] = useState('0/0')
   const [feedback, setFeedback] = useState<any>(null)
   const [responses, setResponses] = useState<any[]>([])
   const [history, setHistory] = useState<any[]>([])
   const [loading, setLoading] = useState(false)
   const [expandedResponse, setExpandedResponse] = useState<number | null>(null)

   const recognitionRef = useRef<any>(null)

   // Initialize Speech Recognition
   useEffect(() => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
         recognitionRef.current = new SpeechRecognition()
         recognitionRef.current.continuous = true
         recognitionRef.current.interimResults = true

         recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; ++i) {
               if (event.results[i].isFinal) {
                  setTranscript((prev) => prev + event.results[i][0].transcript + ' ')
               } else {
                  interimTranscript += event.results[i][0].transcript
               }
            }
         }

         recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error)
            setIsRecording(false)
         }
      }
   }, [])

   const toggleRecording = () => {
      if (isRecording) {
         recognitionRef.current.stop()
         setIsRecording(false)
      } else {
         setTranscript('')
         recognitionRef.current.start()
         setIsRecording(true)
      }
   }

   const handleStartInterview = async () => {
      setStep('LOADING')
      try {
         const response = await axios.post('http://localhost:5000/api/intervo-ai/session/start', {
            topic,
            region,
         })
         setSessionId(response.data.sessionId)
         setCurrentQuestion(response.data.firstQuestion)
         setProgress(`1/${response.data.totalQuestions}`)
         setStep('INTERVIEW')
         speak(response.data.firstQuestion)
      } catch (error) {
         console.error('Error starting session', error)
         setStep('SETUP')
      }
   }

   const handleSubmitAnswer = async () => {
      if (!transcript.trim()) return
      setLoading(true)
      if (isRecording) toggleRecording()

      try {
         const response = await axios.post('http://localhost:5000/api/intervo-ai/session/answer', {
            sessionId,
            answer: transcript,
         })

         if (response.data.status === 'completed') {
            handleGetFeedback(sessionId)
         } else {
            setCurrentQuestion(response.data.nextQuestion)
            setProgress(response.data.progress)
            setTranscript('')
            speak(response.data.nextQuestion)
         }
      } catch (error) {
         console.error('Error submitting answer', error)
      } finally {
         setLoading(false)
      }
   }

   const handleGetFeedback = async (id: string) => {
      setLoading(true)
      try {
         const response = await axios.get(`http://localhost:5000/api/intervo-ai/session/feedback/${id}`)
         setFeedback(response.data.feedback)
         setResponses(response.data.responses || [])
         setStep('RESULTS')
      } catch (error) {
         console.error('Error getting feedback', error)
      } finally {
         setLoading(false)
      }
   }

   const fetchHistory = async () => {
      setLoading(true)
      setStep('HISTORY')
      try {
         const response = await axios.get('http://localhost:5000/api/intervo-ai/sessions')
         setHistory(response.data)
      } catch (error) {
         console.error('Error fetching history', error)
      } finally {
         setLoading(false)
      }
   }

   const loadSession = async (id: string, status: string) => {
      if (status === 'completed') {
         setSessionId(id)
         handleGetFeedback(id)
      } else {
         alert('Session is still in progress.')
      }
   }

   const speak = (text: string) => {
      if (window.speechSynthesis) {
         window.speechSynthesis.cancel()
         const utterance = new SpeechSynthesisUtterance(text)
         utterance.rate = 0.9
         utterance.pitch = 1
         window.speechSynthesis.speak(utterance)
      }
   }

   if (step === 'LANDING') {
      return (
         <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
            <div className="container mx-auto px-6 py-16 relative z-10">
               <div className="text-center mb-16 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold mb-2">
                     <Sparkles className="h-4 w-4" />
                     <span>The Future of Interviews</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 bg-clip-text text-transparent">
                     IntervoAI
                  </h1>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                     Master your path with AI-driven interview simulations. Real-time voice analysis, intelligent
                     feedback, and professional insights tailored for Gulf markets.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-8">
                     <Button
                        onClick={() => setStep('SETUP')}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-14 rounded-full text-lg font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                     >
                        Start Your Interview
                     </Button>
                     <Button
                        onClick={fetchHistory}
                        variant="outline"
                        size="lg"
                        className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-10 h-14 rounded-full text-lg font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                     >
                        <History className="mr-2 h-5 w-5" /> View History
                     </Button>
                  </div>
               </div>
               <div className="max-w-6xl mx-auto mb-20 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white">
                     <img src="/intervo-ai-preview.png" alt="IntervoAI Preview" className="w-full h-auto" />
                  </div>
               </div>
            </div>
         </div>
      )
   }

   if (step === 'HISTORY') {
      return (
         <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-8">
               <div className="flex items-center justify-between mt-8">
                  <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
                     <History className="h-10 w-10 text-blue-600" />
                     Session History
                  </h2>
                  <Button onClick={() => setStep('LANDING')} variant="ghost" className="font-bold">
                     <XCircle className="mr-2 h-5 w-5" /> Close
                  </Button>
               </div>

               {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                     <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                     <p className="text-slate-500 font-bold">Loading your history...</p>
                  </div>
               ) : history.length === 0 ? (
                  <Card className="p-12 text-center space-y-4">
                     <p className="text-slate-500 text-lg font-medium">You haven't completed any interviews yet.</p>
                     <Button onClick={() => setStep('SETUP')} className="bg-blue-600 font-bold rounded-xl">
                        Start Your First Interview
                     </Button>
                  </Card>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                     {history.map((session) => (
                        <Card
                           key={session._id}
                           className="hover:shadow-2xl transition-all cursor-pointer border-slate-200 overflow-hidden group"
                           onClick={() => loadSession(session._id, session.status)}
                        >
                           <CardHeader className="bg-slate-50 group-hover:bg-blue-50 transition-colors">
                              <CardTitle className="text-xl font-bold flex justify-between items-center">
                                 {session.topic}
                                 {session.score && (
                                    <span className="text-blue-600 font-mono text-sm">{session.score}%</span>
                                 )}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                 <Video className="h-3 w-3 text-blue-600" /> {session.region}
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="p-4 pt-6 space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                                 <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {dayjs(session.createdAt).format('MMM D, YYYY')}
                                 </span>
                                 <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {dayjs(session.createdAt).format('h:mm A')}
                                 </span>
                              </div>
                              <div className="pt-2">
                                 <div
                                    className={`text-xs px-2 py-1 rounded w-fit capitalize font-bold ${session.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                                 >
                                    {session.status}
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </div>
         </div>
      )
   }

   if (step === 'SETUP') {
      return (
         <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full shadow-2xl border-slate-200">
               <CardHeader>
                  <CardTitle className="text-2xl font-bold">Interview Setup</CardTitle>
                  <CardDescription>What role are we preparing for today?</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-600">Interview Topic / Role</label>
                     <Input
                        placeholder="e.g. Senior React Developer"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="h-12 border-slate-200 focus:ring-blue-500 font-medium"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-600">Region Context</label>
                     <Input
                        placeholder="e.g. Dubai, UAE"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="h-12 border-slate-200 font-medium"
                     />
                  </div>
                  <Button
                     onClick={handleStartInterview}
                     disabled={!topic}
                     className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-bold text-lg shadow-lg shadow-blue-200"
                  >
                     Generate Search Questions <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
               </CardContent>
               <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <Button
                     onClick={() => setStep('LANDING')}
                     variant="ghost"
                     className="text-slate-400 text-xs font-bold hover:text-slate-600"
                  >
                     Go Back
                  </Button>
               </div>
            </Card>
         </div>
      )
   }

   if (step === 'LOADING') {
      return (
         <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-6">
            <div className="relative">
               <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
               <Sparkles className="h-6 w-6 text-purple-600 absolute bottom-0 right-0 animate-pulse" />
            </div>
            <div className="text-center">
               <h2 className="text-2xl font-black text-slate-900">AI is searching the web...</h2>
               <p className="text-slate-500 font-medium">
                  Finding top interview questions for {topic} in {region}
               </p>
            </div>
         </div>
      )
   }

   if (step === 'INTERVIEW') {
      return (
         <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-5xl space-y-8">
               <div className="flex items-center justify-between mt-8">
                  <div>
                     <h2 className="text-3xl font-black text-slate-900 capitalize">{topic} Interview</h2>
                     <p className="text-slate-500 font-medium flex items-center gap-2">
                        <Video className="h-4 w-4 text-blue-600" /> Session: {region}
                     </p>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-3">
                     <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                     <span className="font-mono text-sm font-bold">{progress}</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <Card className="lg:col-span-8 bg-white border-slate-200 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
                     <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                           <Volume2 className="h-5 w-5" />
                           AI Question
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-8 flex-1 flex flex-col justify-center">
                        <p className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                           "{currentQuestion}"
                        </p>
                     </CardContent>
                     <div className="p-6 bg-slate-50/30 border-t border-slate-100">
                        <div className="flex items-center gap-4 text-slate-400 font-medium">
                           <Loader2 className={`h-4 w-4 animate-spin ${loading ? 'opacity-100' : 'opacity-0'}`} />
                           <span>{loading ? 'Processing your answer...' : 'Speak your answer clearly'}</span>
                        </div>
                     </div>
                  </Card>

                  <Card className="lg:col-span-4 bg-white border-slate-200 shadow-xl flex flex-col overflow-hidden">
                     <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-purple-600">
                           <Mic className="h-5 w-5" />
                           Real-time Voice
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-6 flex-1 space-y-4">
                        <div className="h-48 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                           <p className="text-slate-600 italic font-medium leading-relaxed">
                              {transcript || (isRecording ? 'Listening...' : 'Your transcript will appear here')}
                           </p>
                        </div>
                        <div className="flex flex-col gap-3">
                           <Button
                              onClick={toggleRecording}
                              className={`h-16 w-full rounded-2xl text-lg font-bold transition-all shadow-lg ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                           >
                              {isRecording ? (
                                 <div className="flex items-center gap-2">Stop Recording</div>
                              ) : (
                                 <div className="flex items-center gap-2">
                                    <Play className="h-5 w-5 fill-current" /> Push to Speak
                                 </div>
                              )}
                           </Button>
                           <Button
                              onClick={handleSubmitAnswer}
                              disabled={!transcript || loading}
                              variant="outline"
                              className="h-12 rounded-xl border-slate-300 hover:bg-slate-100 font-bold"
                           >
                              Submit Answer
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      )
   }

   if (step === 'RESULTS') {
      return (
         <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-5xl space-y-8">
               <div className="text-center space-y-2 mt-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4">
                     <CheckCircle2 className="h-4 w-4" /> Interview Complete
                  </div>
                  <h2 className="text-4xl font-black text-slate-900">Performance Report</h2>
                  <p className="text-slate-500 font-medium capitalize">
                     Topic: {topic} | Market: {region}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white border-slate-200 shadow-lg text-center p-6 flex flex-col justify-center">
                     <h4 className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Overall Score</h4>
                     <p className="text-6xl font-black text-blue-600">{feedback?.score || '85'}%</p>
                  </Card>
                  <Card className="md:col-span-2 bg-white border-slate-200 shadow-lg p-6 space-y-4">
                     <h4 className="text-blue-600 font-bold flex items-center gap-2 font-black uppercase tracking-tighter">
                        <BrainCircuit className="h-5 w-5" /> Key Strengths
                     </h4>
                     <ul className="space-y-2">
                        {(feedback?.strengths || []).map((s: string, i: number) => (
                           <li key={i} className="flex items-start gap-2 text-slate-600 font-medium italic">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" /> {s}
                           </li>
                        ))}
                     </ul>
                  </Card>
               </div>

               {/* New Comparative Analysis Section */}
               <div className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                     <MessageSquare className="h-6 w-6 text-purple-600" />
                     Question-by-Question Analysis
                  </h3>
                  <div className="space-y-4">
                     {responses.map((resp: any, idx: number) => (
                        <Card key={idx} className="border-slate-200 shadow-md overflow-hidden bg-white">
                           <div
                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => setExpandedResponse(expandedResponse === idx ? null : idx)}
                           >
                              <div className="flex items-center gap-4">
                                 <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">
                                    {idx + 1}
                                 </div>
                                 <h4 className="font-bold text-slate-700 truncate max-w-xl">{resp.question}</h4>
                              </div>
                              {expandedResponse === idx ? (
                                 <ChevronUp className="h-5 w-5 text-slate-400" />
                              ) : (
                                 <ChevronDown className="h-5 w-5 text-slate-400" />
                              )}
                           </div>

                           {expandedResponse === idx && (
                              <CardContent className="p-6 pt-0 space-y-6 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                    <div className="space-y-3">
                                       <h5 className="text-sm font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                          <Mic className="h-4 w-4" /> Your Answer
                                       </h5>
                                       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 italic font-medium text-sm min-h-[100px]">
                                          {resp.userAnswer || 'No answer recorded.'}
                                       </div>
                                    </div>
                                    <div className="space-y-3">
                                       <h5 className="text-sm font-black uppercase text-emerald-600 tracking-wider flex items-center gap-2">
                                          <Sparkles className="h-4 w-4" /> Suggested Best Answer
                                       </h5>
                                       <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 font-bold text-sm min-h-[100px]">
                                          {resp.suggestedAnswer || 'Thinking...'}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                    <h5 className="text-xs font-black uppercase text-purple-600 mb-2">
                                       Analysis & Improvement
                                    </h5>
                                    <p className="text-purple-900 text-sm font-medium">
                                       {resp.analysis || 'Generating insights...'}
                                    </p>
                                 </div>
                              </CardContent>
                           )}
                        </Card>
                     ))}
                  </div>
               </div>

               <Card className="bg-white border-slate-200 shadow-xl p-8 space-y-6">
                  <div className="space-y-4">
                     <h4 className="text-purple-600 font-black flex items-center gap-2 uppercase tracking-tighter">
                        <Settings className="h-5 w-5" /> Areas for Improvement
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(feedback?.improvements || []).map((a: string, i: number) => (
                           <div
                              key={i}
                              className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm font-bold shadow-sm"
                           >
                              {a}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 space-y-3 shadow-inner">
                     <h4 className="text-blue-700 font-black flex items-center gap-2 uppercase tracking-tighter">
                        <Sparkles className="h-5 w-5" /> Market-Specific Tips ({region})
                     </h4>
                     <ul className="space-y-2">
                        {(feedback?.marketTips || []).map((t: string, i: number) => (
                           <li key={i} className="text-blue-800 text-sm font-bold flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span> {t}
                           </li>
                        ))}
                     </ul>
                  </div>
               </Card>

               <div className="flex justify-center gap-4 pt-8 pb-16">
                  <Button
                     onClick={() => setStep('LANDING')}
                     size="lg"
                     variant="outline"
                     className="rounded-full px-12 h-14 font-black border-slate-300 hover:bg-slate-100"
                  >
                     Back to Home
                  </Button>
                  <Button
                     onClick={fetchHistory}
                     size="lg"
                     className="bg-blue-600 rounded-full px-12 h-14 font-black shadow-lg shadow-blue-200"
                  >
                     View All Sessions
                  </Button>
               </div>
            </div>
         </div>
      )
   }

   return null
}
