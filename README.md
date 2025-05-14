# RealTimeSlideShare

RTSS

## Drizzle

<https://orm.drizzle.team/>
<https://www.memory-lovers.blog/entry/2024/12/25/064610>
<https://madebyfabian.com/blog/how-to-install-drizzle-postgres-with-nuxt-3>
<https://hub.nuxt.com/docs/recipes/drizzle>

## 本番環境

```shell
# パッケージのインストール
npm install
npm install -g forever

# ビルド
npm build

# DBのマイグレーション
npm run db:generate
npm run db:migrate

# サーバーをスタート
forever start -c "node --env-file=.env" .output/server/index.mjs

# cronに設定(起動時に実行できるように)
@reboot forever start -c "node --env-file=.env" .output/server/index.mjs
```

## Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
