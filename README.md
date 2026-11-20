# SpeakFlow AI

**Listen to what you would otherwise have to read.** SpeakFlow AI is a private, browser-based text-to-speech workspace for students, professionals, and anyone who prefers listening. It turns pasted text into speech with voices available on the device—no account, paid API, or server required.

## Features

- Read text aloud in English, Russian, and Kazakh, using the browser's Web Speech API.
- Discover installed system voices and select a voice for the chosen language.
- Play, pause, resume, and stop speech; adjust playback speed.
- Split long text into smaller speech sections and show best-effort reading progress and current-word feedback.
- Clean pasted text, save favorites, revisit the latest 30 listening sessions, copy text, and delete saved texts.
- Keep favorites and history in browser localStorage.
- Use a responsive dark interface with keyboard-accessible controls and reduced-motion support.

## Screenshots

Screenshots are not checked into this repository yet. To capture them, start the app locally and save images of the reader, player, and saved-text library in `docs/screenshots/`.

## Getting started

### Requirements

- Node.js 22.12 or newer
- npm (included with Node.js)
- A modern browser with Web Speech API support

### Install and run

```bash
git clone https://github.com/dinaintech/SpeakFlow-AI.git
cd SpeakFlow-AI
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). You can also use VS Code's integrated terminal for these commands.

On Windows PowerShell, if the `npm.ps1` script is blocked by the execution policy, use `npm.cmd` instead (for example, `npm.cmd install` and `npm.cmd run dev`).

### Verify

```bash
npm run test
npm run lint
npm run build
```

To serve the production build locally:

```bash
npm run preview
```

## How it is organized

```text
src/
├── components/
│   ├── layout/       # Application navigation
│   ├── library/      # Saved texts and listening history
│   ├── player/       # Speech controls and progress visualization
│   └── reader/       # Text editor and language selection
├── hooks/            # React speech lifecycle controller
├── pages/            # Dashboard composition
├── services/         # Web Speech API and localStorage access
├── styles/           # Responsive application styles
├── types/            # Shared TypeScript types
└── utils/            # Text cleanup, chunking, and display helpers
tests/                # Focused text and persistence tests
```

The UI is composed in `src/pages/DashboardPage.tsx`. `src/hooks/useSpeech.ts` manages utterances, playback state, available voices, and browser speech events. `src/services/storageService.ts` owns the versioned localStorage entries; text cleanup and long-text chunking live in `src/utils/text.ts`.

## Technology

- React and TypeScript
- Vite
- Modern CSS
- Browser Web Speech API (`SpeechSynthesis`)
- Browser localStorage
- Lucide React icons
- Vitest, Testing Library, and Oxlint

## Privacy and technical limitations

- SpeakFlow does not send text to a server. Unsaved editor text exists only in the open page; favorites and the latest 30 playback sessions are stored in this browser's localStorage.
- Speech quality, available languages, and voice names depend on the browser and operating system. A Kazakh voice may not be installed even though Kazakh text can be submitted to the speech engine.
- Some browsers load voices asynchronously. Pause, resume, cancellation, and speech-boundary events also vary by browser.
- Long text is split into sequential utterances to reduce browser limits. The progress bar and current-word indicator use speech boundary events when the browser provides them; precise word highlighting is not guaranteed.
- Browser speech is not an audio file. SpeakFlow does not generate downloadable recordings or provide audio waveform analysis; its waveform is a playback-state visualization.
- Favorites and history are device/browser-specific. Clearing site data removes them, and localStorage has browser-dependent size limits.
- Clipboard access can require a secure context (HTTPS or localhost) and browser permission.

## Roadmap

- Add import support for common document formats.
- Improve paragraph and sentence navigation for long reads.
- Add optional export/import of favorites and history.
- Expand accessibility and cross-browser speech testing.
- Explore installable PWA support and offline app-shell caching.

## Contributing

Contributions and bug reports are welcome. Please run `npm run test`, `npm run lint`, and `npm run build` before opening a pull request.
