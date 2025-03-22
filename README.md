# Dashboard Prodejen

Manažerský dashboard pro správu prodejen.

## Přihlášení do aplikace

Pro přihlášení do aplikace můžete použít následující testovací účty:

| Email | Heslo | Role |
|-------|-------|------|
| jan.novak@example.com | libovolné (min. 4 znaky) | admin |
| petra.svobodova@example.com | libovolné (min. 4 znaky) | manager |
| martin.dvorak@example.com | libovolné (min. 4 znaky) | manager |
| lucie.cerna@example.com | libovolné (min. 4 znaky) | manager |

## Řešení problémů s přihlášením na Vercel

Pokud máte problémy s přihlášením na Vercel, je potřeba správně nastavit proměnné prostředí:

1. Přejděte na [Vercel Dashboard](https://vercel.com/dashboard)
2. Vyberte váš projekt (xzone-dashboard)
3. Klikněte na "Settings" > "Environment Variables"
4. Ujistěte se, že máte nastavené následující proměnné:
   - `NEXTAUTH_SECRET`: Můžete použít stejnou hodnotu jako v lokálním prostředí nebo vygenerovat novou
   - `NEXTAUTH_URL`: **Toto je klíčové** - musí být nastaveno na URL vaší Vercel aplikace (např. `https://xzone-dashboard.vercel.app`)

5. Po aktualizaci proměnných prostředí klikněte na "Deployments" a pak na "Redeploy" u poslední verze, aby se změny projevily

## Vývoj

### Instalace závislostí

```bash
npm install
```

### Spuštění vývojového serveru

```bash
npm run dev
```

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000).
