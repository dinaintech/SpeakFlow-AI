export function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null
  }

  return window.speechSynthesis
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return getSpeechSynthesis()?.getVoices() ?? []
}
