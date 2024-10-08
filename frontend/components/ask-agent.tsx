// ... existing imports ...
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'

export const AskAgent = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')

    try {
      const response = await fetch('https://api.brianknows.org/api/v0/agent/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-brian-api-key': process.env.NEXT_PUBLIC_BRIAN_API_KEY || '',
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok) throw new Error('Failed to fetch response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.result.answer }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow mb-4">
        {messages.map((message, index) => (
          <Card key={index} className={`mb-4 ${message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
            <CardContent className="p-4">
              <p className="font-semibold">{message.role === 'user' ? 'You' : 'Brian'}</p>
              <p>{message.content}</p>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Brian a question..."
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Ask'}
        </Button>
      </form>
    </div>
  )
}