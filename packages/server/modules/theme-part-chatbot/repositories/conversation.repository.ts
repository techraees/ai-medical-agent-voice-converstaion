// Implementaion Details
const conversations = new Map<string, string>()

export const conversationRepository = {
   getLastResponseId(conversationId: string): string | null {
      return conversations.get(conversationId) || null
   },
   setLastResponseId(conversationId: string, responseId: string): void {
      conversations.set(conversationId, responseId)
   },
}
