import OpenAI from 'openai'
import { IntervoSession } from '../models/intervo-session.model'
import type { IIntervoSession } from '../models/intervo-session.model'
import { IntervoQuestionSet } from '../models/intervo-question-set.model'

export class IntervoAIService {
   private openai: OpenAI

   constructor() {
      this.openai = new OpenAI({
         apiKey: process.env.OPENAI_API_KEY,
      })
   }

   async getHealth() {
      return {
         status: 'ok',
         module: 'intervo-ai',
         timestamp: new Date().toISOString(),
      }
   }

   async startSession(topic: string, region: string, userId?: string, questionCount: number = 5) {
      // 1. Check if we have cached questions for this topic and region
      // We also check if the cached question set has at least the requested number of questions
      let questionSet = await IntervoQuestionSet.findOne({
         topic: topic.toLowerCase().trim(),
         region: region.toLowerCase().trim(),
      })

      let questions: string[] = []

      if (questionSet && questionSet.questions.length >= questionCount) {
         // If we have more than needed, just take the first N
         questions = questionSet.questions.slice(0, questionCount)
      } else {
         // 2. Generate via OpenAI if not cached or not enough questions
         const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
               {
                  role: 'system',
                  content: `You are an expert recruitment consultant specializing in the ${region} job market. 
                     Your task is to simulate a web search and identify the top ${questionCount} most common and challenging interview questions for a ${topic} position in this region. 
                     YOU MUST RETURN ONLY A JSON OBJECT with a "questions" key containing an array of strings. 
                     Example: {"questions": ["question 1", "question 2", ...]}
                     Do not include any other text.`,
               },
               {
                  role: 'user',
                  content: `Fetch the top ${questionCount} interview questions for a ${topic} position in ${region}.`,
               },
            ],
            response_format: { type: 'json_object' },
         })

         const content = response.choices[0]?.message?.content
         if (!content) {
            throw new Error('Failed to fetch questions from AI')
         }
         const parsed = JSON.parse(content)
         questions = parsed.questions || []

         // 3. Cache the newly generated questions
         if (questions.length > 0) {
            await IntervoQuestionSet.create({
               topic: topic.toLowerCase().trim(),
               region: region.toLowerCase().trim(),
               questions,
            })
         }
      }

      const session = new IntervoSession({
         userId,
         topic,
         region,
         questions,
         status: 'initialized',
         responses: [],
      })

      await session.save()

      return {
         sessionId: session._id,
         firstQuestion: questions[0],
         totalQuestions: questions.length,
      }
   }

   async submitAnswer(sessionId: string, answer: string) {
      const session = await IntervoSession.findById(sessionId)
      if (!session) throw new Error('Session not found')

      const currentQuestion = session.questions[session.responses.length] || 'Tell me about yourself'

      session.responses.push({
         question: currentQuestion,
         userAnswer: answer,
      })

      if (session.responses.length >= session.questions.length) {
         session.status = 'completed'
      } else {
         session.status = 'in_progress'
      }

      await session.save()

      if (session.status === 'completed') {
         return {
            status: 'completed',
            message: 'Interview finished. Generating feedback...',
         }
      }

      const nextQuestion = session.questions[session.responses.length]
      return {
         status: 'in_progress',
         nextQuestion,
         progress: `${session.responses.length + 1}/${session.questions.length}`,
      }
   }

   async getFeedback(sessionId: string) {
      const session = await IntervoSession.findById(sessionId)
      if (!session) throw new Error('Session not found')

      // If already has feedback, return it
      if (session.overallFeedback && session.overallFeedback.strengths.length > 0) {
         return {
            topic: session.topic,
            region: session.region,
            score: session.score,
            feedback: session.overallFeedback,
            responses: session.responses,
         }
      }

      const response = await this.openai.chat.completions.create({
         model: 'gpt-4o',
         messages: [
            {
               role: 'system',
               content: `You are an expert career coach. Analyze the following interview transcript for a ${session.topic} role in ${session.region}. 
                     For each question, provide:
                     1. A "suggestedAnswer" (The ideal professional answer).
                     2. A brief "analysis" of the user's answer.
                     
                     Also provide an overall report:
                     1. Overall Score (0-100)
                     2. list of Strengths
                     3. list of Areas for Improvement
                     4. list of Specific tips for the ${session.region} market.
                     
                     YOU MUST RETURN ONLY A JSON OBJECT in this exact format:
                     {
                       "score": <number>,
                       "responses": [
                         { "suggestedAnswer": "...", "analysis": "..." },
                         ...
                       ],
                       "overall": {
                         "strengths": ["...", "..."],
                         "improvements": ["...", "..."],
                         "marketTips": ["...", "..."]
                       }
                     }`,
            },
            {
               role: 'user',
               content: JSON.stringify(session.responses.map((r) => ({ q: r.question, a: r.userAnswer }))),
            },
         ],
         response_format: { type: 'json_object' },
      })

      const feedbackContent = response.choices[0]?.message?.content
      if (!feedbackContent) {
         throw new Error('Failed to generate feedback')
      }

      const feedback = JSON.parse(feedbackContent)

      // Update session with feedback
      session.score = feedback.score
      session.overallFeedback = {
         strengths: feedback.overall.strengths,
         improvements: feedback.overall.improvements,
         marketTips: feedback.overall.marketTips,
      }

      // Mapping suggested answers back to responses
      feedback.responses.forEach((res: any, index: number) => {
         if (session.responses[index]) {
            session.responses[index].suggestedAnswer = res.suggestedAnswer
            session.responses[index].analysis = res.analysis
         }
      })

      await session.save()

      return {
         topic: session.topic,
         region: session.region,
         score: session.score,
         feedback: session.overallFeedback,
         responses: session.responses,
      }
   }

   async getHistory(userId?: string) {
      const query = userId ? { userId } : {}
      return await IntervoSession.find(query).sort({ createdAt: -1 })
   }

   async getSessionDetails(sessionId: string) {
      return await IntervoSession.findById(sessionId)
   }

   async generateSpeech(text: string) {
      const mp3 = await this.openai.audio.speech.create({
         model: 'tts-1',
         voice: 'shimmer', // Professional and clear voice
         input: text,
      })

      const buffer = Buffer.from(await mp3.arrayBuffer())
      return buffer
   }
}
