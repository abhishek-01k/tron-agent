import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContractGenerator() {
  const [contractType, setContractType] = useState("Smart Contract")
  const [promptText, setPromptText] = useState("")
  const [generatedContract, setGeneratedContract] = useState("")

  const handleGenerateContract = () => {
    // This is where you would implement the contract generation logic
    // For now, we'll just set a placeholder message
    setGeneratedContract("Your contract will be generated here.")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Unleashing the Power of Web3</h1>
        <p className="text-gray-400">
          We provide Mastering the Art of generating and deploying<br />
          Smart contract using simple prompts with AI.
        </p>
      </header>

      <main className="flex-grow flex space-x-8">
        <div className="w-1/2 space-y-4">
          <div>
            <label htmlFor="contract-type" className="block text-sm font-medium mb-2">
              Choose Contract Type
            </label>
            <Select value={contractType} onValueChange={setContractType}>
              <SelectTrigger id="contract-type" className="w-full bg-gray-800">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800">
                <SelectItem value="Smart Contract">Smart Contract</SelectItem>
                <SelectItem value="NFT Contract">NFT Contract</SelectItem>
                <SelectItem value="Token Contract">Token Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="prompt-text" className="block text-sm font-medium mb-2">
              Enter the Prompt Text
            </label>
            <Textarea
              id="prompt-text"
              placeholder="Write a smart contract that stores a value."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full h-40 bg-gray-800 border-purple-500"
            />
          </div>

          <Button onClick={handleGenerateContract} className="w-full bg-purple-600 hover:bg-purple-700">
            Generate Contract
          </Button>
        </div>

        <div className="w-1/2 bg-gray-800 rounded-lg p-6 flex items-center justify-center">
          {generatedContract ? (
            <pre className="whitespace-pre-wrap">{generatedContract}</pre>
          ) : (
            <p className="text-2xl font-bold">Lets build something cool 😎</p>
          )}
        </div>
      </main>
    </div>
  )
}