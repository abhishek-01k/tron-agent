"use client";
import React, { useState, useCallback } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Command {
  id: number;
  type: string;
  amount: string;
  text: string;
}

const initialQueryCommands: Command[] = [
  { id: 1, type: "transfer", amount: "10", text: "Transfer {amount} stUSDT to HTX DAO" },
  { id: 2, type: "lend", amount: "100", text: "Lend {amount} stUSDT on Justlend" },
  { id: 3, type: "swap", amount: "50", text: "Swap {amount} sTRX to USDD on Sunswap" },
  { id: 4, type: "stake", amount: "200", text: "Stake {amount} sTRX on Energy Rental" },
  { id: 5, type: "send", amount: "500", text: "Send {amount} USDD to Sun Dapp Chain" },
  { id: 6, type: "transfer", amount: "1", text: "Transfer {amount} ApeNFT to BitTorrent File System" },
  { id: 7, type: "swap", amount: "100", text: "Swap {amount} USDD to BTT on Sunswap" }
]

const filterOptions = ['All', 'HTX DAO', 'stUSDT', 'Justlend', 'sTRX', 'Sunswap', 'Energy Rental', 'Sun Dapp Chain', 'ApeNFT', 'BitTorrent File System']

const CommandItem: React.FC<{
  command: Command;
  isSelected: boolean;
  onSelect: () => void;
  onAmountChange: (newAmount: string) => void;
}> = ({ command, isSelected, onSelect, onAmountChange }) => {
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(e.target.value)
    e.stopPropagation()
  }, [onAmountChange])

  return (
    <div 
      className={`py-2 px-4 hover:bg-gray-700 cursor-pointer ${isSelected ? 'bg-gray-1200' : ''}`}
      onClick={onSelect}
    >
      <span className="text-green-400">❯ </span>
      {command.text.split('{amount}')[0]}
      <Input
        type="number"
        value={command.amount}
        onChange={handleAmountChange}
        className="inline-block w-20 mx-1 bg-gray-800 text-white"
        onClick={(e) => e.stopPropagation()}
      />
      {command.text.split('{amount}')[1]}
    </div>
  )
}

export default function SendTransaction() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const [queryCommands, setQueryCommands] = useState(initialQueryCommands)
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)

  const filteredCommands = filter === 'All' 
    ? queryCommands 
    : queryCommands.filter(cmd => cmd.text.toLowerCase().includes(filter.toLowerCase()))

  const handleAmountChange = useCallback((id: number, newAmount: string) => {
    setQueryCommands(prevCommands => 
      prevCommands.map(cmd => 
        cmd.id === id ? { ...cmd, amount: newAmount } : cmd
      )
    )
  }, [])

  const executeCommand = useCallback((command: Command) => {
    console.log(`Executing command: ${command.text.replace('{amount}', command.amount)}`)
    // Add specific logic for the protocol here
  }, [])

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Send transactions with Web3 Agent (Tron Chain)</h2>

      <Button onClick={() => setIsModalOpen(true)} className="w-full mb-4">
        Query Commands
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Query Commands</DialogTitle>
            <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="flex space-x-2 mb-4">
            {filterOptions.map((option) => (
              <Button
                key={option}
                onClick={() => setFilter(option)}
                variant={filter === option ? "default" : "outline"}
                size="sm"
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCommands.map((command) => (
              <CommandItem
                key={command.id}
                command={command}
                isSelected={selectedCommand?.id === command.id}
                onSelect={() => setSelectedCommand(command)}
                onAmountChange={(newAmount) => handleAmountChange(command.id, newAmount)}
              />
            ))}
          </div>
          {selectedCommand && (
            <Button 
              onClick={() => {
                executeCommand(selectedCommand)
                setIsModalOpen(false)
              }}
              className="mt-4"
            >
              Execute Command
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-auto">
        <Input
          placeholder="Send a message..."
          className="bg-gray-700 text-white"
        />
      </div>
    </div>
  )
}
