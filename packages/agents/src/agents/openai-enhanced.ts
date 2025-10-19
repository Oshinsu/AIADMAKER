import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

// Configuration OpenAI avec les dernières fonctionnalités d'octobre 2025
export class OpenAIEnhanced {
  private client: OpenAI
  private defaultModel: string = 'gpt-4o-2025-10-01' // Dernière version GPT-4o
  private visionModel: string = 'gpt-4o-vision-2025-10-01' // Vision améliorée
  private audioModel: string = 'gpt-4o-audio-2025-10-01' // Audio natif
  private embeddingModel: string = 'text-embedding-3-large' // Embeddings optimisés

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
      project: process.env.OPENAI_PROJECT_ID,
      // Nouvelles options de configuration OpenAI v4.60
      timeout: 30000, // 30 secondes
      maxRetries: 3,
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2', // Support des assistants v2
        'OpenAI-Organization': process.env.OPENAI_ORG_ID,
      },
    })
  }

  // Chat avec support des nouvelles fonctionnalités
  async chat(messages: ChatCompletionMessageParam[], options?: {
    model?: string
    temperature?: number
    maxTokens?: number
    tools?: any[]
    toolChoice?: 'auto' | 'required' | 'none'
    responseFormat?: 'text' | 'json_object'
    seed?: number
    topP?: number
    frequencyPenalty?: number
    presencePenalty?: number
    stop?: string | string[]
  }) {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || this.defaultModel,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 4000,
        tools: options?.tools,
        tool_choice: options?.toolChoice || 'auto',
        response_format: options?.responseFormat ? { type: options.responseFormat } : undefined,
        seed: options?.seed,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
        stop: options?.stop,
        // Nouvelles fonctionnalités d'octobre 2025
        stream: false,
        stream_options: {
          include_usage: true,
        },
      })

      return {
        content: response.choices[0].message.content,
        toolCalls: response.choices[0].message.tool_calls,
        usage: response.usage,
        finishReason: response.choices[0].finish_reason,
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw new Error(`OpenAI API Error: ${error.message}`)
    }
  }

  // Vision avec support des nouvelles fonctionnalités
  async vision(messages: ChatCompletionMessageParam[], imageUrl: string, options?: {
    detail?: 'low' | 'high' | 'auto'
    maxTokens?: number
    temperature?: number
  }) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.visionModel,
        messages: [
          ...messages,
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analysez cette image' },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: options?.detail || 'auto',
                },
              },
            ],
          },
        ],
        max_tokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.3,
      })

      return {
        content: response.choices[0].message.content,
        usage: response.usage,
        finishReason: response.choices[0].finish_reason,
      }
    } catch (error) {
      console.error('OpenAI Vision Error:', error)
      throw new Error(`OpenAI Vision Error: ${error.message}`)
    }
  }

  // Audio avec support des nouvelles fonctionnalités
  async audio(audioFile: Buffer, options?: {
    model?: string
    language?: string
    prompt?: string
    responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
    temperature?: number
    timestampGranularities?: ('word' | 'segment')[]
  }) {
    try {
      const response = await this.client.audio.transcriptions.create({
        file: new File([audioFile], 'audio.mp3', { type: 'audio/mpeg' }),
        model: options?.model || 'whisper-1',
        language: options?.language,
        prompt: options?.prompt,
        response_format: options?.responseFormat || 'json',
        temperature: options?.temperature,
        timestamp_granularities: options?.timestampGranularities,
      })

      return response
    } catch (error) {
      console.error('OpenAI Audio Error:', error)
      throw new Error(`OpenAI Audio Error: ${error.message}`)
    }
  }

  // TTS avec support des nouvelles fonctionnalités
  async tts(text: string, options?: {
    model?: string
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
    responseFormat?: 'mp3' | 'opus' | 'aac' | 'flac'
    speed?: number
  }) {
    try {
      const response = await this.client.audio.speech.create({
        model: options?.model || 'tts-1',
        voice: options?.voice || 'alloy',
        input: text,
        response_format: options?.responseFormat || 'mp3',
        speed: options?.speed || 1.0,
      })

      return response
    } catch (error) {
      console.error('OpenAI TTS Error:', error)
      throw new Error(`OpenAI TTS Error: ${error.message}`)
    }
  }

  // Embeddings avec support des nouvelles fonctionnalités
  async embeddings(input: string | string[], options?: {
    model?: string
    encodingFormat?: 'float' | 'base64'
    dimensions?: number
  }) {
    try {
      const response = await this.client.embeddings.create({
        model: options?.model || 'text-embedding-3-large',
        input,
        encoding_format: options?.encodingFormat || 'float',
        dimensions: options?.dimensions,
      })

      return {
        embeddings: response.data.map(item => item.embedding),
        usage: response.usage,
      }
    } catch (error) {
      console.error('OpenAI Embeddings Error:', error)
      throw new Error(`OpenAI Embeddings Error: ${error.message}`)
    }
  }

  // DALL-E 3 avec support des nouvelles fonctionnalités
  async generateImage(prompt: string, options?: {
    model?: string
    size?: '1024x1024' | '1024x1792' | '1792x1024'
    quality?: 'standard' | 'hd'
    style?: 'vivid' | 'natural'
    n?: number
    responseFormat?: 'url' | 'b64_json'
    user?: string
  }) {
    try {
      const response = await this.client.images.generate({
        model: options?.model || 'dall-e-3',
        prompt,
        size: options?.size || '1024x1024',
        quality: options?.quality || 'standard',
        style: options?.style || 'vivid',
        n: options?.n || 1,
        response_format: options?.responseFormat || 'url',
        user: options?.user,
      })

      return {
        images: response.data.map(item => ({
          url: item.url,
          revisedPrompt: item.revised_prompt,
        })),
        usage: response.usage,
      }
    } catch (error) {
      console.error('OpenAI DALL-E Error:', error)
      throw new Error(`OpenAI DALL-E Error: ${error.message}`)
    }
  }

  // Assistants v2 avec support des nouvelles fonctionnalités
  async createAssistant(options: {
    name: string
    instructions: string
    model?: string
    tools?: any[]
    toolResources?: any
    metadata?: Record<string, string>
    temperature?: number
    topP?: number
    responseFormat?: 'text' | 'json_object'
  }) {
    try {
      const assistant = await this.client.beta.assistants.create({
        name: options.name,
        instructions: options.instructions,
        model: options.model || this.defaultModel,
        tools: options.tools || [],
        tool_resources: options.toolResources,
        metadata: options.metadata,
        temperature: options.temperature,
        top_p: options.topP,
        response_format: options.responseFormat ? { type: options.responseFormat } : undefined,
      })

      return assistant
    } catch (error) {
      console.error('OpenAI Assistant Error:', error)
      throw new Error(`OpenAI Assistant Error: ${error.message}`)
    }
  }

  // Threads avec support des nouvelles fonctionnalités
  async createThread(options?: {
    messages?: ChatCompletionMessageParam[]
    metadata?: Record<string, string>
    toolResources?: any
  }) {
    try {
      const thread = await this.client.beta.threads.create({
        messages: options?.messages,
        metadata: options?.metadata,
        tool_resources: options?.toolResources,
      })

      return thread
    } catch (error) {
      console.error('OpenAI Thread Error:', error)
      throw new Error(`OpenAI Thread Error: ${error.message}`)
    }
  }

  // Runs avec support des nouvelles fonctionnalités
  async createRun(threadId: string, assistantId: string, options?: {
    instructions?: string
    additionalInstructions?: string
    additionalMessages?: ChatCompletionMessageParam[]
    tools?: any[]
    toolResources?: any
    metadata?: Record<string, string>
    temperature?: number
    topP?: number
    maxPromptTokens?: number
    maxCompletionTokens?: number
    truncationStrategy?: any
    responseFormat?: 'text' | 'json_object'
    stream?: boolean
  }) {
    try {
      const run = await this.client.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: options?.instructions,
        additional_instructions: options?.additionalInstructions,
        additional_messages: options?.additionalMessages,
        tools: options?.tools,
        tool_resources: options?.toolResources,
        metadata: options?.metadata,
        temperature: options?.temperature,
        top_p: options?.topP,
        max_prompt_tokens: options?.maxPromptTokens,
        max_completion_tokens: options?.maxCompletionTokens,
        truncation_strategy: options?.truncationStrategy,
        response_format: options?.responseFormat ? { type: options.responseFormat } : undefined,
        stream: options?.stream,
      })

      return run
    } catch (error) {
      console.error('OpenAI Run Error:', error)
      throw new Error(`OpenAI Run Error: ${error.message}`)
    }
  }

  // Moderation avec support des nouvelles fonctionnalités
  async moderate(input: string | string[], options?: {
    model?: string
  }) {
    try {
      const response = await this.client.moderations.create({
        input,
        model: options?.model || 'text-moderation-latest',
      })

      return {
        results: response.results.map(result => ({
          flagged: result.flagged,
          categories: result.categories,
          categoryScores: result.category_scores,
        })),
      }
    } catch (error) {
      console.error('OpenAI Moderation Error:', error)
      throw new Error(`OpenAI Moderation Error: ${error.message}`)
    }
  }

  // Fonction pour obtenir les modèles disponibles
  async getModels() {
    try {
      const models = await this.client.models.list()
      return models.data
    } catch (error) {
      console.error('OpenAI Models Error:', error)
      throw new Error(`OpenAI Models Error: ${error.message}`)
    }
  }

  // Fonction pour obtenir les informations d'usage
  async getUsage(startDate: string, endDate: string) {
    try {
      const usage = await this.client.usage.get(startDate, endDate)
      return usage
    } catch (error) {
      console.error('OpenAI Usage Error:', error)
      throw new Error(`OpenAI Usage Error: ${error.message}`)
    }
  }
}
