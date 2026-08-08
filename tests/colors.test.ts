import { describe, expect, it } from 'vitest'
import { createColors } from '../src/cli/colors.js'

describe('terminal colors', () => {
  it('uses subtle ANSI colors for terminals', () => {
    expect(createColors({ isTerminal: true }).green('PASS')).toBe('\u001B[32mPASS\u001B[0m')
  })

  it('keeps redirected and NO_COLOR output plain', () => {
    expect(createColors({ isTerminal: false }).red('FAIL')).toBe('FAIL')
    expect(createColors({ isTerminal: true, noColor: '' }).yellow('WAITING')).toBe('WAITING')
    expect(createColors({ isTerminal: false, forceColor: '0' }).green('PASS')).toBe('PASS')
  })
})
