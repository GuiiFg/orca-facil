# Adaptação para Mobile (Capacitor)

O projeto "Orça Fácil" foi adaptado para rodar nativamente no Android usando **Capacitor**, preservando a mesma base de código Vue 3 que já roda no Electron.

## O Que Foi Feito

### 1. Camada de Abstração da API (Service Layer)
Para que o Vue não dependesse exclusivamente do `window.api` (que só existe no Electron via IPC), criamos serviços que detectam a plataforma:
- **[src/services/api.js](file:///c:/Users/Faria/repos/devsoul/orca-facil/src/services/api.js)**: Roteia chamadas para o Capacitor ou Electron baseado no ambiente.
- **[src/services/capacitorDb.js](file:///c:/Users/Faria/repos/devsoul/orca-facil/src/services/capacitorDb.js)**: Implementa as mesmas queries e retornos do `better-sqlite3`, mas usando `@capacitor-community/sqlite` nativo no mobile. Abrange [Customer](file:///c:/Users/Faria/repos/devsoul/orca-facil/src/main/db/icpHandlers/handles/costumer.js#47-88), [Product](file:///c:/Users/Faria/repos/devsoul/orca-facil/src/main/db/icpHandlers/handles/product.js#37-74), [Payment](file:///c:/Users/Faria/repos/devsoul/orca-facil/src/main/db/icpHandlers/handles/payment.js#35-76), [Budget](file:///c:/Users/Faria/repos/devsoul/orca-facil/src/main/db/icpHandlers/handles/budget.js#84-140) e configurações.
- **[src/services/fileService.js](file:///c:/Users/Faria/repos/devsoul/orca-facil/src/services/fileService.js)**: Substitui o `dialog` do Electron por APIs do Capacitor (`@capacitor/filesystem` e HTML file input) para arquivos e geração de PDFs.

### 2. Configurações de Build
- Criado **[vite.config.mjs](file:///c:/Users/Faria/repos/devsoul/orca-facil/vite.config.mjs)**: Um setup do Vite separado do Electron Forge para gerar um build web limpo na pasta `dist/`.
- Criado **[capacitor.config.ts](file:///c:/Users/Faria/repos/devsoul/orca-facil/capacitor.config.ts)**: Aponta para a pasta `dist` como fonte da webview.

### 3. Integração do Android
- O comando `npx cap add android` injetou a pasta nativa `android/`.
- O comando `npx cap sync` copiou os arquivos de `dist/` para a aplicação Android.

---

## Como Gerar o APK Agora

Para gerar o APK no seu computador, você precisa ter o **Android Studio** instalado. Siga o fluxo de 3 passos toda vez que mexer no código Vue:

### Passo 1: Fazer o Build Web
Gere a versão otimizada do Vue.
```bash
npm run build:web
```

### Passo 2: Sincronizar com o Capacitor
Envie os arquivos HTML/JS gerados para dentro do pacote Android.
```bash
npm run cap:sync
```

### Passo 3: Abrir no Android Studio e Compilar
Isso abre o Android Studio diretamente na pasta correta:
```bash
npm run cap:open
```
**No Android Studio:**
1. Aguarde a indexação e o carregamento do Gradle (uma barra de progresso no canto inferior direito).
2. Vá no menu do topo em **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. Quando terminar, uma notificação vai aparecer no canto inferior direito. Clique em "locate" (localizar) para abrir a pasta onde o seu `app-debug.apk` foi gerado (normalmente em `android\app\build\outputs\apk\debug\`).

> [!TIP]
> Se preferir não abrir o Android Studio e gerar pelo próprio terminal (exige ter o Java e Gradle no PATH), você pode rodar:
> `cd android && ./gradlew assembleDebug`
