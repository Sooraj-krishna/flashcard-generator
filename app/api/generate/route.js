import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const systemPrompt = `
You are a flashcard creator. Create exactly 10 flashcards from the given text.
Both front and back should be one sentence long.
Return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req) {
  const data = await req.text()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContent([
      systemPrompt,
      `Text: ${data}`
    ])
    const response = await result.response
    const text = response.text()

    const flashcards = JSON.parse(text)
    return NextResponse.json(flashcards.flashcards)
  } catch (error) {
    console.error('Error generating flashcards:', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}