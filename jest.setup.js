// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ai_ad_maker_test'
process.env.REDIS_URL = 'redis://localhost:6379'
process.env.OPENAI_API_KEY = 'test-key'
process.env.GOOGLE_AI_API_KEY = 'test-key'
process.env.ELEVENLABS_API_KEY = 'test-key'
process.env.NOTION_API_KEY = 'test-key'
process.env.SLACK_BOT_TOKEN = 'test-token'
process.env.SLACK_SIGNING_SECRET = 'test-secret'
