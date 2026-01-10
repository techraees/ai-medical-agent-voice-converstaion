import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const documentsPath = __dirname
export const nationalCyberSecurityPolicyPath = path.join(__dirname, 'National_Cyber_Security_Policy_2021_Final.pdf')
