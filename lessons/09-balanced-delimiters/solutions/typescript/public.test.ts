import { describe, expect, it } from 'vitest'
import { hasBalancedDelimiters } from './solution.js'

describe('hasBalancedDelimiters public examples', () => {
  it('accepts properly nested delimiters', () => {
    expect(hasBalancedDelimiters('([])')).toBe(true)
  })

  it('rejects crossed nesting', () => {
    expect(hasBalancedDelimiters('([)]')).toBe(false)
  })
})
