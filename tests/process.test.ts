import { describe, expect, it } from 'vitest'
import { runProcess } from '../src/core/process.js'

describe('bounded child processes', () => {
  it('captures a normal process result', async () => {
    const result = await runProcess(process.execPath, ['-e', 'process.stdout.write("ok")'], {
      cwd: process.cwd(),
      environment: process.env,
      timeoutMs: 2_000,
    })
    expect(result).toMatchObject({ exitCode: 0, stdout: 'ok', timedOut: false })
  })

  it('force-terminates a synchronous process that ignores SIGTERM', async () => {
    const started = Date.now()
    const result = await runProcess(
      process.execPath,
      ['-e', 'process.on("SIGTERM",()=>{});while(true){}'],
      {
        cwd: process.cwd(),
        environment: process.env,
        timeoutMs: 100,
        killGraceMs: 100,
      },
    )
    expect(result.timedOut).toBe(true)
    expect(Date.now() - started).toBeLessThan(3_000)
  })
})
