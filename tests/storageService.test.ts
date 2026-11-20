import { beforeEach, describe, expect, it } from 'vitest'
import { storageService } from '../src/services/storageService'

describe('storageService', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('persists and restores saved texts and history', () => {
    const saved = [{
      id: 'saved-1',
      title: 'A title',
      text: 'Some text',
      createdAt: '2026-11-20T00:00:00.000Z',
    }]
    const history = [{
      id: 'history-1',
      title: 'A title',
      text: 'Some text',
      playedAt: '2026-11-20T00:00:00.000Z',
    }]

    storageService.saveSavedTexts(saved)
    storageService.saveHistory(history)

    expect(storageService.loadSavedTexts()).toEqual(saved)
    expect(storageService.loadHistory()).toEqual(history)
  })

  it('reports malformed stored data instead of hiding it', () => {
    window.localStorage.setItem('speakflow.saved.v1', '{not valid json')

    expect(() => storageService.loadSavedTexts()).toThrow(
      'SpeakFlow could not read saved data',
    )
  })
})
