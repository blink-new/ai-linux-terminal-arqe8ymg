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
      // File Operations
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
      case 'head':
        return this.head(args)
      case 'tail':
        return this.tail(args)
      case 'wc':
        return this.wc(args)
      case 'sort':
        return this.sort(args)
      case 'uniq':
        return this.uniq(args)
      case 'cut':
        return this.cut(args)
      case 'awk':
        return this.awk(args)
      case 'sed':
        return this.sed(args)
      case 'tr':
        return this.tr(args)
      case 'diff':
        return this.diff(args)
      case 'file':
        return this.file(args)
      case 'stat':
        return this.stat(args)
      case 'du':
        return this.du(args)
      case 'ln':
        return this.ln(args)
      case 'chmod':
        return this.chmod(args)
      case 'chown':
        return this.chown(args)
      case 'tar':
        return this.tar(args)
      case 'gzip':
        return this.gzip(args)
      case 'gunzip':
        return this.gunzip(args)
      case 'zip':
        return this.zip(args)
      case 'unzip':
        return this.unzip(args)
      
      // Process Management
      case 'ps':
        return this.ps(args)
      case 'top':
        return this.top()
      case 'htop':
        return this.htop()
      case 'kill':
        return this.kill(args)
      case 'killall':
        return this.killall(args)
      case 'jobs':
        return this.jobs()
      case 'bg':
        return this.bg(args)
      case 'fg':
        return this.fg(args)
      case 'nohup':
        return this.nohup(args)
      case 'screen':
        return this.screen(args)
      case 'tmux':
        return this.tmux(args)
      
      // System Information
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
      case 'lscpu':
        return this.lscpu()
      case 'lsblk':
        return this.lsblk()
      case 'lsusb':
        return this.lsusb()
      case 'lspci':
        return this.lspci()
      case 'mount':
        return this.mount(args)
      case 'umount':
        return this.umount(args)
      case 'fdisk':
        return this.fdisk(args)
      case 'lsof':
        return this.lsof(args)
      case 'netstat':
        return this.netstat(args)
      case 'ss':
        return this.ss(args)
      case 'iptables':
        return this.iptables(args)
      case 'systemctl':
        return this.systemctl(args)
      case 'service':
        return this.service(args)
      case 'crontab':
        return this.crontab(args)
      
      // Network Tools
      case 'ping':
        return this.ping(args)
      case 'wget':
        return this.wget(args)
      case 'curl':
        return this.curl(args)
      case 'ssh':
        return this.ssh(args)
      case 'scp':
        return this.scp(args)
      case 'rsync':
        return this.rsync(args)
      case 'nc':
        return this.nc(args)
      case 'telnet':
        return this.telnet(args)
      case 'nslookup':
        return this.nslookup(args)
      case 'dig':
        return this.dig(args)
      case 'host':
        return this.host(args)
      case 'traceroute':
        return this.traceroute(args)
      case 'mtr':
        return this.mtr(args)
      
      // Text Editors
      case 'vi':
      case 'vim':
        return this.vim(args)
      case 'nano':
        return this.nano(args)
      case 'emacs':
        return this.emacs(args)
      
      // Package Management
      case 'apt':
        return this.apt(args)
      case 'apt-get':
        return this.aptGet(args)
      case 'yum':
        return this.yum(args)
      case 'dnf':
        return this.dnf(args)
      case 'pacman':
        return this.pacman(args)
      case 'snap':
        return this.snap(args)
      case 'flatpak':
        return this.flatpak(args)
      
      // Development Tools
      case 'git':
        return this.git(args)
      case 'make':
        return this.make(args)
      case 'gcc':
        return this.gcc(args)
      case 'python':
      case 'python3':
        return this.python(args)
      case 'node':
        return this.node(args)
      case 'npm':
        return this.npm(args)
      case 'docker':
        return this.docker(args)
      case 'kubectl':
        return this.kubectl(args)
      
      // Environment
      case 'history':
        return this.history()
      case 'env':
        return this.env()
      case 'export':
        return this.export(args)
      case 'which':
        return this.which(args)
      case 'whereis':
        return this.whereis(args)
      case 'type':
        return this.type(args)
      case 'alias':
        return this.alias(args)
      case 'unalias':
        return this.unalias(args)
      case 'source':
      case '.':
        return this.source(args)
      
      // Help and Documentation
      case 'man':
        return this.man(args)
      case 'info':
        return this.info(args)
      case 'help':
        return this.help()
      case 'apropos':
        return this.apropos(args)
      case 'whatis':
        return this.whatis(args)
      
      // Miscellaneous
      case 'clear':
        return 'CLEAR'
      case 'exit':
        return this.exit()
      case 'logout':
        return this.logout()
      case 'su':
        return this.su(args)
      case 'sudo':
        return this.sudo(args)
      case 'passwd':
        return this.passwd(args)
      case 'sleep':
        return this.sleep(args)
      case 'watch':
        return this.watch(args)
      case 'yes':
        return this.yes(args)
      case 'seq':
        return this.seq(args)
      case 'bc':
        return this.bc(args)
      case 'cal':
        return this.cal(args)
      case 'factor':
        return this.factor(args)
      case 'fortune':
        return this.fortune()
      case 'cowsay':
        return this.cowsay(args)
      case 'figlet':
        return this.figlet(args)
      case 'banner':
        return this.banner(args)
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

  // Text Processing Commands
  private head(args: string[]): string {
    const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
    const file = args.find(arg => !arg.startsWith('-')) || ''
    
    if (!file) return 'head: missing file operand'
    
    const node = this.getNode(this.normalizePath(file))
    if (!node) return `head: cannot open '${file}' for reading: No such file or directory`
    if (node.type === 'directory') return `head: error reading '${file}': Is a directory`
    
    const content = node.content || ''
    return content.split('\\n').slice(0, lines).join('\\n')
  }

  private tail(args: string[]): string {
    const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
    const file = args.find(arg => !arg.startsWith('-')) || ''
    
    if (!file) return 'tail: missing file operand'
    
    const node = this.getNode(this.normalizePath(file))
    if (!node) return `tail: cannot open '${file}' for reading: No such file or directory`
    if (node.type === 'directory') return `tail: error reading '${file}': Is a directory`
    
    const content = node.content || ''
    const contentLines = content.split('\\n')
    return contentLines.slice(-lines).join('\\n')
  }

  private wc(args: string[]): string {
    const file = args.find(arg => !arg.startsWith('-')) || ''
    const showLines = args.includes('-l')
    const showWords = args.includes('-w')
    const showChars = args.includes('-c')
    const showAll = !showLines && !showWords && !showChars
    
    if (!file) return 'wc: missing file operand'
    
    const node = this.getNode(this.normalizePath(file))
    if (!node) return `wc: ${file}: No such file or directory`
    if (node.type === 'directory') return `wc: ${file}: Is a directory`
    
    const content = node.content || ''
    const lines = content.split('\\n').length
    const words = content.split(/\\s+/).filter(w => w).length
    const chars = content.length
    
    let result = ''
    if (showAll || showLines) result += lines.toString().padStart(8)
    if (showAll || showWords) result += words.toString().padStart(8)
    if (showAll || showChars) result += chars.toString().padStart(8)
    result += ` ${file}`
    
    return result.trim()
  }

  private sort(args: string[]): string {
    const file = args.find(arg => !arg.startsWith('-')) || ''
    const reverse = args.includes('-r')
    const numeric = args.includes('-n')
    
    if (!file) return 'sort: missing file operand'
    
    const node = this.getNode(this.normalizePath(file))
    if (!node) return `sort: cannot read: ${file}: No such file or directory`
    if (node.type === 'directory') return `sort: read failed: ${file}: Is a directory`
    
    const content = node.content || ''
    let lines = content.split('\\n')
    
    if (numeric) {
      lines.sort((a, b) => parseFloat(a) - parseFloat(b))
    } else {
      lines.sort()
    }
    
    if (reverse) lines.reverse()
    
    return lines.join('\\n')
  }

  private uniq(args: string[]): string {
    const file = args.find(arg => !arg.startsWith('-')) || ''
    const count = args.includes('-c')
    
    if (!file) return 'uniq: missing file operand'
    
    const node = this.getNode(this.normalizePath(file))
    if (!node) return `uniq: ${file}: No such file or directory`
    if (node.type === 'directory') return `uniq: ${file}: Is a directory`
    
    const content = node.content || ''
    const lines = content.split('\\n')
    const unique: string[] = []
    const counts: { [key: string]: number } = {}
    
    let prev = ''
    for (const line of lines) {
      if (line !== prev) {
        unique.push(line)
        counts[line] = (counts[line] || 0) + 1
        prev = line
      } else {
        counts[line]++
      }
    }
    
    if (count) {
      return unique.map(line => `${counts[line].toString().padStart(7)} ${line}`).join('\\n')
    }
    
    return unique.join('\\n')
  }

  private cut(args: string[]): string {
    const file = args[args.length - 1]
    const delimiter = args.includes('-d') ? args[args.indexOf('-d') + 1] : '\\t'
    const fields = args.includes('-f') ? args[args.indexOf('-f') + 1] : '1'
    
    if (!file || file.startsWith('-')) return 'cut: missing file operand'
    
    const node = this.getNode(this.normalizePath(file))
    if (!node) return `cut: ${file}: No such file or directory`
    if (node.type === 'directory') return `cut: ${file}: Is a directory`
    
    const content = node.content || ''
    const lines = content.split('\\n')
    const fieldNums = fields.split(',').map(f => parseInt(f) - 1)
    
    return lines.map(line => {
      const parts = line.split(delimiter)
      return fieldNums.map(i => parts[i] || '').join(delimiter)
    }).join('\\n')
  }

  private awk(args: string[]): string {
    if (args.length === 0) return 'awk: usage: awk program [file ...]'
    return 'awk: simulated - pattern scanning and processing language'
  }

  private sed(args: string[]): string {
    if (args.length === 0) return 'sed: usage: sed [OPTION]... {script-only-if-no-other-script} [input-file]...'
    return 'sed: simulated - stream editor for filtering and transforming text'
  }

  private tr(args: string[]): string {
    if (args.length < 2) return 'tr: usage: tr [OPTION]... SET1 [SET2]'
    return 'tr: simulated - translate or delete characters'
  }

  private diff(args: string[]): string {
    if (args.length < 2) return 'diff: missing operand after \\'diff\\''
    
    const file1 = args[0]
    const file2 = args[1]
    
    const node1 = this.getNode(this.normalizePath(file1))
    const node2 = this.getNode(this.normalizePath(file2))
    
    if (!node1) return `diff: ${file1}: No such file or directory`
    if (!node2) return `diff: ${file2}: No such file or directory`
    
    const content1 = node1.content || ''
    const content2 = node2.content || ''
    
    if (content1 === content2) return ''
    
    return `Files ${file1} and ${file2} differ`
  }

  private file(args: string[]): string {
    if (args.length === 0) return 'file: missing file operand'
    
    const results: string[] = []
    for (const arg of args) {
      const node = this.getNode(this.normalizePath(arg))
      if (!node) {
        results.push(`${arg}: cannot open (No such file or directory)`)
      } else if (node.type === 'directory') {
        results.push(`${arg}: directory`)
      } else {
        const ext = arg.split('.').pop()?.toLowerCase()
        let type = 'ASCII text'
        if (ext === 'jpg' || ext === 'jpeg') type = 'JPEG image data'
        else if (ext === 'png') type = 'PNG image data'
        else if (ext === 'pdf') type = 'PDF document'
        else if (ext === 'zip') type = 'Zip archive data'
        results.push(`${arg}: ${type}`)
      }
    }
    return results.join('\\n')
  }

  private stat(args: string[]): string {
    if (args.length === 0) return 'stat: missing operand'
    
    const file = args[0]
    const node = this.getNode(this.normalizePath(file))
    
    if (!node) return `stat: cannot stat '${file}': No such file or directory`
    
    const size = node.size
    const blocks = Math.ceil(size / 512)
    const type = node.type === 'directory' ? 'directory' : 'regular file'
    
    return `  File: ${file}
  Size: ${size}\\tBlocks: ${blocks}\\tIO Block: 4096   ${type}
Device: 801h/2049d\\tInode: 123456\\tLinks: 1
Access: (${node.permissions.slice(1)})  Uid: ( 1000/    user)   Gid: ( 1000/    user)
Access: ${node.modified.toISOString()}
Modify: ${node.modified.toISOString()}
Change: ${node.modified.toISOString()}`
  }

  private du(args: string[]): string {
    const human = args.includes('-h')
    const path = args.find(arg => !arg.startsWith('-')) || this.currentDirectory
    
    const node = this.getNode(this.normalizePath(path))
    if (!node) return `du: cannot access '${path}': No such file or directory`
    
    let totalSize = node.size
    
    if (node.type === 'directory' && node.children) {
      for (const child of Object.values(node.children)) {
        totalSize += child.size
      }
    }
    
    const size = human ? this.formatFileSize(totalSize) : Math.ceil(totalSize / 1024).toString()
    return `${size}\\t${path}`
  }

  private ln(args: string[]): string {
    if (args.length < 2) return 'ln: missing destination file operand'
    
    const symbolic = args.includes('-s')
    const source = args[args.length - 2]
    const dest = args[args.length - 1]
    
    if (symbolic) {
      return `ln: symbolic links simulated - would create symlink ${dest} -> ${source}`
    }
    
    return `ln: hard links simulated - would create hard link ${dest} -> ${source}`
  }

  private chmod(args: string[]): string {
    if (args.length < 2) return 'chmod: missing operand'
    
    const mode = args[0]
    const files = args.slice(1)
    
    for (const file of files) {
      const node = this.getNode(this.normalizePath(file))
      if (!node) return `chmod: cannot access '${file}': No such file or directory`
      
      // Simulate permission change
      if (mode.match(/^[0-7]{3}$/)) {
        const perms = node.type === 'directory' ? 'd' : '-'
        node.permissions = perms + this.octalToPermissions(mode)
      }
    }
    
    return ''
  }

  private chown(args: string[]): string {
    if (args.length < 2) return 'chown: missing operand'
    
    const owner = args[0]
    const files = args.slice(1)
    
    for (const file of files) {
      const node = this.getNode(this.normalizePath(file))
      if (!node) return `chown: cannot access '${file}': No such file or directory`
      
      const [user, group] = owner.split(':')
      if (user) node.owner = user
      if (group) node.group = group
    }
    
    return ''
  }

  private octalToPermissions(octal: string): string {
    const perms = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx']
    return octal.split('').map(digit => perms[parseInt(digit)]).join('')
  }

  // Archive Commands
  private tar(args: string[]): string {
    if (args.length === 0) return 'tar: usage: tar [OPTION...] [FILE]...'
    
    const create = args.includes('-c')
    const extract = args.includes('-x')
    const list = args.includes('-t')
    const verbose = args.includes('-v')
    const file = args.includes('-f') ? args[args.indexOf('-f') + 1] : null
    
    if (create) return `tar: simulated - would create archive ${file || 'archive.tar'}`
    if (extract) return `tar: simulated - would extract archive ${file || 'archive.tar'}`
    if (list) return `tar: simulated - would list contents of ${file || 'archive.tar'}`
    
    return 'tar: You must specify one of the \\'-Acdtrux\\', \\'--delete\\' or \\'--test-label\\' options'
  }

  private gzip(args: string[]): string {
    if (args.length === 0) return 'gzip: usage: gzip [OPTION]... [FILE]...'
    return `gzip: simulated - would compress ${args.join(', ')}`
  }

  private gunzip(args: string[]): string {
    if (args.length === 0) return 'gunzip: usage: gunzip [OPTION]... [FILE]...'
    return `gunzip: simulated - would decompress ${args.join(', ')}`
  }

  private zip(args: string[]): string {
    if (args.length === 0) return 'zip: usage: zip [options] zipfile list'
    return `zip: simulated - would create zip archive`
  }

  private unzip(args: string[]): string {
    if (args.length === 0) return 'unzip: usage: unzip [options] zipfile'
    return `unzip: simulated - would extract zip archive`
  }

  // Process Management
  private htop(): string {
    return this.top() + '\\n\\n(htop simulation - interactive process viewer)'
  }

  private killall(args: string[]): string {
    if (args.length === 0) return 'killall: usage: killall [-Z CONTEXT] [-u USER] [ -eIgiqrvw ] [ -SIGNAL ] NAME...'
    
    const processName = args[0]
    const killed = this.processes.filter(p => p.name === processName)
    
    if (killed.length === 0) {
      return `killall: ${processName}: no process found`
    }
    
    this.processes = this.processes.filter(p => p.name !== processName)
    return `killall: killed ${killed.length} process(es)`
  }

  private jobs(): string {
    return '[1]+  Running                 background-job &'
  }

  private bg(args: string[]): string {
    const jobId = args[0] || '1'
    return `[${jobId}]+ background-job &`
  }

  private fg(args: string[]): string {
    const jobId = args[0] || '1'
    return `[${jobId}]+ background-job`
  }

  private nohup(args: string[]): string {
    if (args.length === 0) return 'nohup: usage: nohup COMMAND [ARG]...'
    return `nohup: appending output to 'nohup.out'`
  }

  private screen(args: string[]): string {
    if (args.length === 0) return 'screen: simulated - terminal multiplexer'
    return `screen: simulated - would start screen session`
  }

  private tmux(args: string[]): string {
    if (args.length === 0) return 'tmux: simulated - terminal multiplexer'
    return `tmux: simulated - would start tmux session`
  }

  // System Information
  private lscpu(): string {
    return `Architecture:        x86_64
CPU op-mode(s):      32-bit, 64-bit
Byte Order:          Little Endian
CPU(s):              4
On-line CPU(s) list: 0-3
Thread(s) per core:  2
Core(s) per socket:  2
Socket(s):           1
NUMA node(s):        1
Vendor ID:           GenuineIntel
CPU family:          6
Model:               142
Model name:          Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz
Stepping:            10
CPU MHz:             1800.000
CPU max MHz:         3400.0000
CPU min MHz:         400.0000
BogoMIPS:            3600.00
Virtualization:      VT-x
L1d cache:           32K
L1i cache:           32K
L2 cache:            256K
L3 cache:            6144K
NUMA node0 CPU(s):   0-3`
  }

  private lsblk(): string {
    return `NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   20G  0 disk 
├─sda1   8:1    0   19G  0 part /
└─sda2   8:2    0    1G  0 part [SWAP]
sr0     11:0    1 1024M  0 rom`
  }

  private lsusb(): string {
    return `Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 003: ID 8087:0a2b Intel Corp. 
Bus 001 Device 002: ID 04f2:b5ce Chicony Electronics Co., Ltd 
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub`
  }

  private lspci(): string {
    return `00:00.0 Host bridge: Intel Corporation Device 5904 (rev 02)
00:02.0 VGA compatible controller: Intel Corporation Device 5916 (rev 02)
00:14.0 USB controller: Intel Corporation Device 9d2f (rev 21)
00:16.0 Communication controller: Intel Corporation Device 9d3a (rev 21)
00:17.0 SATA controller: Intel Corporation Device 9d03 (rev 21)
00:1c.0 PCI bridge: Intel Corporation Device 9d10 (rev f1)
00:1f.0 ISA bridge: Intel Corporation Device 9d48 (rev 21)
00:1f.2 Memory controller: Intel Corporation Device 9d21 (rev 21)
00:1f.3 Audio device: Intel Corporation Device 9d70 (rev 21)`
  }

  private mount(args: string[]): string {
    if (args.length === 0) {
      return `/dev/sda1 on / type ext4 (rw,relatime,errors=remount-ro)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,noexec,relatime,size=819200k,mode=755)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)`
    }
    return `mount: simulated - would mount ${args.join(' ')}`
  }

  private umount(args: string[]): string {
    if (args.length === 0) return 'umount: usage: umount [-hV]'
    return `umount: simulated - would unmount ${args[0]}`
  }

  private fdisk(args: string[]): string {
    if (args.includes('-l')) {
      return `Disk /dev/sda: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x12345678

Device     Boot    Start      End  Sectors  Size Id Type
/dev/sda1  *        2048 39845887 39843840   19G 83 Linux
/dev/sda2       39845888 41943039  2097152    1G 82 Linux swap / Solaris`
    }
    return 'fdisk: usage: fdisk [options] <disk>'
  }

  private lsof(args: string[]): string {
    return `COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF    NODE NAME
systemd      1 root  cwd    DIR    8,1     4096       2 /
systemd      1 root  rtd    DIR    8,1     4096       2 /
systemd      1 root  txt    REG    8,1  1595792  131586 /lib/systemd/systemd
bash       123 user  cwd    DIR    8,1     4096  262145 /home/user
bash       123 user  rtd    DIR    8,1     4096       2 /
bash       123 user  txt    REG    8,1  1113504  134567 /bin/bash`
  }

  private netstat(args: string[]): string {
    const showAll = args.includes('-a')
    const showTcp = args.includes('-t')
    const showUdp = args.includes('-u')
    const showListening = args.includes('-l')
    const showNumeric = args.includes('-n')
    
    let result = 'Active Internet connections'
    if (showListening) result += ' (only servers)'
    result += '\\n'
    
    result += 'Proto Recv-Q Send-Q Local Address           Foreign Address         State\\n'
    result += 'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN\\n'
    result += 'tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN\\n'
    result += 'tcp        0      0 192.168.1.100:22        192.168.1.1:54321       ESTABLISHED\\n'
    
    return result.trim()
  }

  private ss(args: string[]): string {
    return `Netid  State      Recv-Q Send-Q Local Address:Port               Peer Address:Port              
tcp    LISTEN     0      128          *:22                       *:*                  
tcp    LISTEN     0      128    127.0.0.1:3000                   *:*                  
tcp    ESTAB      0      0      192.168.1.100:22               192.168.1.1:54321`
  }

  private iptables(args: string[]): string {
    if (args.includes('-L')) {
      return `Chain INPUT (policy ACCEPT)
target     prot opt source               destination         

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination`
    }
    return 'iptables: simulated - packet filtering and NAT'
  }

  private systemctl(args: string[]): string {
    if (args.length === 0) return 'systemctl: usage: systemctl [OPTIONS...] {COMMAND} ...'
    
    const command = args[0]
    const service = args[1]
    
    switch (command) {
      case 'status':
        return `● ${service || 'system'}.service - System Service
   Loaded: loaded (/lib/systemd/system/${service || 'system'}.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2024-01-01 12:00:00 UTC; 2h 30min ago
 Main PID: 1234 (${service || 'system'})
    Tasks: 1 (limit: 4915)
   Memory: 2.3M
   CGroup: /system.slice/${service || 'system'}.service
           └─1234 /usr/bin/${service || 'system'}`
      case 'list-units':
        return `UNIT                     LOAD   ACTIVE SUB     DESCRIPTION
system.service           loaded active running System Service
network.service          loaded active running Network Service
ssh.service              loaded active running OpenBSD Secure Shell server`
      case 'start':
      case 'stop':
      case 'restart':
      case 'reload':
        return `systemctl: simulated - would ${command} ${service || 'service'}`
      default:
        return `systemctl: unknown command '${command}'`
    }
  }

  private service(args: string[]): string {
    if (args.length < 2) return 'service: usage: service < option > | --status-all | [ service_name [ command | --full-restart ] ]'
    
    const serviceName = args[0]
    const command = args[1]
    
    return `service: simulated - would ${command} ${serviceName}`
  }

  private crontab(args: string[]): string {
    if (args.includes('-l')) {
      return `# Edit this file to introduce tasks to be run by cron.
# 
# m h  dom mon dow   command
0 2 * * * /usr/bin/backup.sh
30 6 * * 1 /usr/bin/weekly-report.sh`
    }
    if (args.includes('-e')) {
      return 'crontab: simulated - would open crontab editor'
    }
    return 'crontab: usage: crontab [-u user] file'
  }

  // Network Tools
  private ping(args: string[]): string {
    const host = args[0] || 'localhost'
    const count = args.includes('-c') ? parseInt(args[args.indexOf('-c') + 1]) || 4 : 4
    
    let result = `PING ${host} (127.0.0.1) 56(84) bytes of data.\\n`
    
    for (let i = 1; i <= count; i++) {
      const time = (Math.random() * 10 + 1).toFixed(1)
      result += `64 bytes from ${host} (127.0.0.1): icmp_seq=${i} ttl=64 time=${time} ms\\n`
    }
    
    result += `\\n--- ${host} ping statistics ---\\n`
    result += `${count} packets transmitted, ${count} received, 0% packet loss, time ${count * 1000}ms\\n`
    result += `rtt min/avg/max/mdev = 1.0/5.5/10.0/2.5 ms`
    
    return result
  }

  private wget(args: string[]): string {
    if (args.length === 0) return 'wget: missing URL'
    const url = args[0]
    return `wget: simulated - would download ${url}`
  }

  private curl(args: string[]): string {
    if (args.length === 0) return 'curl: try \\'curl --help\\' for more information'
    const url = args[args.length - 1]
    return `curl: simulated - would fetch ${url}`
  }

  private ssh(args: string[]): string {
    if (args.length === 0) return 'ssh: usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] destination [command]'
    const destination = args[0]
    return `ssh: simulated - would connect to ${destination}`
  }

  private scp(args: string[]): string {
    if (args.length < 2) return 'scp: usage: scp [-346BCpqrv] [-c cipher] [-F ssh_config] source target'
    return `scp: simulated - would copy files securely`
  }

  private rsync(args: string[]): string {
    if (args.length < 2) return 'rsync: usage: rsync [OPTION]... SRC [SRC]... DEST'
    return `rsync: simulated - would synchronize files`
  }

  private nc(args: string[]): string {
    if (args.length === 0) return 'nc: usage: nc [-46bCDdhjklnrStUuvZz] [-I length] [-i interval] hostname port'
    return `nc: simulated - netcat utility`
  }

  private telnet(args: string[]): string {
    const host = args[0] || 'localhost'
    const port = args[1] || '23'
    return `telnet: simulated - would connect to ${host}:${port}`
  }

  private nslookup(args: string[]): string {
    const host = args[0] || 'example.com'
    return `Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	${host}
Address: 93.184.216.34`
  }

  private dig(args: string[]): string {
    const host = args[0] || 'example.com'
    return `; <<>> DiG 9.16.1-Ubuntu <<>> ${host}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;${host}.			IN	A

;; ANSWER SECTION:
${host}.		300	IN	A	93.184.216.34

;; Query time: 15 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Mon Jan 01 12:00:00 UTC 2024
;; MSG SIZE  rcvd: 55`
  }

  private host(args: string[]): string {
    const hostname = args[0] || 'example.com'
    return `${hostname} has address 93.184.216.34
${hostname} has IPv6 address 2606:2800:220:1:248:1893:25c8:1946
${hostname} mail is handled by 0 .`
  }

  private traceroute(args: string[]): string {
    const host = args[0] || 'example.com'
    return `traceroute to ${host} (93.184.216.34), 30 hops max, 60 byte packets
 1  gateway (192.168.1.1)  1.234 ms  1.123 ms  1.456 ms
 2  10.0.0.1 (10.0.0.1)  5.678 ms  5.432 ms  5.789 ms
 3  * * *
 4  93.184.216.34 (93.184.216.34)  15.123 ms  15.456 ms  15.789 ms`
  }

  private mtr(args: string[]): string {
    const host = args[0] || 'example.com'
    return `                             My traceroute  [v0.93]
ai-terminal (192.168.1.100)                    Mon Jan  1 12:00:00 2024
Keys:  Help   Display mode   Restart statistics   Order of fields   quit
                                           Packets               Pings
 Host                                    Loss%   Snt   Last   Avg  Best  Wrst StDev
 1. gateway                               0.0%    10    1.2   1.3   1.1   1.5   0.1
 2. 10.0.0.1                              0.0%    10    5.6   5.7   5.4   6.1   0.2
 3. ${host}                               0.0%    10   15.1  15.2  14.9  15.8   0.3`
  }

  // Text Editors
  private vim(args: string[]): string {
    const file = args[0] || ''
    return `vim: simulated - would open ${file || 'new file'} in Vim editor
(Use :q to quit, :w to save, :wq to save and quit)`
  }

  private nano(args: string[]): string {
    const file = args[0] || ''
    return `nano: simulated - would open ${file || 'new file'} in nano editor
(Use Ctrl+X to exit, Ctrl+O to save)`
  }

  private emacs(args: string[]): string {
    const file = args[0] || ''
    return `emacs: simulated - would open ${file || 'new file'} in Emacs editor
(Use Ctrl+X Ctrl+C to quit, Ctrl+X Ctrl+S to save)`
  }

  // Package Management
  private apt(args: string[]): string {
    if (args.length === 0) return 'apt: usage: apt [options] command'
    
    const command = args[0]
    const package_name = args[1]
    
    switch (command) {
      case 'update':
        return 'apt: simulated - would update package lists'
      case 'upgrade':
        return 'apt: simulated - would upgrade installed packages'
      case 'install':
        return `apt: simulated - would install ${package_name || 'package'}`
      case 'remove':
        return `apt: simulated - would remove ${package_name || 'package'}`
      case 'search':
        return `apt: simulated - would search for ${package_name || 'package'}`
      case 'list':
        return 'apt: simulated - would list packages'
      default:
        return `apt: unknown command '${command}'`
    }
  }

  private aptGet(args: string[]): string {
    return this.apt(args).replace('apt:', 'apt-get:')
  }

  private yum(args: string[]): string {
    if (args.length === 0) return 'yum: usage: yum [options] COMMAND'
    return `yum: simulated - Red Hat package manager command: ${args.join(' ')}`
  }

  private dnf(args: string[]): string {
    if (args.length === 0) return 'dnf: usage: dnf [options] COMMAND'
    return `dnf: simulated - Fedora package manager command: ${args.join(' ')}`
  }

  private pacman(args: string[]): string {
    if (args.length === 0) return 'pacman: usage: pacman <operation> [...]'
    return `pacman: simulated - Arch Linux package manager command: ${args.join(' ')}`
  }

  private snap(args: string[]): string {
    if (args.length === 0) return 'snap: usage: snap <command> [<options>...]'
    return `snap: simulated - Ubuntu snap package manager command: ${args.join(' ')}`
  }

  private flatpak(args: string[]): string {
    if (args.length === 0) return 'flatpak: usage: flatpak [OPTION…] COMMAND'
    return `flatpak: simulated - universal package manager command: ${args.join(' ')}`
  }

  // Development Tools
  private git(args: string[]): string {
    if (args.length === 0) return 'git: usage: git [--version] [--help] [-C <path>] [-c <name>=<value>] [<command> [<args>]]'
    
    const command = args[0]
    
    switch (command) {
      case 'status':
        return `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`
      case 'log':
        return `commit abc123def456 (HEAD -> main, origin/main)
Author: User <user@example.com>
Date:   Mon Jan 1 12:00:00 2024 +0000

    Initial commit`
      case 'branch':
        return '* main'
      case 'clone':
        return `git: simulated - would clone ${args[1] || 'repository'}`
      case 'add':
        return `git: simulated - would add ${args.slice(1).join(' ') || 'files'} to staging`
      case 'commit':
        return 'git: simulated - would commit changes'
      case 'push':
        return 'git: simulated - would push to remote repository'
      case 'pull':
        return 'git: simulated - would pull from remote repository'
      default:
        return `git: simulated - git command: ${args.join(' ')}`
    }
  }

  private make(args: string[]): string {
    if (args.length === 0) {
      return `make: *** No targets specified and no makefile found.  Stop.`
    }
    return `make: simulated - would build target: ${args[0]}`
  }

  private gcc(args: string[]): string {
    if (args.length === 0) return 'gcc: fatal error: no input files'
    return `gcc: simulated - would compile ${args.join(' ')}`
  }

  private python(args: string[]): string {
    if (args.length === 0) {
      return `Python 3.9.2 (default, Feb 28 2021, 17:03:44) 
[GCC 10.2.1 20210110] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> (interactive mode simulated)`
    }
    return `python: simulated - would execute ${args[0]}`
  }

  private node(args: string[]): string {
    if (args.length === 0) {
      return `Welcome to Node.js v16.14.0.
Type ".help" for more information.
> (interactive mode simulated)`
    }
    return `node: simulated - would execute ${args[0]}`
  }

  private npm(args: string[]): string {
    if (args.length === 0) return 'npm: usage: npm <command>'
    
    const command = args[0]
    
    switch (command) {
      case 'install':
        return `npm: simulated - would install ${args[1] || 'dependencies'}`
      case 'start':
        return 'npm: simulated - would start application'
      case 'test':
        return 'npm: simulated - would run tests'
      case 'version':
        return '8.5.0'
      default:
        return `npm: simulated - npm command: ${args.join(' ')}`
    }
  }

  private docker(args: string[]): string {
    if (args.length === 0) return 'docker: usage: docker [OPTIONS] COMMAND'
    
    const command = args[0]
    
    switch (command) {
      case 'ps':
        return `CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES`
      case 'images':
        return `REPOSITORY   TAG       IMAGE ID       CREATED       SIZE`
      case 'run':
        return `docker: simulated - would run container ${args[1] || 'image'}`
      case 'build':
        return 'docker: simulated - would build image'
      default:
        return `docker: simulated - docker command: ${args.join(' ')}`
    }
  }

  private kubectl(args: string[]): string {
    if (args.length === 0) return 'kubectl: usage: kubectl [flags] [options]'
    return `kubectl: simulated - Kubernetes command: ${args.join(' ')}`
  }

  // Environment Commands
  private whereis(args: string[]): string {
    if (args.length === 0) return 'whereis: usage: whereis [-bmsu] [-BMS directory... -f] filename...'
    
    const command = args[0]
    const commonCommands = ['ls', 'cat', 'grep', 'find', 'ps', 'top', 'kill', 'bash', 'sh', 'vim', 'nano', 'git']
    
    if (commonCommands.includes(command)) {
      return `${command}: /usr/bin/${command} /usr/share/man/man1/${command}.1.gz`
    }
    
    return `${command}:`
  }

  private type(args: string[]): string {
    if (args.length === 0) return 'type: usage: type [-afptP] name [name ...]'
    
    const command = args[0]
    const builtins = ['cd', 'pwd', 'echo', 'export', 'history', 'help']
    
    if (builtins.includes(command)) {
      return `${command} is a shell builtin`
    }
    
    const commonCommands = ['ls', 'cat', 'grep', 'find', 'ps', 'top', 'kill', 'bash', 'sh', 'vim', 'nano', 'git']
    if (commonCommands.includes(command)) {
      return `${command} is /usr/bin/${command}`
    }
    
    return `bash: type: ${command}: not found`
  }

  private alias(args: string[]): string {
    if (args.length === 0) {
      return `alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'`
    }
    
    const aliasDefinition = args.join(' ')
    return `alias: simulated - would create alias: ${aliasDefinition}`
  }

  private unalias(args: string[]): string {
    if (args.length === 0) return 'unalias: usage: unalias [-a] name [name ...]'
    return `unalias: simulated - would remove alias: ${args[0]}`
  }

  private source(args: string[]): string {
    if (args.length === 0) return 'source: usage: source filename [arguments]'
    return `source: simulated - would execute ${args[0]}`
  }

  // Help and Documentation
  private info(args: string[]): string {
    if (args.length === 0) return 'info: usage: info [OPTION]... [MENU-ITEM...]'
    return `info: simulated - would show info page for ${args[0]}`
  }

  private apropos(args: string[]): string {
    if (args.length === 0) return 'apropos: usage: apropos [-dalv?V] [-e|-w|-r] [-s list] [-m system] [-M path] [-L locale] [-C file] keyword ...'
    
    const keyword = args[0]
    return `${keyword} (1)              - search the manual page names and descriptions
${keyword} (3)              - library function
${keyword} (8)              - system administration command`
  }

  private whatis(args: string[]): string {
    if (args.length === 0) return 'whatis: usage: whatis [-dlv?V] [-r|-w] [-s list] [-m system] [-M path] [-L locale] [-C file] name ...'
    
    const command = args[0]
    const descriptions: { [key: string]: string } = {
      'ls': 'ls (1) - list directory contents',
      'cat': 'cat (1) - concatenate files and print on the standard output',
      'grep': 'grep (1) - print lines matching a pattern',
      'find': 'find (1) - search for files in a directory hierarchy',
      'ps': 'ps (1) - report a snapshot of the current processes',
      'top': 'top (1) - display Linux processes'
    }
    
    return descriptions[command] || `${command}: nothing appropriate.`
  }

  // Miscellaneous Commands
  private exit(): string {
    return 'exit: simulated - would exit terminal'
  }

  private logout(): string {
    return 'logout: simulated - would logout user'
  }

  private su(args: string[]): string {
    const user = args[0] || 'root'
    return `su: simulated - would switch to user ${user}`
  }

  private sudo(args: string[]): string {
    if (args.length === 0) return 'sudo: usage: sudo -h | -K | -k | -V'
    return `sudo: simulated - would execute as root: ${args.join(' ')}`
  }

  private passwd(args: string[]): string {
    const user = args[0] || this.environment.USER
    return `passwd: simulated - would change password for ${user}`
  }

  private sleep(args: string[]): string {
    const seconds = args[0] || '1'
    return `sleep: simulated - would sleep for ${seconds} seconds`
  }

  private watch(args: string[]): string {
    if (args.length === 0) return 'watch: usage: watch [-dhvt] [-n <seconds>] [--differences[=cumulative]] [--help] [--interval=<seconds>] [--no-title] [--version] <command>'
    return `watch: simulated - would watch command: ${args.join(' ')}`
  }

  private yes(args: string[]): string {
    const text = args.join(' ') || 'y'
    return `${text}\\n${text}\\n${text}\\n... (infinite output simulated)`
  }

  private seq(args: string[]): string {
    if (args.length === 0) return 'seq: usage: seq [OPTION]... LAST'
    
    const last = parseInt(args[args.length - 1]) || 10
    const first = args.length > 1 ? parseInt(args[0]) || 1 : 1
    const step = args.length > 2 ? parseInt(args[1]) || 1 : 1
    
    const result: string[] = []
    for (let i = first; i <= last; i += step) {
      result.push(i.toString())
    }
    
    return result.join('\\n')
  }

  private bc(args: string[]): string {
    if (args.length === 0) {
      return `bc 1.07.1
Copyright 1991-1994, 1997, 1998, 2000, 2004, 2006, 2008, 2012-2017 Free Software Foundation, Inc.
This is free software with ABSOLUTELY NO WARRANTY.
For details type \`warranty'. 
(calculator mode simulated)`
    }
    return 'bc: simulated - arbitrary precision calculator'
  }

  private cal(args: string[]): string {
    const now = new Date()
    const month = args[0] ? parseInt(args[0]) : now.getMonth() + 1
    const year = args[1] ? parseInt(args[1]) : now.getFullYear()
    
    return `    January ${year}
Su Mo Tu We Th Fr Sa
                1  2
 3  4  5  6  7  8  9
10 11 12 13 14 15 16
17 18 19 20 21 22 23
24 25 26 27 28 29 30
31`
  }

  private factor(args: string[]): string {
    if (args.length === 0) return 'factor: usage: factor [NUMBER]...'
    
    const number = parseInt(args[0])
    if (isNaN(number)) return `factor: '${args[0]}' is not a valid positive integer`
    
    return `${number}: ${number} (simulated factorization)`
  }

  private fortune(): string {
    const fortunes = [
      'The best way to predict the future is to invent it.',
      'Life is what happens to you while you\\'re busy making other plans.',
      'The only way to do great work is to love what you do.',
      'Innovation distinguishes between a leader and a follower.',
      'Stay hungry, stay foolish.',
      'The future belongs to those who believe in the beauty of their dreams.'
    ]
    
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  private cowsay(args: string[]): string {
    const message = args.join(' ') || 'Hello, World!'
    const length = message.length
    const border = '-'.repeat(length + 2)
    
    return ` ${border}
< ${message} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`
  }

  private figlet(args: string[]): string {
    const text = args.join(' ') || 'Hello'
    
    // Simple ASCII art simulation
    if (text.toLowerCase() === 'hello') {
      return ` _   _      _ _       
| | | |    | | |      
| |_| | ___| | | ___  
|  _  |/ _ \\ | |/ _ \\ 
| | | |  __/ | | (_) |
\\_| |_/\\___|_|_|\\___/`
    }
    
    return `figlet: simulated - would create ASCII art for "${text}"`
  }

  private banner(args: string[]): string {
    const text = args.join(' ') || 'BANNER'
    return `banner: simulated - would create large banner text for "${text}"`
  }

  private help(): string {
    return `AI-Powered Linux Terminal - Available Commands:

File Operations:
  ls [-la]           - list directory contents
  cd [dir]           - change directory
  pwd                - print working directory
  cat <file>         - display file contents
  head/tail [-n N]   - show first/last N lines
  wc [-lwc] <file>   - word, line, character count
  sort [-rn] <file>  - sort lines in file
  uniq [-c] <file>   - report or omit repeated lines
  cut -f N <file>    - extract columns from file
  grep <pattern>     - search text patterns
  find <path>        - find files and directories
  diff <file1> <file2> - compare files
  file <file>        - determine file type
  stat <file>        - display file statistics
  du [-h] [path]     - disk usage
  mkdir <dir>        - create directory
  touch <file>       - create empty file
  rm [-rf] <file>    - remove files/directories
  cp <src> <dest>    - copy files
  mv <src> <dest>    - move/rename files
  ln [-s] <src> <dest> - create links
  chmod <mode> <file> - change permissions
  chown <user> <file> - change ownership

Archive & Compression:
  tar [-cxtf] <file> - archive files
  gzip/gunzip <file> - compress/decompress
  zip/unzip <file>   - create/extract zip archives

Process Management:
  ps [aux]           - show running processes
  top/htop           - display running processes
  kill <pid>         - terminate process
  killall <name>     - kill processes by name
  jobs               - show active jobs
  bg/fg [job]        - background/foreground jobs
  nohup <command>    - run command immune to hangups

System Information:
  whoami             - current username
  id                 - user and group IDs
  uname [-a]         - system information
  date               - current date and time
  uptime             - system uptime
  df [-h]            - disk space usage
  free [-h]          - memory usage
  lscpu              - CPU information
  lsblk              - block devices
  lsusb/lspci        - USB/PCI devices
  mount/umount       - mount/unmount filesystems
  lsof               - list open files
  netstat/ss         - network connections

Network Tools:
  ping <host>        - test network connectivity
  wget/curl <url>    - download files
  ssh <host>         - secure shell
  scp <src> <dest>   - secure copy
  nslookup/dig <host> - DNS lookup
  traceroute <host>  - trace network path

Text Editors:
  vim/nano/emacs     - text editors

Package Management:
  apt/yum/dnf        - package managers
  snap/flatpak       - universal packages

Development:
  git                - version control
  make               - build automation
  gcc                - C compiler
  python/node        - interpreters
  npm                - Node.js package manager
  docker             - containerization

Environment:
  history            - command history
  env                - environment variables
  export VAR=value   - set environment variable
  which/whereis      - locate commands
  alias/unalias      - command aliases
  source <file>      - execute script

Utilities:
  echo <text>        - display text
  sleep <seconds>    - pause execution
  watch <command>    - repeat command
  cal                - calendar
  bc                 - calculator
  seq <start> <end>  - sequence of numbers
  fortune            - random quote
  cowsay <text>      - ASCII cow
  figlet <text>      - ASCII art text

Help:
  man <command>      - manual pages
  info <command>     - info documents
  help               - this help message
  apropos <keyword>  - search manual descriptions
  whatis <command>   - brief command description
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