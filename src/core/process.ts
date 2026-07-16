import { spawn, type ChildProcess } from 'node:child_process'

export interface ProcessResult {
  exitCode: number
  signal: NodeJS.Signals | null
  stdout: string
  stderr: string
  timedOut: boolean
}

export interface ProcessOptions {
  cwd: string
  environment?: NodeJS.ProcessEnv
  input?: string
  timeoutMs: number
  killGraceMs?: number
  outputLimit?: number
}

export async function runProcess(
  executable: string,
  args: string[],
  options: ProcessOptions,
): Promise<ProcessResult> {
  const killGraceMs = options.killGraceMs ?? 2_000
  const outputLimit = options.outputLimit ?? 12_000

  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: options.cwd,
      env: options.environment,
      detached: process.platform !== 'win32',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let settled = false
    let forceKill: NodeJS.Timeout | undefined

    const timeout = setTimeout(() => {
      timedOut = true
      signalProcessTree(child, 'SIGTERM')
      forceKill = setTimeout(() => signalProcessTree(child, 'SIGKILL'), killGraceMs)
    }, options.timeoutMs)

    const cleanup = (): void => {
      clearTimeout(timeout)
      if (forceKill) clearTimeout(forceKill)
    }

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      stdout = boundedOutput(stdout + chunk, outputLimit)
    })
    child.stderr.on('data', (chunk: string) => {
      stderr = boundedOutput(stderr + chunk, outputLimit)
    })
    child.on('error', (error) => {
      if (settled) return
      settled = true
      cleanup()
      reject(error)
    })
    child.on('close', (code, signal) => {
      if (settled) return
      settled = true
      cleanup()
      resolve({
        exitCode: code ?? 1,
        signal,
        stdout,
        stderr,
        timedOut,
      })
    })
    child.stdin.on('error', () => {
      // The child may exit before consuming input; close/error determines the result.
    })
    child.stdin.end(options.input)
  })
}

function signalProcessTree(child: ChildProcess, signal: NodeJS.Signals): void {
  if (!child.pid) return
  if (process.platform !== 'win32') {
    try {
      process.kill(-child.pid, signal)
      return
    } catch {
      // Fall back to signaling the direct child if the process group is already gone.
    }
  }
  try {
    child.kill(signal)
  } catch {
    // A concurrent exit is already the desired outcome.
  }
}

function boundedOutput(value: string, limit: number): string {
  return value.length <= limit ? value : value.slice(-limit)
}
