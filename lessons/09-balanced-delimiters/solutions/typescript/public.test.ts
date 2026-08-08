import { describe, expect, it } from 'vitest'
import { hasBalancedDelimiters } from './learner_solution.js'

describe('hasBalancedDelimiters public examples', () => {
  it('accepts properly nested delimiters', () => {
    expect(hasBalancedDelimiters('([])')).toBe(true)
  })

  it('rejects crossed nesting', () => {
    expect(hasBalancedDelimiters('([)]')).toBe(false)
  })

  it('rejects unmatched opening and closing delimiters', () => {
    expect(hasBalancedDelimiters('(()')).toBe(false)
    expect(hasBalancedDelimiters(']')).toBe(false)
  })

  it('accepts an empty string and all delimiter types', () => {
    expect(hasBalancedDelimiters('')).toBe(true)
    expect(hasBalancedDelimiters('{[()]}')).toBe(true)
  })
})
