export const PROJECT_NAME = process.env.MEDICAL_CONSULTANT_AGENT_PROJECT_NAME || 'medical-consultant-agent'

export const getCollectionName = (collectionName: string): string => {
   return `${PROJECT_NAME}-${collectionName}`
}
