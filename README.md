# Structicon 🧬

**English** | [日本語](./README.ja.md)

**Deterministic molecular-style identicons.**

Structicon is a zero-dependency, offline-first library that generates unique, molecular-like identity icons from strings. Inspired by chemical structures, it produces abstract, premium-looking SVGs that are deterministic—the same input always produces the identical icon.

<div align="center">

| <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/1.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/2.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/3.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/4.svg" width="100"> |
| :---: | :---: | :---: | :---: |
| <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/5.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/6.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/7.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/8.svg" width="100"> |
| <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/9.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/10.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/11.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/12.svg" width="100"> |

</div>

## Features

- **Deterministic**: Same input string → Same structure & color.
- **Abstract Aesthetics**: No more boring faces or pixels. Structured nodes and bonds.
- **Offline-first**: Zero server calls. All computation happens locally.
- **Tiny & Fast**: Zero dependencies. Lightweight analytical layout.
- **Framework Ready**: Includes a React component wrapper.

## Installation

```bash
npm install @monorka/structicon
```

## Usage

### Simple SVG String

```ts
import { generateIdenticon } from '@monorka/structicon';

const svg = generateIdenticon('user-123', { size: 64 });
// Returns: <svg ...>...</svg>
```

### Data URL (for `<img>` tags)

```ts
const dataUrl = generateIdenticon('user-123', { format: 'dataurl' });
// Returns: data:image/svg+xml;base64,...
```

### React Component

```tsx
import { Structicon } from '@monorka/structicon/react';

function Profile() {
  // You can specify themes like 'dark', 'neon', or 'organic'
  return <Structicon input="monorka" theme="neon" size={80} />;
}
```

## Themes

Structicon comes with curated color palettes optimized for different environments:

| Theme | Preview | Description |
| :--- | :---: | :--- |
| `light` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-light.svg" width="60"> | (Default) Clean and professional, optimized for light backgrounds. |
| `dark` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-dark.svg" width="60"> | High-chroma, glowing colors optimized for dark backgrounds. |
| `neon` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-neon.svg" width="60"> | Vibrant, cyber-punk inspired acid colors. |
| `organic` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-organic.svg" width="60"> | Muted, earthy tones inspired by natural minerals. |

### CLI Tool

Generate icons directly from your terminal:

```bash
npx structicon "my-identity" my-icon.svg
```

## API

### `generateIdenticon(input, options?)`

- `input` (string): The identity string (username, email, etc.)
- `options` (object):
  - `size` (number): SVG width/height (default: 64)
  - `strokeWidth` (number): Thickness of bonds (default: 2)
  - `color` (string): Custom CSS color (default: derived from hash)
  - `theme` ('light' | 'dark' | 'neon' | 'organic'): Predefined color palette (default: 'light')
  - `format` ('svg' | 'dataurl'): Output format (default: 'svg')

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build library
npm run build

# Run demo page
npm run demo
```

## License

MIT © Monorka Co., Ltd.
