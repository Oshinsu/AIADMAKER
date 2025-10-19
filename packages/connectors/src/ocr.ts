import axios from 'axios'
import { logger } from '../lib/logger'

export class OCRService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY || ''
    this.baseUrl = 'https://vision.googleapis.com/v1'
  }

  async analyzeImage(imageUrl: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/images:annotate?key=${this.apiKey}`,
        {
          requests: [
            {
              image: {
                source: {
                  imageUri: imageUrl,
                },
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 50,
                },
                {
                  type: 'DOCUMENT_TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }
      )

      const annotations = response.data.responses[0]
      const textAnnotations = annotations.textAnnotations || []
      const documentText = annotations.fullTextAnnotation

      // Analyser la lisibilité
      const readability = this.analyzeReadability(textAnnotations)
      
      // Calculer la densité de texte
      const textDensity = this.calculateTextDensity(textAnnotations, annotations.imageSize)

      return {
        text: documentText?.text || '',
        textRegions: textAnnotations.slice(1), // Exclure le texte global
        imageSize: {
          width: annotations.imageSize?.width || 0,
          height: annotations.imageSize?.height || 0,
        },
        readability,
        textDensity,
        confidence: this.calculateConfidence(textAnnotations),
      }
    } catch (error) {
      logger.error('OCR analysis failed:', error)
      throw new Error(`Échec de l'analyse OCR: ${error.message}`)
    }
  }

  private analyzeReadability(textAnnotations: any[]) {
    if (textAnnotations.length === 0) {
      return {
        score: 0,
        issues: ['Aucun texte détecté'],
        fontSize: 0,
        contrast: 0,
      }
    }

    const issues: string[] = []
    let totalFontSize = 0
    let totalContrast = 0
    let validTexts = 0

    for (const annotation of textAnnotations.slice(1)) {
      const text = annotation.description
      const fontSize = this.estimateFontSize(annotation.boundingPoly)
      const contrast = this.estimateContrast(annotation.boundingPoly)

      totalFontSize += fontSize
      totalContrast += contrast
      validTexts++

      // Vérifier la lisibilité
      if (fontSize < 12) {
        issues.push(`Texte trop petit: "${text}" (${fontSize}px)`)
      }
      if (contrast < 4.5) {
        issues.push(`Contraste insuffisant: "${text}" (ratio: ${contrast})`)
      }
      if (text.length > 50) {
        issues.push(`Texte trop long: "${text}"`)
      }
    }

    const averageFontSize = validTexts > 0 ? totalFontSize / validTexts : 0
    const averageContrast = validTexts > 0 ? totalContrast / validTexts : 0

    // Calculer le score de lisibilité
    let score = 100
    score -= issues.length * 10
    score -= averageFontSize < 12 ? 20 : 0
    score -= averageContrast < 4.5 ? 30 : 0

    return {
      score: Math.max(0, score),
      issues,
      fontSize: averageFontSize,
      contrast: averageContrast,
    }
  }

  private calculateTextDensity(textAnnotations: any[], imageSize: any) {
    if (!imageSize || textAnnotations.length === 0) {
      return 0
    }

    const imageArea = imageSize.width * imageSize.height
    let totalTextArea = 0

    for (const annotation of textAnnotations.slice(1)) {
      const boundingPoly = annotation.boundingPoly
      if (boundingPoly && boundingPoly.vertices) {
        const textArea = this.calculateBoundingBoxArea(boundingPoly.vertices)
        totalTextArea += textArea
      }
    }

    return (totalTextArea / imageArea) * 100
  }

  private calculateBoundingBoxArea(vertices: any[]) {
    if (vertices.length < 4) return 0

    const xCoords = vertices.map(v => v.x)
    const yCoords = vertices.map(v => v.y)
    
    const width = Math.max(...xCoords) - Math.min(...xCoords)
    const height = Math.max(...yCoords) - Math.min(...yCoords)
    
    return width * height
  }

  private estimateFontSize(boundingPoly: any) {
    if (!boundingPoly || !boundingPoly.vertices) return 0

    const vertices = boundingPoly.vertices
    const height = Math.max(...vertices.map((v: any) => v.y)) - Math.min(...vertices.map((v: any) => v.y))
    
    // Estimation basée sur la hauteur du bounding box
    return Math.round(height * 0.8)
  }

  private estimateContrast(boundingPoly: any) {
    // Simulation du contraste basé sur la position
    // En production, ceci nécessiterait une analyse d'image plus poussée
    return 5.0 + Math.random() * 2.0
  }

  private calculateConfidence(textAnnotations: any[]) {
    if (textAnnotations.length === 0) return 0

    const confidences = textAnnotations
      .slice(1)
      .map(annotation => annotation.confidence || 0.8)
      .filter(conf => conf > 0)

    return confidences.length > 0 
      ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
      : 0.8
  }
}
