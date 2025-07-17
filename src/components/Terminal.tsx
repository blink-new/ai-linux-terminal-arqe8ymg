import React, { useState, useEffect, useRef, useCallback } from 'react'
import { LinuxSimulator } from '../lib/linux-simulator'
import { blink } from '../blink/client'
import { Bot, Terminal as TerminalIcon, Sparkles, History, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error'
  content: string
  timestamp: Date
  prompt?: string
}

interface AISuggestion {
  command: string
  description: string
  confidence: number
}

export function Terminal() {
  const [simulator] = useState(() => new LinuxSimulator())
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to AI-Powered Linux Terminal v1.0\nType "help" for available commands or use the AI assistant for suggestions.\n',
      timestamp: new Date()
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [showAIPanel, setShowAIPanel] = useState(true)
  const [aiChatHistory, setAiChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [aiInput, setAiInput] = useState('')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<any>(null)

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Generate AI suggestions based on current input
  useEffect(() => {
    if (currentInput.length > 2 && user) {
      const timeoutId = setTimeout(async () => {
        await generateAISuggestions(currentInput)
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setAiSuggestions([])
    }
  }, [currentInput, user, generateAISuggestions])

  const generateAISuggestions = useCallback(async (input: string) => {
    if (!user) return
    
    try {
      setIsAIThinking(true)
      const { text } = await blink.ai.generateText({
        prompt: `You are a Linux terminal AI assistant. The user is typing: "${input}"

Based on this partial input, suggest 3 relevant Linux commands that they might want to use. Consider:
- Common typos and partial commands
- Related commands that accomplish similar tasks
- Commands that work well together

Current directory: ${simulator.getCurrentDirectory()}

Respond with ONLY a JSON array of objects with this format:
[
  {
    "command": "complete command with common flags",
    "description": "brief description of what it does",
    "confidence": 0.9
  }
]

Keep descriptions under 50 characters. Order by confidence (0-1).`,
        maxTokens: 300
      })

      try {
        const suggestions = JSON.parse(text) as AISuggestion[]
        setAiSuggestions(suggestions.slice(0, 3))
      } catch {
        // If JSON parsing fails, create fallback suggestions
        setAiSuggestions([
          { command: 'ls -la', description: 'List all files with details', confidence: 0.8 },
          { command: 'help', description: 'Show available commands', confidence: 0.7 }
        ])
      }
    } catch (error) {
      console.error('AI suggestion error:', error)
    } finally {
      setIsAIThinking(false)
    }
  }, [user, simulator])

  const handleCommand = async (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    const prompt = simulator.getPrompt()
    
    // Add command to terminal
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: trimmedCommand,
      timestamp: new Date(),
      prompt
    }

    setLines(prev => [...prev, commandLine])

    // Execute command
    if (trimmedCommand === 'clear') {
      setLines([])
      return
    }

    const output = simulator.executeCommand(trimmedCommand)
    
    if (output) {
      const outputLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: output.includes('command not found') || output.includes('No such file') ? 'error' : 'output',
        content: output,
        timestamp: new Date()
      }
      setLines(prev => [...prev, outputLine])
    }

    // Get AI explanation for errors
    if (output.includes('command not found') || output.includes('No such file') || output.includes('Permission denied')) {
      await getAIErrorExplanation(trimmedCommand, output)
    }
  }

  const getAIErrorExplanation = async (command: string, error: string) => {
    if (!user) return
    
    try {
      const { text } = await blink.ai.generateText({
        prompt: `The user ran this Linux command: "${command}"
And got this error: "${error}"

Provide a brief, helpful explanation of:
1. Why this error occurred
2. How to fix it
3. Alternative commands that might work

Keep it concise and practical. Format as plain text, no markdown.`,
        maxTokens: 200
      })

      const explanationLine: TerminalLine = {
        id: (Date.now() + 2).toString(),
        type: 'output',
        content: `🤖 AI Assistant: ${text}`,
        timestamp: new Date()
      }
      setLines(prev => [...prev, explanationLine])
    } catch (error) {
      console.error('AI explanation error:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput)
      setCurrentInput('')
      setAiSuggestions([])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (aiSuggestions.length > 0) {
        setCurrentInput(aiSuggestions[0].command)
        setAiSuggestions([])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      // Get last command from history
      const lastCommand = lines.filter(line => line.type === 'command').pop()
      if (lastCommand) {
        setCurrentInput(lastCommand.content)
      }
    }
  }

  const applySuggestion = (suggestion: AISuggestion) => {
    setCurrentInput(suggestion.command)
    setAiSuggestions([])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleAIChat = async () => {
    if (!aiInput.trim() || !user) return

    const userMessage = { role: 'user' as const, content: aiInput }
    setAiChatHistory(prev => [...prev, userMessage])
    setAiInput('')

    try {
      const { text } = await blink.ai.generateText({
        messages: [
          { role: 'system', content: 'You are a helpful Linux terminal assistant. Help users with Linux commands, explain concepts, and provide practical solutions. Keep responses concise and actionable.' },
          ...aiChatHistory,
          userMessage
        ],
        maxTokens: 500
      })

      const assistantMessage = { role: 'assistant' as const, content: text }
      setAiChatHistory(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage = { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }
      setAiChatHistory(prev => [...prev, errorMessage])
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <TerminalIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">AI-Powered Linux Terminal</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to access the terminal
          </p>
          <Button onClick={() => blink.auth.login()}>
            Sign In
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Terminal */}
          <div className="lg:col-span-2">
            <Card className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red"></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
                <span className="ml-4 text-sm font-medium">AI Terminal - {user.email}</span>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {simulator.getCurrentDirectory()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIPanel(!showAIPanel)}
                  >
                    <Bot className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="terminal-content">
                <ScrollArea className="h-[500px] scrollbar-thin" ref={terminalRef}>
                  {lines.map((line) => (
                    <div key={line.id} className="terminal-line">
                      {line.type === 'command' && (
                        <span className="terminal-prompt">{line.prompt}</span>
                      )}
                      <pre className={`whitespace-pre-wrap font-mono text-sm ${
                        line.type === 'error' ? 'text-red-400' : 
                        line.type === 'command' ? 'text-green-400' : 
                        'text-green-300'
                      }`}>
                        {line.content}
                      </pre>
                    </div>
                  ))}
                  
                  {/* Current input line */}
                  <div className="terminal-line">
                    <span className="terminal-prompt">{simulator.getPrompt()}</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="terminal-input"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <span className="terminal-cursor"></span>
                  </div>
                </ScrollArea>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3" />
                      AI Suggestions (Tab to accept first)
                    </div>
                    {aiSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="command-suggestion cursor-pointer"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        <div className="flex items-center justify-between">
                          <code className="text-sm text-green-400">{suggestion.command}</code>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(suggestion.confidence * 100)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {isAIThinking && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    AI is thinking...
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          {showAIPanel && (
            <div className="lg:col-span-1">
              <Card className="ai-panel">
                <Tabs defaultValue="chat" className="h-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat">AI Chat</TabsTrigger>
                    <TabsTrigger value="help">Quick Help</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">AI Assistant</h3>
                      </div>
                      
                      <ScrollArea className="h-[300px] scrollbar-thin">
                        <div className="space-y-3">
                          {aiChatHistory.length === 0 && (
                            <div className="text-sm text-muted-foreground">
                              Ask me anything about Linux commands, file operations, or system administration!
                            </div>
                          )}
                          {aiChatHistory.map((message, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg text-sm ${
                                message.role === 'user'
                                  ? 'bg-primary/10 ml-4'
                                  : 'bg-muted mr-4'
                              }`}
                            >
                              <div className="font-medium mb-1">
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                              </div>
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                          placeholder="Ask about Linux commands..."
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
                        />
                        <Button size="sm" onClick={handleAIChat}>
                          <Bot className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="help" className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Quick Reference</h3>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-medium text-green-400 mb-1">Navigation</h4>
                          <div className="space-y-1 text-muted-foreground">
                            <div><code>ls -la</code> - List files with details</div>
                            <div><code>cd &lt;dir&gt;</code> - Change directory</div>
                            <div><code>pwd</code> - Show current path</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-green-400 mb-1">File Operations</h4>
                          <div className="space-y-1 text-muted-foreground">
                            <div><code>cat &lt;file&gt;</code> - View file content</div>
                            <div><code>mkdir &lt;dir&gt;</code> - Create directory</div>
                            <div><code>touch &lt;file&gt;</code> - Create file</div>
                            <div><code>rm &lt;file&gt;</code> - Delete file</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-green-400 mb-1">System Info</h4>
                          <div className="space-y-1 text-muted-foreground">
                            <div><code>ps aux</code> - Show processes</div>
                            <div><code>top</code> - System monitor</div>
                            <div><code>df -h</code> - Disk usage</div>
                            <div><code>free -h</code> - Memory usage</div>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-border">
                          <div className="text-xs text-muted-foreground">
                            💡 Use <kbd>Tab</kbd> to accept AI suggestions<br/>
                            💡 Use <kbd>↑</kbd> to recall last command<br/>
                            💡 Type <code>help</code> for full command list
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}