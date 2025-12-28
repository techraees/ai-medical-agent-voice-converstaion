export const PROJECT_NAME = process.env.PERSONAL_PORTFOLIO_PROJECT_NAME || 'personal-portfolio'

export const getCollectionName = (collectionName: string): string => {
   return `${PROJECT_NAME}-${collectionName}`
}
