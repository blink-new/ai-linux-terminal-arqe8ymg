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
      content: 'Welcome to AI-Powered Linux Terminal v1.0\\nType "help" for available commands or use the AI assistant for suggestions.\\n',
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

  const generateAISuggestions = useCallback(async (input: string) => {
    if (!user) return
    
    // First try local command matching for instant feedback
    const localSuggestions = getLocalCommandSuggestions(input)
    if (localSuggestions.length > 0) {
      setAiSuggestions(localSuggestions)
    }
    
    try {
      setIsAIThinking(true)
      const { text } = await blink.ai.generateText({
        prompt: `You are a Linux terminal AI assistant. The user is typing: "${input}"

Based on this partial input, suggest 3 relevant Linux commands that they might want to use. Consider:
- Command completion and common variations
- Related commands that accomplish similar tasks  
- Commands that work well together
- File operations, system monitoring, network tools, development commands
- Package management, text processing, archive operations

Current directory: ${simulator.getCurrentDirectory()}
Available files: ${Object.keys(simulator.getNode(simulator.getCurrentDirectory())?.children || {}).join(', ')}

Respond with ONLY a JSON array of objects with this format:
[
  {
    "command": "complete command with common flags and arguments",
    "description": "brief description of what it does",
    "confidence": 0.9
  }
]

Keep descriptions under 60 characters. Order by confidence (0-1). Include specific file names when relevant.`,
        maxTokens: 400
      })

      try {
        const suggestions = JSON.parse(text) as AISuggestion[]
        setAiSuggestions(suggestions.slice(0, 3))
      } catch {
        // If JSON parsing fails, use local suggestions or fallback
        if (localSuggestions.length === 0) {
          setAiSuggestions([
            { command: 'ls -la', description: 'List all files with details', confidence: 0.8 },
            { command: 'help', description: 'Show available commands', confidence: 0.7 }
          ])
        }
      }
    } catch (error) {
      console.error('AI suggestion error:', error)
      // Keep local suggestions on error
    } finally {
      setIsAIThinking(false)
    }
  }, [user, simulator])

  const getLocalCommandSuggestions = (input: string): AISuggestion[] => {
    const commands = [
      // File Operations
      { cmd: 'ls', desc: 'List directory contents', variations: ['ls -la', 'ls -lh', 'ls -lt'] },
      { cmd: 'cd', desc: 'Change directory', variations: ['cd ..', 'cd ~', 'cd /'] },
      { cmd: 'pwd', desc: 'Print working directory', variations: ['pwd'] },
      { cmd: 'cat', desc: 'Display file contents', variations: ['cat file.txt', 'cat *.txt'] },
      { cmd: 'head', desc: 'Show first lines of file', variations: ['head -n 10', 'head file.txt'] },
      { cmd: 'tail', desc: 'Show last lines of file', variations: ['tail -f', 'tail -n 20'] },
      { cmd: 'grep', desc: 'Search text patterns', variations: ['grep -r', 'grep -i', 'grep -n'] },
      { cmd: 'find', desc: 'Find files and directories', variations: ['find . -name', 'find / -type f'] },
      { cmd: 'wc', desc: 'Word, line, character count', variations: ['wc -l', 'wc -w', 'wc -c'] },
      { cmd: 'sort', desc: 'Sort lines in file', variations: ['sort -r', 'sort -n', 'sort -u'] },
      { cmd: 'uniq', desc: 'Report unique lines', variations: ['uniq -c', 'uniq -d'] },
      { cmd: 'cut', desc: 'Extract columns from file', variations: ['cut -f1', 'cut -d,'] },
      { cmd: 'diff', desc: 'Compare files', variations: ['diff -u', 'diff -r'] },
      { cmd: 'file', desc: 'Determine file type', variations: ['file *', 'file -b'] },
      { cmd: 'stat', desc: 'Display file statistics', variations: ['stat file.txt'] },
      { cmd: 'du', desc: 'Disk usage', variations: ['du -h', 'du -s', 'du -sh *'] },
      { cmd: 'mkdir', desc: 'Create directory', variations: ['mkdir -p', 'mkdir dir1 dir2'] },
      { cmd: 'touch', desc: 'Create empty file', variations: ['touch file.txt'] },
      { cmd: 'rm', desc: 'Remove files', variations: ['rm -rf', 'rm -i', 'rm *.tmp'] },
      { cmd: 'cp', desc: 'Copy files', variations: ['cp -r', 'cp -i', 'cp file1 file2'] },
      { cmd: 'mv', desc: 'Move/rename files', variations: ['mv file1 file2', 'mv *.txt dir/'] },
      { cmd: 'ln', desc: 'Create links', variations: ['ln -s', 'ln file link'] },
      { cmd: 'chmod', desc: 'Change permissions', variations: ['chmod 755', 'chmod +x', 'chmod -R'] },
      { cmd: 'chown', desc: 'Change ownership', variations: ['chown user:group', 'chown -R'] },
      
      // Archive & Compression
      { cmd: 'tar', desc: 'Archive files', variations: ['tar -czf', 'tar -xzf', 'tar -tzf'] },
      { cmd: 'gzip', desc: 'Compress files', variations: ['gzip file.txt', 'gzip -d'] },
      { cmd: 'gunzip', desc: 'Decompress files', variations: ['gunzip file.gz'] },
      { cmd: 'zip', desc: 'Create zip archive', variations: ['zip -r archive.zip dir/'] },
      { cmd: 'unzip', desc: 'Extract zip archive', variations: ['unzip archive.zip', 'unzip -l'] },
      
      // Process Management
      { cmd: 'ps', desc: 'Show processes', variations: ['ps aux', 'ps -ef', 'ps -u user'] },
      { cmd: 'top', desc: 'Display running processes', variations: ['top', 'top -u user'] },
      { cmd: 'htop', desc: 'Interactive process viewer', variations: ['htop'] },
      { cmd: 'kill', desc: 'Terminate process', variations: ['kill -9', 'kill -TERM'] },
      { cmd: 'killall', desc: 'Kill processes by name', variations: ['killall process'] },
      { cmd: 'jobs', desc: 'Show active jobs', variations: ['jobs'] },
      { cmd: 'bg', desc: 'Background job', variations: ['bg %1'] },
      { cmd: 'fg', desc: 'Foreground job', variations: ['fg %1'] },
      { cmd: 'nohup', desc: 'Run immune to hangups', variations: ['nohup command &'] },
      
      // System Information
      { cmd: 'whoami', desc: 'Current username', variations: ['whoami'] },
      { cmd: 'id', desc: 'User and group IDs', variations: ['id', 'id -u', 'id -g'] },
      { cmd: 'uname', desc: 'System information', variations: ['uname -a', 'uname -r'] },
      { cmd: 'date', desc: 'Current date and time', variations: ['date', 'date +%Y-%m-%d'] },
      { cmd: 'uptime', desc: 'System uptime', variations: ['uptime'] },
      { cmd: 'df', desc: 'Disk space usage', variations: ['df -h', 'df -i'] },
      { cmd: 'free', desc: 'Memory usage', variations: ['free -h', 'free -m'] },
      { cmd: 'lscpu', desc: 'CPU information', variations: ['lscpu'] },
      { cmd: 'lsblk', desc: 'Block devices', variations: ['lsblk', 'lsblk -f'] },
      { cmd: 'lsusb', desc: 'USB devices', variations: ['lsusb', 'lsusb -v'] },
      { cmd: 'lspci', desc: 'PCI devices', variations: ['lspci', 'lspci -v'] },
      { cmd: 'mount', desc: 'Mount filesystems', variations: ['mount', 'mount -t ext4'] },
      { cmd: 'umount', desc: 'Unmount filesystems', variations: ['umount /mnt'] },
      { cmd: 'lsof', desc: 'List open files', variations: ['lsof -i', 'lsof -p'] },
      { cmd: 'netstat', desc: 'Network connections', variations: ['netstat -tuln', 'netstat -r'] },
      { cmd: 'ss', desc: 'Socket statistics', variations: ['ss -tuln', 'ss -s'] },
      
      // Network Tools
      { cmd: 'ping', desc: 'Test connectivity', variations: ['ping -c 4', 'ping google.com'] },
      { cmd: 'wget', desc: 'Download files', variations: ['wget url', 'wget -O file'] },
      { cmd: 'curl', desc: 'Transfer data', variations: ['curl url', 'curl -I', 'curl -X POST'] },
      { cmd: 'ssh', desc: 'Secure shell', variations: ['ssh user@host', 'ssh -p 22'] },
      { cmd: 'scp', desc: 'Secure copy', variations: ['scp file user@host:', 'scp -r'] },
      { cmd: 'nslookup', desc: 'DNS lookup', variations: ['nslookup domain'] },
      { cmd: 'dig', desc: 'DNS lookup tool', variations: ['dig domain', 'dig @8.8.8.8'] },
      { cmd: 'traceroute', desc: 'Trace network path', variations: ['traceroute google.com'] },
      
      // Development Tools
      { cmd: 'git', desc: 'Version control', variations: ['git status', 'git add .', 'git commit', 'git push'] },
      { cmd: 'make', desc: 'Build automation', variations: ['make', 'make clean', 'make install'] },
      { cmd: 'gcc', desc: 'C compiler', variations: ['gcc -o output file.c', 'gcc -Wall'] },
      { cmd: 'python', desc: 'Python interpreter', variations: ['python script.py', 'python3 -m'] },
      { cmd: 'node', desc: 'Node.js runtime', variations: ['node script.js', 'node --version'] },
      { cmd: 'npm', desc: 'Node package manager', variations: ['npm install', 'npm start', 'npm test'] },
      { cmd: 'docker', desc: 'Containerization', variations: ['docker ps', 'docker run', 'docker build'] },
      
      // Package Management
      { cmd: 'apt', desc: 'Package manager', variations: ['apt update', 'apt install', 'apt search'] },
      { cmd: 'yum', desc: 'Red Hat package manager', variations: ['yum install', 'yum update'] },
      { cmd: 'snap', desc: 'Universal packages', variations: ['snap install', 'snap list'] },
      
      // Text Editors
      { cmd: 'vim', desc: 'Vi editor', variations: ['vim file.txt', 'vim +10 file'] },
      { cmd: 'nano', desc: 'Simple text editor', variations: ['nano file.txt'] },
      { cmd: 'emacs', desc: 'Emacs editor', variations: ['emacs file.txt'] },
      
      // Environment
      { cmd: 'history', desc: 'Command history', variations: ['history', 'history | grep'] },
      { cmd: 'env', desc: 'Environment variables', variations: ['env', 'env | grep'] },
      { cmd: 'export', desc: 'Set environment variable', variations: ['export VAR=value'] },
      { cmd: 'which', desc: 'Locate command', variations: ['which command'] },
      { cmd: 'whereis', desc: 'Locate binary/source', variations: ['whereis command'] },
      { cmd: 'alias', desc: 'Command aliases', variations: ['alias ll="ls -la"'] },
      
      // Utilities
      { cmd: 'echo', desc: 'Display text', variations: ['echo "hello"', 'echo $VAR'] },
      { cmd: 'sleep', desc: 'Pause execution', variations: ['sleep 5', 'sleep 1m'] },
      { cmd: 'watch', desc: 'Repeat command', variations: ['watch -n 1', 'watch df -h'] },
      { cmd: 'cal', desc: 'Calendar', variations: ['cal', 'cal 2024'] },
      { cmd: 'bc', desc: 'Calculator', variations: ['bc', 'echo "2+2" | bc'] },
      { cmd: 'seq', desc: 'Sequence of numbers', variations: ['seq 1 10', 'seq 1 2 10'] },
      { cmd: 'fortune', desc: 'Random quote', variations: ['fortune'] },
      { cmd: 'cowsay', desc: 'ASCII cow', variations: ['cowsay "hello"'] },
      { cmd: 'figlet', desc: 'ASCII art text', variations: ['figlet "text"'] },
      
      // Help
      { cmd: 'man', desc: 'Manual pages', variations: ['man command', 'man -k keyword'] },
      { cmd: 'help', desc: 'Help information', variations: ['help'] },
      { cmd: 'apropos', desc: 'Search manual descriptions', variations: ['apropos keyword'] },
      { cmd: 'whatis', desc: 'Brief command description', variations: ['whatis command'] },
      { cmd: 'clear', desc: 'Clear terminal', variations: ['clear'] }
    ]

    const matches = commands.filter(c => 
      c.cmd.startsWith(input.toLowerCase()) || 
      c.variations.some(v => v.startsWith(input.toLowerCase()))
    )

    return matches.slice(0, 3).map((match, index) => {
      const bestVariation = match.variations.find(v => v.startsWith(input.toLowerCase())) || match.variations[0]
      return {
        command: bestVariation,
        description: match.desc,
        confidence: 0.9 - (index * 0.1)
      }
    })
  }

  // Generate AI suggestions based on current input
  useEffect(() => {
    if (currentInput.length > 1 && user) {
      const timeoutId = setTimeout(() => {
        generateAISuggestions(currentInput)
      }, 300) // Faster response
      return () => clearTimeout(timeoutId)
    } else {
      setAiSuggestions([])
    }
  }, [currentInput, user, generateAISuggestions])

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
    } else if (e.key >= '1' && e.key <= '3' && e.ctrlKey && aiSuggestions.length > 0) {
      // Ctrl + number to select suggestion
      e.preventDefault()
      const index = parseInt(e.key) - 1
      if (index < aiSuggestions.length) {
        setCurrentInput(aiSuggestions[index].command)
        setAiSuggestions([])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      // Get last command from history
      const lastCommand = lines.filter(line => line.type === 'command').pop()
      if (lastCommand) {
        setCurrentInput(lastCommand.content)
        setAiSuggestions([])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      // Clear input on arrow down
      setCurrentInput('')
      setAiSuggestions([])
    } else if (e.key === 'Escape') {
      // Clear suggestions on escape
      setAiSuggestions([])
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
                  <div className="mt-3 border-t border-border/50 pt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Command Suggestions (Press Tab to use first, or click any)
                    </div>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="group relative bg-muted/30 hover:bg-muted/60 border border-border/50 hover:border-primary/50 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-sm"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded text-primary font-medium">
                                  {index === 0 ? 'Tab' : `Ctrl+${index + 1}`}
                                </kbd>
                                <code className="text-sm font-mono text-green-400 font-medium break-all">
                                  {suggestion.command}
                                </code>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {suggestion.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(suggestion.confidence * 100)}%
                              </Badge>
                              <div className="w-2 h-2 rounded-full bg-green-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          
                          {/* Preview indicator */}
                          <div className="absolute inset-0 rounded-lg border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground/80 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-primary rounded-full"></span>
                        Press Tab, Ctrl+1/2/3, or click to use • Type more for better suggestions
                      </p>
                    </div>
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
                            💡 Use <kbd>Tab</kbd> to accept first suggestion<br/>
                            💡 Use <kbd>Ctrl+1/2/3</kbd> to select specific suggestions<br/>
                            💡 Use <kbd>↑</kbd> to recall last command<br/>
                            💡 Use <kbd>Esc</kbd> to clear suggestions<br/>
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