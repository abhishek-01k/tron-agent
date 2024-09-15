"use client";
import React, { useState } from 'react'
import { Package2, Send, FileCode, Webhook, Image, Code2, Database, Radio, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Sidebar component
const Sidebar = ({ activeItem, setActiveItem } : any) => {
  const menuItems = [
    { icon: <Package2 className="w-4 h-4" />, label: 'Ask Agent', key: 'ask' },
    { icon: <Send className="w-4 h-4" />, label: 'Send Transaction', key: 'send' },
    { icon: <FileCode className="w-4 h-4" />, label: 'Deploy Contract', key: 'deploy' },
    { icon: <Webhook className="w-4 h-4" />, label: 'Deploy Hooks', key: 'hooks' },
    { icon: <Image className="w-4 h-4" />, label: 'Image Generator', key: 'image' },
    { icon: <Code2 className="w-4 h-4" />, label: 'Discover Contract', key: 'discover' },
    { icon: <Database className="w-4 h-4" />, label: 'Search Data', key: 'search' },
    { icon: <Coins className="w-4 h-4" />, label: 'Token List', key: 'tokens' },
  ]

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-900 text-white h-screen w-64">
      {menuItems.map((item) => (
        <Button
          key={item.key}
          variant={activeItem === item.key ? 'secondary' : 'ghost'}
          className="justify-start"
          onClick={() => setActiveItem(item.key)}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Button>
      ))}
      <Button className="mt-auto" variant="outline">
        Verify with World ID
      </Button>
    </div>
  )
}

// Placeholder components for different transaction types
const AskAgent = () => <div>Ask Agent Component</div>
const SendTransaction = () => <div>Send Transaction Component</div>
const DeployContract = () => <div>Deploy Contract Component</div>
const ImageGenerator = () => <div>Image Generator Component</div>
const DiscoverContract = () => <div>Discover Contract Component</div>
const SearchData = () => <div>Search Data Component</div>
const TokenList = () => <div>Token List Component</div>

// Main component
export default function Component() {
  const [activeItem, setActiveItem] = useState('ask')

  const renderContent = () => {
    switch (activeItem) {
      case 'ask':
        return <AskAgent />
      case 'send':
        return <SendTransaction />
      case 'deploy':
        return <DeployContract />
      case 'image':
        return <ImageGenerator />
      case 'discover':
        return <DiscoverContract />
      case 'search':
        return <SearchData />
      case 'tokens':
        return <TokenList />
      default:
        return <AskAgent />
    }
  }

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Tron Agent</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Tron Mainnet</Button>
            <Button variant="outline">0 TRX</Button>
            <Button variant="outline" className="rounded-full w-8 h-8 p-0">
              <span className="sr-only">User menu</span>
              🌐
            </Button>
          </div>
        </div>
        {renderContent()}
        <div className="mt-8">
          <Input placeholder="Send a message..." className="bg-gray-700" />
        </div>
      </div>
    </div>
  )
}