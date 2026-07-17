type ColorName = 'cyan' | 'green' | 'red' | 'yellow'

const codes: Record<ColorName, number> = {
  cyan: 36,
  green: 32,
  red: 31,
  yellow: 33,
}

export interface ColorOptions {
  isTerminal?: boolean | undefined
  noColor?: string | undefined
  forceColor?: string | undefined
}

export function createColors(options: ColorOptions = {}) {
  const enabled =
    options.noColor === undefined &&
    ((options.forceColor !== undefined && options.forceColor !== '0') ||
      options.isTerminal === true)

  const paint = (color: ColorName, value: string): string =>
    enabled ? `\u001B[${codes[color]}m${value}\u001B[0m` : value

  return {
    cyan: (value: string) => paint('cyan', value),
    green: (value: string) => paint('green', value),
    red: (value: string) => paint('red', value),
    yellow: (value: string) => paint('yellow', value),
  }
}

export const colors = createColors({
  isTerminal: process.stdout.isTTY,
  noColor: process.env.NO_COLOR,
  forceColor: process.env.FORCE_COLOR,
})
