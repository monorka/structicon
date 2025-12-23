# Structicon 🧬

[English](./README.md) | **日本語**

**分子構造風 identicon ライブラリ**

Structicon は、文字列から一意な「分子構造風アイコン」を生成するidenticon ライブラリです。  
化学構造式にインスパイアされた抽象的でプレミアム感のある SVG を生成し、**同じ入力からは必ず同じアイコンが生成されます。**

---

<div align="center">

| <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/1.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/2.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/3.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/4.svg" width="100"> |
| :---: | :---: | :---: | :---: |
| <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/5.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/6.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/7.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/8.svg" width="100"> |
| <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/9.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/10.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/11.svg" width="100"> | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/12.svg" width="100"> |

</div>

---

## 特徴

- **決定論的**  
  同じ入力文字列からは、常に同じ構造・同じ色のアイコンを生成。
- **抽象的な美しさ**  
  顔やピクセルではなく、ノードと結合による構造表現。
- **オフライン**  
  サーバー通信は一切不要。すべてローカルで完結。
- **軽量**  
  依存関係なし。
- **フレームワーク対応**  
  React 用コンポーネントラッパーを同梱。

---

## インストール

```bash
npm install @monorka/structicon
```

---

## 使い方

### シンプルな SVG 文字列生成

```ts
import { generateIdenticon } from '@monorka/structicon';

const svg = generateIdenticon('user-123', { size: 64 });
// <svg ...>...</svg が返ります
```

---

### Data URL（`<img>` タグ用）

```ts
const dataUrl = generateIdenticon('user-123', { format: 'dataurl' });
// data:image/svg+xml;base64,...
```

---

### React コンポーネント

```tsx
import { Structicon } from '@monorka/structicon/react';

function Profile() {
  // dark / neon / organic などのテーマを指定可能
  return <Structicon input="monorka" theme="neon" size={80} />;
}
```

---

## テーマ

Structicon には、利用環境に最適化されたカラーパレットが用意されています。

| テーマ | プレビュー | 説明 |
| :--- | :---: | :--- |
| `light` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-light.svg" width="60"> | （デフォルト）明るい背景向け。 |
| `dark` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-dark.svg" width="60"> | ダーク UI 向け。 |
| `neon` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-neon.svg" width="60"> | サイバーパンク風のビビッドな配色 |
| `organic` | <img src="https://raw.githubusercontent.com/monorka/structicon/main/assets/theme-organic.svg" width="60"> | 鉱物・自然に着想を得た落ち着いたトーン |

---

## CLI ツール

ターミナルから直接アイコンを生成できます。

```bash
npx structicon "my-identity" my-icon.svg
```

---

## API

- `input`（string）  
  ユーザー名やメールアドレスなどの識別子
- `options`
  - `size`（number）: SVG の幅・高さ（デフォルト: 64）
  - `strokeWidth`（number）: 結合線の太さ（デフォルト: 2）
  - `color`（string）: CSS カラー指定（デフォルト: ハッシュ由来）
  - `theme`（'light' | 'dark' | 'neon' | 'organic'）: テーマ指定
  - `format`（'svg' | 'dataurl'）: 出力形式（デフォルト: 'svg'）

---

## 開発

```bash
# 依存関係のインストール
npm install

# テスト実行
npm test

# ライブラリのビルド
npm run build

# デモページ起動
npm run demo
```

---

## ライセンス

MIT © Monorka Co., Ltd.
