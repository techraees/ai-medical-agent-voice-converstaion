export const PROJECT_NAME = 'cyber-security-rag-system'

export const getCollectionName = (collectionName: string): string => {
   return `${PROJECT_NAME}-${collectionName}`
}
