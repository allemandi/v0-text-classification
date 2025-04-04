import { TextClassifier } from "@/components/text-classifier"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Text Classification with Naive Bayes</h1>
      <TextClassifier />
    </main>
  )
}

