export interface FileSystemNode {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: { [key: string]: FileSystemNode }
  permissions: string
  owner: string
  group: string
  size: number
  modified: Date
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  memory: number
  user: string
  status: string
}

export class LinuxSimulator {
  private currentDirectory: string = '/home/user'
  private fileSystem: { [key: string]: FileSystemNode }
  private commandHistory: string[] = []
  private environment: { [key: string]: string }
  private processes: ProcessInfo[] = []
  private nextPid = 1000

  constructor() {
    this.fileSystem = this.initializeFileSystem()
    this.environment = {
      PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
      HOME: '/home/user',
      USER: 'user',
      SHELL: '/bin/bash',
      PWD: '/home/user',
      TERM: 'xterm-256color',
      LANG: 'en_US.UTF-8'
    }
    this.initializeProcesses()
  }

  private initializeFileSystem(): { [key: string]: FileSystemNode } {
    return {
      '/': {
        name: '/',
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        size: 4096,
        modified: new Date(),
        children: {
          'home': {
            name: 'home',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            group: 'root',
            size: 4096,
            modified: new Date(),
            children: {
              'user': {
                name: 'user',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'user',
                group: 'user',
                size: 4096,
                modified: new Date(),
                children: {
                  'Documents': {
                    name: 'Documents',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'user',
                    group: 'user',
                    size: 4096,
                    modified: new Date(),
                    children: {
                      'readme.txt': {
                        name: 'readme.txt',
                        type: 'file',
                        content: 'Welcome to the AI-Powered Linux Terminal!\n\nThis is a fully functional Linux terminal simulator with AI assistance.\n\nTry commands like:\n- ls -la\n- cat readme.txt\n- ps aux\n- top\n- help\n\nUse the AI assistant for command suggestions and explanations!',
                        permissions: '-rw-r--r--',
                        owner: 'user',
                        group: 'user',
                        size: 256,
                        modified: new Date()
                      }
                    }
                  },
                  'Downloads': {
                    name: 'Downloads',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'user',
                    group: 'user',
                    size: 4096,
                    modified: new Date(),
                    children: {}
                  },
                  '.bashrc': {
                    name: '.bashrc',
                    type: 'file',
                    content: '# ~/.bashrc: executed by bash(1) for non-login shells\n\n# If not running interactively, don\'t do anything\ncase $- in\n    *i*) ;;\n      *) return;;\nesac\n\n# enable color support of ls and also add handy aliases\nif [ -x /usr/bin/dircolors ]; then\n    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"\n    alias ls=\'ls --color=auto\'\n    alias grep=\'grep --color=auto\'\nfi\n\n# some more ls aliases\nalias ll=\'ls -alF\'\nalias la=\'ls -A\'\nalias l=\'ls -CF\'',
                    permissions: '-rw-r--r--',
                    owner: 'user',
                    group: 'user',
                    size: 512,
                    modified: new Date()
                  }
                }
              }
            }
          },
          'etc': {
            name: 'etc',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            group: 'root',
            size: 4096,
            modified: new Date(),
            children: {
              'passwd': {
                name: 'passwd',
                type: 'file',
                content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin',
                permissions: '-rw-r--r--',
                owner: 'root',
                group: 'root',
                size: 128,
                modified: new Date()
              },
              'hostname': {
                name: 'hostname',
                type: 'file',
                content: 'ai-terminal',
                permissions: '-rw-r--r--',
                owner: 'root',
                group: 'root',
                size: 11,
                modified: new Date()
              }
            }
          },
          'usr': {
            name: 'usr',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            group: 'root',
            size: 4096,
            modified: new Date(),
            children: {
              'bin': {
                name: 'bin',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'root',
                group: 'root',
                size: 4096,
                modified: new Date(),
                children: {}
              }
            }
          },
          'var': {
            name: 'var',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            group: 'root',
            size: 4096,
            modified: new Date(),
            children: {
              'log': {
                name: 'log',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'root',
                group: 'root',
                size: 4096,
                modified: new Date(),
                children: {}
              }
            }
          }
        }
      }
    }
  }

