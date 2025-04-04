"use server"

import { SimpleNaiveBayes } from "./simple-naive-bayes"

// Create a singleton instance of our custom classifier
let classifier: SimpleNaiveBayes | null = null

function getClassifier() {
  if (!classifier) {
    classifier = new SimpleNaiveBayes()
  }
  return classifier
}

// Define the structure of a training item
type TrainingItem = {
  text: string
  category: string
}

export async function trainModel(trainingData: any) {
  try {
    console.log("Training data received:", JSON.stringify(trainingData))

    // Get the classifier
    const classifier = getClassifier()

    // Reset the classifier
    classifier.reset()

    // Extract training items from whatever format we received
    const items: TrainingItem[] = []

    // If it's an array
    if (Array.isArray(trainingData)) {
      for (let i = 0; i < trainingData.length; i++) {
        const item = trainingData[i]
        if (item && typeof item.text === "string" && typeof item.category === "string") {
          items.push({
            text: item.text,
            category: item.category,
          })
        }
      }
    }
    // If it's an object (possibly from JSON serialization of an array)
    else if (trainingData && typeof trainingData === "object") {
      for (const key in trainingData) {
        if (Object.prototype.hasOwnProperty.call(trainingData, key)) {
          const item = trainingData[key]
          if (item && typeof item.text === "string" && typeof item.category === "string") {
            items.push({
              text: item.text,
              category: item.category,
            })
          }
        }
      }
    } else {
      throw new Error("Training data is not in a valid format")
    }

    console.log(`Processed ${items.length} training items`)

    // Train the classifier with each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      try {
        classifier.learn(item.text, item.category)
      } catch (error) {
        console.error(`Error learning item ${i}:`, error)
        // Continue with the next item instead of failing completely
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Training error:", error)
    throw new Error(`Training failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function predictCategory(text: string) {
  try {
    // Validate input
    if (typeof text !== "string") {
      throw new Error("Text must be a string")
    }

    // Get the classifier
    const classifier = getClassifier()

    // Get the prediction
    const result = classifier.predict(text)

    if (!result) {
      return {
        category: "Unknown",
        probability: 0,
      }
    }

    return {
      category: result.category,
      probability: result.probability,
    }
  } catch (error) {
    console.error("Prediction error:", error)
    return {
      category: "Error in prediction",
      probability: 0,
    }
  }
}

