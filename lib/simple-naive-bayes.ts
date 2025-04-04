"use server"

// A simple Naive Bayes classifier implementation
export class SimpleNaiveBayes {
  private categories: Set<string> = new Set()
  private wordCounts: Record<string, Record<string, number>> = {}
  private categoryCounts: Record<string, number> = {}
  private totalDocuments = 0
  private vocabulary: Set<string> = new Set()

  // Reset the classifier
  public reset(): void {
    this.categories = new Set()
    this.wordCounts = {}
    this.categoryCounts = {}
    this.totalDocuments = 0
    this.vocabulary = new Set()
  }

  // Tokenize text into words
  private tokenize(text: string): string[] {
    // Simple tokenization: lowercase, remove punctuation, split by whitespace
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 0)
  }

  // Learn from a document
  public learn(text: string, category: string): void {
    if (!text || typeof text !== "string" || !category || typeof category !== "string") {
      console.error("Invalid input to learn:", { text, category })
      return
    }

    // Add category to set of known categories
    this.categories.add(category)

    // Increment document count for this category
    this.categoryCounts[category] = (this.categoryCounts[category] || 0) + 1

    // Increment total document count
    this.totalDocuments++

    // Tokenize the text
    const words = this.tokenize(text)

    // Update word counts for this category
    for (const word of words) {
      // Add word to vocabulary
      this.vocabulary.add(word)

      // Initialize category in wordCounts if needed
      if (!this.wordCounts[category]) {
        this.wordCounts[category] = {}
      }

      // Increment word count for this category
      this.wordCounts[category][word] = (this.wordCounts[category][word] || 0) + 1
    }
  }

  // Predict the category of a document
  public predict(text: string): { category: string; probability: number } | null {
    if (!text || typeof text !== "string") {
      console.error("Invalid input to predict:", { text })
      return null
    }

    // If no documents have been learned, return null
    if (this.totalDocuments === 0) {
      return null
    }

    // Tokenize the text
    const words = this.tokenize(text)

    // Calculate score for each category
    const scores: Record<string, number> = {}
    let maxScore = Number.NEGATIVE_INFINITY
    let bestCategory = ""

    // For each category
    for (const category of this.categories) {
      // Start with log of prior probability: P(category)
      const categoryDocuments = this.categoryCounts[category] || 0
      const priorProbability = categoryDocuments / this.totalDocuments
      scores[category] = Math.log(priorProbability)

      // For each word in the document
      for (const word of words) {
        // Skip words not in vocabulary
        if (!this.vocabulary.has(word)) continue

        // Get word count in this category
        const wordCount = this.wordCounts[category]?.[word] || 0

        // Calculate conditional probability with Laplace smoothing
        // P(word|category) = (wordCount + 1) / (totalWordsInCategory + vocabularySize)
        const totalWordsInCategory = Object.values(this.wordCounts[category] || {}).reduce(
          (sum, count) => sum + count,
          0,
        )
        const conditionalProbability = (wordCount + 1) / (totalWordsInCategory + this.vocabulary.size)

        // Add log of conditional probability to score
        scores[category] += Math.log(conditionalProbability)
      }

      // Update best category if this one has a higher score
      if (scores[category] > maxScore) {
        maxScore = scores[category]
        bestCategory = category
      }
    }

    // If no best category was found, return null
    if (!bestCategory) {
      return null
    }

    // Convert log probabilities to regular probabilities and normalize
    const logScores = Object.values(scores)
    const maxLogScore = Math.max(...logScores)
    const expScores = Object.entries(scores).map(([category, score]) => ({
      category,
      expScore: Math.exp(score - maxLogScore), // Subtract max to avoid overflow
    }))
    const sumExpScores = expScores.reduce((sum, { expScore }) => sum + expScore, 0)
    const normalizedScores = expScores.map(({ category, expScore }) => ({
      category,
      probability: expScore / sumExpScores,
    }))

    // Find the category with the highest probability
    const bestPrediction = normalizedScores.reduce(
      (best, current) => (current.probability > best.probability ? current : best),
      { category: "", probability: 0 },
    )

    return bestPrediction
  }
}