  private initializeProcesses(): void {
    this.processes = [
      { pid: 1, name: 'systemd', cpu: 0.1, memory: 1.2, user: 'root', status: 'S' },
      { pid: 2, name: 'kthreadd', cpu: 0.0, memory: 0.0, user: 'root', status: 'S' },
      { pid: 123, name: 'bash', cpu: 0.2, memory: 2.1, user: 'user', status: 'S' },
      { pid: 456, name: 'ai-terminal', cpu: 1.5, memory: 15.3, user: 'user', status: 'R' },
      { pid: 789, name: 'chrome', cpu: 2.3, memory: 45.7, user: 'user', status: 'S' }
    ]
  }

  private getNode(path: string): FileSystemNode | null {
    const normalizedPath = this.normalizePath(path)
    const parts = normalizedPath.split('/').filter(p => p)
    
    let current = this.fileSystem['/']
    
    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null
      }
      current = current.children[part]
    }
    
    return current
  }

  private normalizePath(path: string): string {
    if (path.startsWith('/')) {
      return path
    }
    
    const currentParts = this.currentDirectory.split('/').filter(p => p)
    const pathParts = path.split('/').filter(p => p)
    
    for (const part of pathParts) {
      if (part === '..') {
        currentParts.pop()
      } else if (part !== '.') {
        currentParts.push(part)
      }
    }
    
    return '/' + currentParts.join('/')
  }

  private formatFileSize(size: number): string {
    if (size < 1024) return size.toString()
    if (size < 1024 * 1024) return Math.round(size / 1024) + 'K'
    if (size < 1024 * 1024 * 1024) return Math.round(size / (1024 * 1024)) + 'M'
    return Math.round(size / (1024 * 1024 * 1024)) + 'G'
  }

  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const day = date.getDate().toString().padStart(2, ' ')
    const time = date.toTimeString().slice(0, 5)
    return `${month} ${day} ${time}`
  }

  executeCommand(command: string): string {
    this.commandHistory.push(command)
    const parts = command.trim().split(/\s+/)
    const cmd = parts[0]
    const args = parts.slice(1)

    switch (cmd) {
      case 'ls':
        return this.ls(args)
      case 'cd':
        return this.cd(args)
      case 'pwd':
        return this.pwd()
      case 'cat':
        return this.cat(args)
      case 'echo':
        return this.echo(args)
      case 'mkdir':
        return this.mkdir(args)
      case 'touch':
        return this.touch(args)
      case 'rm':
        return this.rm(args)
      case 'cp':
        return this.cp(args)
      case 'mv':
        return this.mv(args)
      case 'find':
        return this.find(args)
      case 'grep':
        return this.grep(args)
      case 'ps':
        return this.ps(args)
      case 'top':
        return this.top()
      case 'kill':
        return this.kill(args)
      case 'whoami':
        return this.whoami()
      case 'id':
        return this.id()
      case 'uname':
        return this.uname(args)
      case 'date':
        return this.date()
      case 'uptime':
        return this.uptime()
      case 'df':
        return this.df(args)
      case 'free':
        return this.free(args)
      case 'history':
        return this.history()
      case 'env':
        return this.env()
      case 'export':
        return this.export(args)
      case 'which':
        return this.which(args)
      case 'man':
        return this.man(args)
      case 'help':
        return this.help()
      case 'clear':
        return 'CLEAR'
      case '':
        return ''
      default:
        return `bash: ${cmd}: command not found`
    }
  }

  private ls(args: string[]): string {
    const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al')
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al')
    
    const pathArg = args.find(arg => !arg.startsWith('-')) || this.currentDirectory
    const targetPath = this.normalizePath(pathArg)
    const node = this.getNode(targetPath)
    
    if (!node) {
      return `ls: cannot access '${pathArg}': No such file or directory`
    }
    
    if (node.type === 'file') {
      if (longFormat) {
        return `${node.permissions} 1 ${node.owner} ${node.group} ${this.formatFileSize(node.size)} ${this.formatDate(node.modified)} ${node.name}`
      }
      return node.name
    }
    
    if (!node.children) {
      return ''
    }
    
    let entries = Object.values(node.children)
    
    if (!showAll) {
      entries = entries.filter(entry => !entry.name.startsWith('.'))
    }
    
    if (longFormat) {
      let total = 0
      entries.forEach(entry => total += Math.ceil(entry.size / 1024))
      
      let result = `total ${total}\n`
      entries.forEach(entry => {
        result += `${entry.permissions} 1 ${entry.owner} ${entry.group} ${this.formatFileSize(entry.size)} ${this.formatDate(entry.modified)} ${entry.name}\n`
      })
      return result.trim()
    }
    
    return entries.map(entry => entry.name).join('  ')
  }

  private cd(args: string[]): string {
    if (args.length === 0) {
      this.currentDirectory = this.environment.HOME
      this.environment.PWD = this.currentDirectory
      return ''
    }
    
    const targetPath = this.normalizePath(args[0])
    const node = this.getNode(targetPath)
    
    if (!node) {
      return `cd: ${args[0]}: No such file or directory`
    }
    
    if (node.type !== 'directory') {
      return `cd: ${args[0]}: Not a directory`
    }
    
    this.currentDirectory = targetPath
    this.environment.PWD = this.currentDirectory
    return ''
  }

  private pwd(): string {
    return this.currentDirectory
  }

  private cat(args: string[]): string {
    if (args.length === 0) {
      return 'cat: missing file operand'
    }
    
    const results: string[] = []
    
    for (const arg of args) {
      const targetPath = this.normalizePath(arg)
      const node = this.getNode(targetPath)
      
      if (!node) {
        results.push(`cat: ${arg}: No such file or directory`)
      } else if (node.type === 'directory') {
        results.push(`cat: ${arg}: Is a directory`)
      } else {
        results.push(node.content || '')
      }
    }
    
    return results.join('\n')
  }

  private echo(args: string[]): string {
    return args.join(' ')
  }

  private mkdir(args: string[]): string {
    if (args.length === 0) {
      return 'mkdir: missing operand'
    }
    
    for (const arg of args) {
      const targetPath = this.normalizePath(arg)
      const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/'
      const dirName = targetPath.substring(targetPath.lastIndexOf('/') + 1)
      
      const parentNode = this.getNode(parentPath)
      
      if (!parentNode) {
        return `mkdir: cannot create directory '${arg}': No such file or directory`
      }
      
      if (parentNode.type !== 'directory') {
        return `mkdir: cannot create directory '${arg}': Not a directory`
      }
      
      if (!parentNode.children) {
        parentNode.children = {}
      }
      
      if (parentNode.children[dirName]) {
        return `mkdir: cannot create directory '${arg}': File exists`
      }
      
      parentNode.children[dirName] = {
        name: dirName,
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'user',
        group: 'user',
        size: 4096,
        modified: new Date(),
        children: {}
      }
    }
    
    return ''
  }

  private touch(args: string[]): string {
    if (args.length === 0) {
      return 'touch: missing file operand'
    }
    
    for (const arg of args) {
      const targetPath = this.normalizePath(arg)
      const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/'
      const fileName = targetPath.substring(targetPath.lastIndexOf('/') + 1)
      
      const parentNode = this.getNode(parentPath)
      
      if (!parentNode) {
        return `touch: cannot touch '${arg}': No such file or directory`
      }
      
      if (parentNode.type !== 'directory') {
        return `touch: cannot touch '${arg}': Not a directory`
      }
      
      if (!parentNode.children) {
        parentNode.children = {}
      }
      
      if (parentNode.children[fileName]) {
        parentNode.children[fileName].modified = new Date()
      } else {
        parentNode.children[fileName] = {
          name: fileName,
          type: 'file',
          content: '',
          permissions: '-rw-r--r--',
          owner: 'user',
          group: 'user',
          size: 0,
          modified: new Date()
        }
      }
    }
    
    return ''
  }

  private rm(args: string[]): string {
    if (args.length === 0) {
      return 'rm: missing operand'
    }
    
    const recursive = args.includes('-r') || args.includes('-rf')
    const force = args.includes('-f') || args.includes('-rf')
    const files = args.filter(arg => !arg.startsWith('-'))
    
    for (const file of files) {
      const targetPath = this.normalizePath(file)
      const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/'
      const fileName = targetPath.substring(targetPath.lastIndexOf('/') + 1)
      
      const parentNode = this.getNode(parentPath)
      
      if (!parentNode || !parentNode.children) {
        if (!force) {
          return `rm: cannot remove '${file}': No such file or directory`
        }
        continue
      }
      
      const targetNode = parentNode.children[fileName]
      
      if (!targetNode) {
        if (!force) {
          return `rm: cannot remove '${file}': No such file or directory`
        }
        continue
      }
      
      if (targetNode.type === 'directory' && !recursive) {
        return `rm: cannot remove '${file}': Is a directory`
      }
      
      delete parentNode.children[fileName]
    }
    
    return ''
  }

  private cp(args: string[]): string {
    if (args.length < 2) {
      return 'cp: missing destination file operand'
    }
    
    const source = args[0]
    const dest = args[1]
    
    const sourcePath = this.normalizePath(source)
    const sourceNode = this.getNode(sourcePath)
    
    if (!sourceNode) {
      return `cp: cannot stat '${source}': No such file or directory`
    }
    
    if (sourceNode.type === 'directory') {
      return `cp: -r not specified; omitting directory '${source}'`
    }
    
    const destPath = this.normalizePath(dest)
    const destParentPath = destPath.substring(0, destPath.lastIndexOf('/')) || '/'
    const destFileName = destPath.substring(destPath.lastIndexOf('/') + 1)
    
    const destParentNode = this.getNode(destParentPath)
    
    if (!destParentNode) {
      return `cp: cannot create regular file '${dest}': No such file or directory`
    }
    
    if (!destParentNode.children) {
      destParentNode.children = {}
    }
    
    destParentNode.children[destFileName] = {
      ...sourceNode,
      name: destFileName,
      modified: new Date()
    }
    
    return ''
  }

  private mv(args: string[]): string {
    if (args.length < 2) {
      return 'mv: missing destination file operand'
    }
    
    const source = args[0]
    const dest = args[1]
    
    const sourcePath = this.normalizePath(source)
    const sourceParentPath = sourcePath.substring(0, sourcePath.lastIndexOf('/')) || '/'
    const sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1)
    
    const sourceParentNode = this.getNode(sourceParentPath)
    
    if (!sourceParentNode || !sourceParentNode.children) {
      return `mv: cannot stat '${source}': No such file or directory`
    }
    
    const sourceNode = sourceParentNode.children[sourceFileName]
    
    if (!sourceNode) {
      return `mv: cannot stat '${source}': No such file or directory`
    }
    
    const destPath = this.normalizePath(dest)
    const destParentPath = destPath.substring(0, destPath.lastIndexOf('/')) || '/'
    const destFileName = destPath.substring(destPath.lastIndexOf('/') + 1)
    
    const destParentNode = this.getNode(destParentPath)
    
    if (!destParentNode) {
      return `mv: cannot move '${source}' to '${dest}': No such file or directory`
    }
    
    if (!destParentNode.children) {
      destParentNode.children = {}
    }
    
    destParentNode.children[destFileName] = {
      ...sourceNode,
      name: destFileName,
      modified: new Date()
    }
    
    delete sourceParentNode.children[sourceFileName]
    
    return ''
  }

  private find(args: string[]): string {
    const path = args[0] || this.currentDirectory
    const namePattern = args.includes('-name') ? args[args.indexOf('-name') + 1] : null
    
    const results: string[] = []
    
    const search = (currentPath: string, node: FileSystemNode) => {
      if (!namePattern || node.name.includes(namePattern.replace(/\*/g, ''))) {
        results.push(currentPath)
      }
      
      if (node.type === 'directory' && node.children) {
        for (const [childName, childNode] of Object.entries(node.children)) {
          search(`${currentPath}/${childName}`, childNode)
        }
      }
    }
    
    const startNode = this.getNode(path)
    if (startNode) {
      search(path, startNode)
    }
    
    return results.join('\n')
  }

  private grep(args: string[]): string {
    if (args.length < 2) {
      return 'grep: missing pattern or file'
    }
    
    const pattern = args[0]
    const file = args[1]
    
    const targetPath = this.normalizePath(file)
    const node = this.getNode(targetPath)
    
    if (!node) {
      return `grep: ${file}: No such file or directory`
    }
    
    if (node.type === 'directory') {
      return `grep: ${file}: Is a directory`
    }
    
    const content = node.content || ''
    const lines = content.split('\n')
    const matches = lines.filter(line => line.includes(pattern))
    
    return matches.join('\n')
  }

  private ps(args: string[]): string {
    const showAll = args.includes('aux') || args.includes('-aux')
    
    if (showAll) {
      let result = 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n'
      this.processes.forEach(proc => {
        const vsz = Math.floor(Math.random() * 100000) + 10000
        const rss = Math.floor(vsz * proc.memory / 100)
        result += `${proc.user.padEnd(10)} ${proc.pid.toString().padStart(5)} ${proc.cpu.toFixed(1).padStart(4)} ${proc.memory.toFixed(1).padStart(4)} ${vsz.toString().padStart(7)} ${rss.toString().padStart(5)} pts/0    ${proc.status}    12:00   0:00 ${proc.name}\n`
      })
      return result.trim()
    }
    
    let result = '  PID TTY          TIME CMD\n'
    this.processes.filter(p => p.user === 'user').forEach(proc => {
      result += `${proc.pid.toString().padStart(5)} pts/0    00:00:00 ${proc.name}\n`
    })
    return result.trim()
  }

  private top(): string {
    const uptime = '12:34:56 up 2 days, 3:45, 1 user, load average: 0.15, 0.25, 0.30'
    const tasks = `Tasks: ${this.processes.length} total, 1 running, ${this.processes.length - 1} sleeping, 0 stopped, 0 zombie`
    const cpu = 'Cpu(s): 2.3%us, 1.2%sy, 0.0%ni, 96.1%id, 0.4%wa, 0.0%hi, 0.0%si, 0.0%st'
    const mem = 'Mem: 8192000k total, 4096000k used, 4096000k free, 256000k buffers'
    const swap = 'Swap: 2048000k total, 0k used, 2048000k free, 1024000k cached'
    
    let result = `top - ${uptime}\n${tasks}\n${cpu}\n${mem}\n${swap}\n\n`
    result += '  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND\n'
    
    this.processes.forEach(proc => {
      const virt = Math.floor(Math.random() * 100000) + 10000
      const res = Math.floor(virt * proc.memory / 100)
      const shr = Math.floor(res * 0.3)
      result += `${proc.pid.toString().padStart(5)} ${proc.user.padEnd(9)} 20   0 ${virt.toString().padStart(5)} ${res.toString().padStart(4)} ${shr.toString().padStart(4)} ${proc.status} ${proc.cpu.toFixed(1).padStart(4)} ${proc.memory.toFixed(1).padStart(4)} 0:00.${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${proc.name}\n`
    })
    
    return result.trim()
  }

  private kill(args: string[]): string {
    if (args.length === 0) {
      return 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]'
    }
    
    const pid = parseInt(args[0])
    const processIndex = this.processes.findIndex(p => p.pid === pid)
    
    if (processIndex === -1) {
      return `kill: (${pid}) - No such process`
    }
    
    if (this.processes[processIndex].user !== 'user' && this.processes[processIndex].user !== 'root') {
      return `kill: (${pid}) - Operation not permitted`
    }
    
    this.processes.splice(processIndex, 1)
    return ''
  }

  private whoami(): string {
    return this.environment.USER
  }

  private id(): string {
    return 'uid=1000(user) gid=1000(user) groups=1000(user),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),113(lpadmin),128(sambashare)'
  }

  private uname(args: string[]): string {
    if (args.includes('-a')) {
      return 'Linux ai-terminal 5.15.0-ai #1 SMP Wed Jan 1 12:00:00 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux'
    }
    return 'Linux'
  }

  private date(): string {
    return new Date().toString()
  }

  private uptime(): string {
    const uptime = Math.floor(Math.random() * 86400) + 3600 // 1-24 hours
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const load1 = (Math.random() * 2).toFixed(2)
    const load5 = (Math.random() * 2).toFixed(2)
    const load15 = (Math.random() * 2).toFixed(2)
    
    return `12:34:56 up ${hours}:${minutes.toString().padStart(2, '0')}, 1 user, load average: ${load1}, ${load5}, ${load15}`
  }

  private df(args: string[]): string {
    const human = args.includes('-h')
    
    let result = 'Filesystem     1K-blocks    Used Available Use% Mounted on\n'
    
    if (human) {
      result = 'Filesystem      Size  Used Avail Use% Mounted on\n'
      result += '/dev/sda1        20G  8.5G   11G  45% /\n'
      result += 'tmpfs           2.0G     0  2.0G   0% /dev/shm\n'
      result += '/dev/sda2       100G   45G   50G  48% /home\n'
    } else {
      result += '/dev/sda1     20971520 8912896 11534336  45% /\n'
      result += 'tmpfs          2097152       0  2097152   0% /dev/shm\n'
      result += '/dev/sda2    104857600 47185920 52428800  48% /home\n'
    }
    
    return result.trim()
  }

  private free(args: string[]): string {
    const human = args.includes('-h')
    
    if (human) {
      return `              total        used        free      shared  buff/cache   available
Mem:           7.8G        3.2G        1.5G        256M        3.1G        4.1G
Swap:          2.0G          0B        2.0G`
    }
    
    return `              total        used        free      shared  buff/cache   available
Mem:        8192000     3276800     1536000      262144     3179520     4194304
Swap:       2097152           0     2097152`
  }

  private history(): string {
    return this.commandHistory.map((cmd, index) => `${(index + 1).toString().padStart(4)} ${cmd}`).join('\n')
  }

  private env(): string {
    return Object.entries(this.environment).map(([key, value]) => `${key}=${value}`).join('\n')
  }

  private export(args: string[]): string {
    if (args.length === 0) {
      return this.env()
    }
    
    for (const arg of args) {
      const [key, value] = arg.split('=')
      if (key && value) {
        this.environment[key] = value
      }
    }
    
    return ''
  }

  private which(args: string[]): string {
    if (args.length === 0) {
      return 'which: missing argument'
    }
    
    const command = args[0]
    const commonCommands = ['ls', 'cat', 'grep', 'find', 'ps', 'top', 'kill', 'bash', 'sh', 'vim', 'nano', 'git']
    
    if (commonCommands.includes(command)) {
      return `/usr/bin/${command}`
    }
    
    return `which: no ${command} in (${this.environment.PATH})`
  }

  private man(args: string[]): string {
    if (args.length === 0) {
      return 'What manual page do you want?'
    }
    
    const command = args[0]
    
    const manPages: { [key: string]: string } = {
      'ls': `LS(1)                    User Commands                   LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List  information  about  the FILEs (the current directory by default).
       Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.

       -a, --all
              do not ignore entries starting with .

       -l     use a long listing format

EXAMPLES
       ls -la
              List all files in long format including hidden files`,
      
      'cat': `CAT(1)                   User Commands                   CAT(1)

NAME
       cat - concatenate files and print on the standard output

SYNOPSIS
       cat [OPTION]... [FILE]...

DESCRIPTION
       Concatenate FILE(s) to standard output.

EXAMPLES
       cat file.txt
              Display contents of file.txt`,
      
      'cd': `CD(1)                    Shell Builtin Commands         CD(1)

NAME
       cd - change directory

SYNOPSIS
       cd [dir]

DESCRIPTION
       Change the current directory to dir. The default dir is the value of the
       HOME shell variable.`
    }
    
    return manPages[command] || `No manual entry for ${command}`
  }

  private help(): string {
    return `AI-Powered Linux Terminal - Available Commands:

File Operations:
  ls [-la]           - list directory contents
  cd [dir]           - change directory
  pwd                - print working directory
  cat <file>         - display file contents
  mkdir <dir>        - create directory
  touch <file>       - create empty file
  rm [-rf] <file>    - remove files/directories
  cp <src> <dest>    - copy files
  mv <src> <dest>    - move/rename files
  find <path> [-name pattern] - find files

Text Processing:
  echo <text>        - display text
  grep <pattern> <file> - search text patterns

System Information:
  ps [aux]           - show running processes
  top                - display running processes
  kill <pid>         - terminate process
  whoami             - current username
  id                 - user and group IDs
  uname [-a]         - system information
  date               - current date and time
  uptime             - system uptime
  df [-h]            - disk space usage
  free [-h]          - memory usage

Environment:
  history            - command history
  env                - environment variables
  export VAR=value   - set environment variable
  which <command>    - locate command

Help:
  man <command>      - manual pages
  help               - this help message
  clear              - clear terminal

Use the AI assistant for command suggestions and explanations!`
  }

  getCurrentDirectory(): string {
    return this.currentDirectory
  }

  getPrompt(): string {
    const user = this.environment.USER
    const hostname = 'ai-terminal'
    const shortPath = this.currentDirectory.replace(this.environment.HOME, '~')
    return `${user}@${hostname}:${shortPath}$`
  }
}