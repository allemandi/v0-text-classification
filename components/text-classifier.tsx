"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { trainModel, predictCategory } from "@/lib/classifier-actions"

type TrainingItem = {
  id: string
  text: string
  category: string
}

export function TextClassifier() {
  const [trainingData, setTrainingData] = useState<TrainingItem[]>([])
  const [newText, setNewText] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [predictText, setPredictText] = useState("")
  const [prediction, setPrediction] = useState<{ category: string; probability: number } | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addTrainingItem = () => {
    if (newText.trim() && newCategory.trim()) {
      setTrainingData([
        ...trainingData,
        {
          id: Date.now().toString(),
          text: newText.trim(),
          category: newCategory.trim(),
        },
      ])
      setNewText("")
      setNewCategory("")
    }
  }

  const removeTrainingItem = (id: string) => {
    setTrainingData(trainingData.filter((item) => item.id !== id))
  }

  const handleTrain = async () => {
    if (trainingData.length === 0) return

    setIsTraining(true)
    setError(null)

    try {
      // Create a simple array of objects with just text and category
      const simplifiedData = []

      for (let i = 0; i < trainingData.length; i++) {
        simplifiedData.push({
          text: trainingData[i].text,
          category: trainingData[i].category,
        })
      }

      await trainModel(simplifiedData)
      setPrediction(null)
    } catch (error) {
      console.error("Training error:", error)
      setError(error instanceof Error ? error.message : "Unknown training error")
    } finally {
      setIsTraining(false)
    }
  }

  const handlePredict = async () => {
    if (!predictText.trim()) return

    setIsPredicting(true)
    setError(null)

    try {
      const result = await predictCategory(predictText)
      setPrediction(result)
    } catch (error) {
      console.error("Prediction error:", error)
      setError(error instanceof Error ? error.message : "Unknown prediction error")
    } finally {
      setIsPredicting(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {error && (
        <div className="md:col-span-2 p-4 border border-red-300 bg-red-50 rounded-md text-red-800">Error: {error}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Training Data</CardTitle>
          <CardDescription>Add examples with text and categories to train the classifier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
              <Input placeholder="Enter text example" value={newText} onChange={(e) => setNewText(e.target.value)} />
              <Input placeholder="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </div>
            <Button onClick={addTrainingItem}>Add Example</Button>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Text</TableHead>
                    <TableHead className="w-[30%]">Category</TableHead>
                    <TableHead className="w-[10%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                        No training data added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    trainingData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.text}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeTrainingItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Button onClick={handleTrain} disabled={trainingData.length === 0 || isTraining} className="mt-2">
              {isTraining ? "Training..." : "Train Model"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prediction</CardTitle>
          <CardDescription>Enter text to predict its category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Textarea
              placeholder="Enter text to classify"
              value={predictText}
              onChange={(e) => setPredictText(e.target.value)}
              className="min-h-[150px]"
            />
            <Button onClick={handlePredict} disabled={!predictText.trim() || isPredicting || trainingData.length === 0}>
              {isPredicting ? "Predicting..." : "Predict Category"}
            </Button>

            {prediction && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Prediction Result:</h3>
                <p>
                  Category: <span className="font-bold">{prediction.category}</span>
                </p>
                <p>Confidence: {(prediction.probability * 100).toFixed(2)}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

