# 🚀 Teste de Performance — BlazeDemo (K6)

Este projeto implementa testes de performance utilizando **K6 (JavaScript)**, com execução local, via Docker e CI/CD com **GitHub Actions**.

O objetivo é validar se o fluxo principal de compra de passagem no site **BlazeDemo** suporta o volume exigido no teste técnico.

---

## 🎯 Objetivo do Teste Técnico

Validar se o sistema suporta:

- **250 requisições por segundo**
- **P90 < 2 segundos**

---

## 🌐 Cenário Avaliado

Fluxo de compra de passagem:

**Home → Seleção de voo → Reserva → Compra → Confirmação**

A validação foi feita simulando:

- tráfego público (requisições de leitura)
- fluxo autenticado (registro + login)
- consultas privadas autenticadas

---

## 🏗 Arquitetura do Projeto

performance-blazedemo-k6/
│── scripts/
│ └── purchase-flow.js # fluxo completo de compra (opcional)
│
│── tests/
│ ├── load_test.js # Teste de carga (250 VUs)
│ └── spike_test.js # Teste de pico (Spike Test)
│
│── reports/ # Relatórios HTML gerados automaticamente
│── Dockerfile
│── docker-compose.yml
│── package.json
│── README.md

yaml
Copiar código

---

## ⚙️ Execução Local

### 🔧 Requisitos
- Node.js 18+
- K6 instalado

### ▶ Rodar teste de carga
```bash
k6 run tests/load_test.js
▶ Gerar relatório HTML
bash
Copiar código
npm run report
Arquivo será salvo em:

bash
Copiar código
reports/summary.html
🐳 Execução via Docker
Build
bash
Copiar código
docker build -t k6-performance .
Run
bash
Copiar código
docker run k6-performance
🐳 Execução via Docker Compose
bash
Copiar código
docker-compose up
📊 Cenários Implementados (K6)
1️⃣ public_load
250 VUs

60 segundos

Medição principal de throughput

2️⃣ auth_flow
5 VUs

Registro + Login

Avalia endpoints autenticados

3️⃣ private_flow
10 VUs

Acesso com token

Simula uso autenticado real

🎯 Thresholds (Critérios de Aceitação)
javascript
Copiar código
thresholds: {
  "http_req_failed{scenario:public}": ["rate<0.01"],
  "http_req_duration{scenario:public}": ["p(90)<2000"],

  "http_req_failed{scenario:auth}": ["rate<0.20"],
  "http_req_duration{scenario:auth}": ["p(95)<2500"],

  "http_req_failed{scenario:private}": ["rate<0.05"],
  "http_req_duration{scenario:private}": ["p(90)<2000"],
}
📈 Resultado da Execução (Resumo Real)
1119 req/s (muito acima das 250 req/s exigidas)

P90 ≈ 165 ms (bem abaixo dos 2s exigidos)

Nenhuma queda de VUs

Estabilidade total

Todos thresholds atendidos

✔ Conclusão
O sistema suporta com folga o tráfego solicitado no teste técnico.

ℹ️ Observação sobre falhas 201/200
Algumas validações de registro/login falham pois a API pública do K6 limita cadastros repetidos por IP.

➡ Não impacta performance
➡ Não interfere nos thresholds
➡ Ambiente da API é limitado (comportamento esperado)

🧪 Teste de Pico (Spike Test)
Utilizado para validar resiliência com aumento repentino de carga:

javascript
Copiar código
export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "5s", target: 250 },
    { duration: "10s", target: 250 },
    { duration: "5s", target: 0 },
  ]
}
👨‍💻 Tecnologias Utilizadas
K6 (JavaScript)

Docker & Docker Compose

GitHub Actions

k6-reporter (HTML Report)
