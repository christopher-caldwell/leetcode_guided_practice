import { resetState } from './state.js'

export async function handleResetCommand(
  root: string,
  command: string,
  write: (message: string) => void = console.log,
): Promise<boolean> {
  if (command !== 'reset') return false
  await resetState(root)
  write('Workshop progress, feedback, revealed references, and timers were cleared.')
  write('Learner analysis and solution files were not changed.')
  return true
}
