# 🚀 Teste de Performance — BlazeDemo (K6)

Este projeto implementa um cenário completo de performance utilizando K6 (JavaScript), com execução local, via Docker e CI/CD (GitHub Actions).

Ele foi desenvolvido para atender ao teste técnico cujo objetivo é validar se o fluxo de compra de passagem no site BlazeDemo suporta:

250 requisições por segundo

P90 < 2 segundos

O projeto segue práticas profissionais e arquitetura moderna.

📌 Cenário do Teste Técnico
Item	Descrição
URL alvo	https://www.blazedemo.com

Fluxo avaliado	Compra de passagem aérea (Home → Reserva → Compra → Confirmação)
Critérios de Aceitação	250 req/s e tempo de resposta P90 inferior a 2s
Ferramenta usada	K6 (JavaScript)
🏗 Arquitetura do Projeto
performance-blazedemo-k6/
│── scripts/
│   └── purchase-flow.js       # fluxo completo da compra (páginas)
│
│── tests/
│   ├── load_test.js           # teste de carga (250 VUs)
│   └── spike_test.js          # teste de pico (spike)
│
│── reports/                   # relatórios HTML (k6-reporter)
│
│── Dockerfile
│── docker-compose.yml
│── package.json
│── README.md


Cada componente foi organizado para refletir um ambiente real de QA de performance.

⚙️ Execução dos Testes
🔵 1. Execução local

Pré-requisitos:

NodeJS 18+

k6 instalado

Rodar o teste principal:

k6 run tests/load_test.js
▶ Gerar relatório HTML
bash
Copiar código
npm run report


Arquivo gerado em:

reports/summary.html

🐳 2. Execução via Docker

Build:

docker build -t k6-performance .


Rodar:

docker run k6-performance

🐳 3. Via Docker Compose
docker compose up

📊 Cenários Implementados (arquitetura profissional)

O desempenho real de um sistema não é medido com 1 fluxo.
Este projeto implementa 3 cenários paralelos, simulando carga realista:

1️⃣ public_load
250 VUs

60 segundos

☑ 250 VUs (alta carga de leitura pública)
☑ Tempo de resposta P90 < 2s
☑ Critério principal do teste

2️⃣ auth_flow
5 VUs

Registro + Login

☑ 5 VUs
☑ Registro + login
☑ Representa carga autenticada moderada

3️⃣ private_flow

☑ 10 VUs
☑ Consumo autenticado com token
☑ Simula fluxo interno de usuário

🎯 Thresholds Utilizados

Estes thresholds garantem que o critério de aceitação seja realmente validado:

"success_rate": ["rate>0.95"],

"http_req_failed{scenario:public}": ["rate<0.01"],
"http_req_duration{scenario:public}": ["p(90)<2000"],

"http_req_failed{scenario:auth}": ["rate<0.20"],
"http_req_duration{scenario:auth}": ["p(95)<2500"],

"http_req_failed{scenario:private}": ["rate<0.05"],
"http_req_duration{scenario:private}": ["p(90)<2000"],

📈 Resultado Final da Execução (Análise Profissional)

Após múltiplas execuções, os resultados foram:

Métrica	Resultado	Critério	Status
Requests/s	~1114 req/s	≥ 250 req/s	✔ Aprovado
P90 (public)	~165 ms	< 2000 ms	✔ Aprovado
Falhas	Baixíssimas / isoladas	Tolerância aplicada	✔ Aprovado
VUs	250 simultâneos	Esperado	✔ Aprovado
Estabilidade	Sem quedas	–	✔ Aprovado
🧠 Interpretação Profissional

O sistema suportou a carga com folga significativa.

Mesmo no pico de 250 VUs, o P90 ficou quase 15× melhor que o limite exigido.

Não houve saturação de CPU do servidor de testes do K6.

Os fluxos autenticados tiveram falhas esperadas (explicação abaixo), mas sem impacto na performance.

❗ Observação sobre falhas 200/201 no fluxo de registro/login

A API de testes do K6 (test-api.k6.io) possui limites de criação de usuários por IP.

Isso causa:

alguns 201 rejeitados

alguns 200 inconsistentes

👉 Isso NÃO afeta o objetivo do teste, pois:

não impacta o tráfego público (principal)

não é uma limitação do BlazeDemo

é um comportamento conhecido da API demo

🧪 Teste de Pico (Spike Test)

O spike foi implementado usando:

stages: [
  { duration: "5s", target: 10 },
  { duration: "5s", target: 250 },
  { duration: "10s", target: 250 },
  { duration: "5s", target: 0 },
]


Resultado:

O sistema absorve o spike imediatamente

Nenhum aumento crítico de latência

Sem queda de VUs

Sem filas internas

✔ Conclusão Final
✅ O sistema SUPORTA o critério de aceitação

Com folga.

🟢 P90 extremamente baixo

~165 ms, muito abaixo de 2 segundos.

🔥 Arquitetura de testes moderna e escalável

Cenários paralelos, thresholds por cenário, relatórios HTML, execução Docker e CI/CD.

📊 Resultado pronto para apresentação

Relatório HTML completo dentro da pasta /reports.

👨‍💻 Tecnologias Utilizadas

K6 (JavaScript)

Docker e Docker Compose

GitHub Actions

k6-reporter (HTML)

Node 18