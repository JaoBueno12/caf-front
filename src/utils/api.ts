export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchJson(path: string, init?: RequestInit) {
  console.log(`🌐 Fazendo requisição para: ${BASE_URL}${path}`);
  
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  
  console.log(`📡 Resposta recebida: ${res.status} ${res.statusText}`);
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Request failed: ${res.status}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
      console.log(`❌ Erro do servidor:`, errorData);
    } catch {
      console.log(`❌ Erro não parseável:`, errorText);
    }
    
    throw new Error(errorMessage);
  }
  
  const data = await res.json();
  console.log(`✅ Dados recebidos:`, data);
  return data;
}

// Função para fazer requisições autenticadas
export async function fetchWithAuth(path: string, token: string, init?: RequestInit) {
  return fetchJson(path, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(init?.headers || {})
    }
  });
}


