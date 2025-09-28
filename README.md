# Frontend da Cafeteria

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure a URL da API criando um arquivo `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

3. Execute o aplicativo:
```bash
# Modo desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Funcionalidades

- ✅ Autenticação (Login/Registro)
- ✅ Cardápio com categorias
- ✅ Detalhes do produto
- ✅ Carrinho de compras
- ✅ Persistência local dos dados
- ✅ Interface responsiva

## Estrutura

- `src/app/` - Páginas do aplicativo
- `src/components/` - Componentes reutilizáveis
- `src/stores/` - Gerenciamento de estado (Zustand)
- `src/utils/` - Utilitários e funções auxiliares
- `src/types/` - Definições de tipos TypeScript

