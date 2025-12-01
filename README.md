# 🚀 Teste de Performance — BlazeDemo (K6)

Este projeto implementa um cenário completo de performance utilizando **K6 (JavaScript)**, com execução local, via **Docker** e em **CI/CD (GitHub Actions)**.

Link da Documentação :  https://Dilei27.github.io/desafio-qa-performance/


O objetivo é validar se o fluxo de compra do site **BlazeDemo** suporta:

- **250 requisições por segundo**
- **P90 < 2 segundos**

---

## 📌 Cenário do Teste Técnico

Item | Descrição
--- | ---
URL alvo | https://www.blazedemo.com
Fluxo avaliado | Compra de passagem aérea (Home → Reserva → Compra → Confirmação)
Critérios | 250 req/s e P90 < 2s
Ferramenta | K6 (JavaScript)

---

## 🏗 Arquitetura do Projeto

performance-blazedemo-k6/  
│── scripts/  
│   └── purchase-flow.js        # fluxo completo da compra  
│  
│── tests/  
│   ├── load_test.js            # teste de carga (250 VUs)  
│   └── spike_test.js           # teste de pico  
│  
│── reports/                    # relatórios HTML (k6-reporter)  
│  
│── Dockerfile  
│── docker-compose.yml  
│── package.json  
│── README.md  

---

## ⚙️ Execução dos Testes

### 🔵 1. Execução local (Node + K6 instalado)

Rodar o teste principal:

k6 run tests/load_test.js

Gerar relatório HTML:

npm run report

Arquivo gerado:

reports/summary.html

---

## 🐳 2. Execução via Docker

Build:

docker build -t k6-performance .

Rodar:

docker run k6-performance

---

## 🐳 3. Execução via Docker Compose

docker compose up

---

## 📊 Cenários Implementados

Este projeto implementa **3 cenários paralelos**, simulando carga realista:

### 1️⃣ public_load  
- 250 VUs  
- 60 segundos  
- **P90 < 2s**  
- **Critério principal do teste**

### 2️⃣ auth_flow  
- 5 VUs  
- Fluxo: registro + login  
- Representa carga autenticada moderada

### 3️⃣ private_flow  
- 10 VUs  
- Consumo autenticado  
- Simula fluxo interno realista

---

## 🎯 Thresholds Utilizados

"success_rate": ["rate>0.95"],

"http_req_failed{scenario:public}": ["rate<0.01"],  
"http_req_duration{scenario:public}": ["p(90)<2000"],  

"http_req_failed{scenario:auth}": ["rate<0.20"],  
"http_req_duration{scenario:auth}": ["p(95)<2500"],  

"http_req_failed{scenario:private}": ["rate<0.05"],  
"http_req_duration{scenario:private}": ["p(90)<2000"],  

---

## 📈 Resultado Final da Execução (Análise Profissional)

Métrica | Resultado | Critério | Status
--- | --- | --- | ---
Requests/s | ~1114 req/s | ≥ 250 req/s | ✔ Aprovado
P90 (public) | ~165 ms | < 2000 ms | ✔ Aprovado
Falhas | Baixíssimas | Tolerância aplicada | ✔ Aprovado
VUs | 250 | Esperado | ✔ Aprovado
Estabilidade | Sem quedas | – | ✔ Aprovado

---

## 🧠 Interpretação Profissional

- O sistema suportou a carga **com enorme folga**.  
- O P90 ficou **~15× melhor** que o limite exigido.  
- Fluxos autenticados apresentaram falhas esperadas (limitações da API pública), sem impacto no resultado.  

### ❗ Sobre erros 200/201 no fluxo de registro

A API demo do K6 limita criação de usuários por IP.  
Isso causa respostas 200/201 inconsistentes.

👉 **Não afeta o objetivo do teste.**

---

## 🧪 Teste de Pico (Spike Test)

stages:  
- 5s → 10 VUs  
- 5s → 250 VUs  
- 10s → 250 VUs  
- 5s → 0 VUs  

### Resultado:
- Absorção imediata do spike  
- Sem queda de VUs  
- Sem aumento crítico de latência  
- Sem filas internas  

---

## ✔ Conclusão Final

- **Sistema suporta o critério com folga**  
- **P90 extremamente baixo** (~165 ms)  
- **Arquitetura moderna e escalável**  
- **Relatórios HTML completos na pasta /reports**

---

## 👨‍💻 Tecnologias Utilizadas

- K6 (JavaScript)  
- Docker / Docker Compose  
- Node 18  
- GitHub Actions  
- k6-reporter (HTML)
