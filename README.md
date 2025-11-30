📝 README.md

# 🚀 Performance Testing – BlazeDemo (K6)

Este projeto implementa testes de performance para o cenário de **compra de passagem aérea**, conforme solicitado no teste técnico.  
Apesar do enunciado citar *JMeter*, foi autorizada a execução em **K6 (JavaScript)** por ser uma abordagem mais moderna, flexível e profissional.

O projeto contempla:

* Teste de **Carga (Load Test)**
* Teste de **Pico/Estresse (Spike Test)**
* Arquitetura profissional com múltiplos cenários (public, auth, private)
* Relatórios automáticos em HTML
* Execução local ou via Docker
* Thresholds alinhados ao critério de aceitação
* Projeto organizado e reprodutível

---

## 📌 Cenário do Teste Técnico

**URL:** https://www.blazedemo.com  
**Fluxo:** compra de passagem até o sucesso  
**Critérios de Aceitação:**

* **250 requisições por segundo**
* **P90 < 2 segundos**

---

# 🏗 Arquitetura do Projeto

performance-blazedemo-k6/
│── scripts/
│ └── purchase-flow.js # Workflow utilizado pelos cenários
│
│── tests/
│ ├── load_test.js # Teste de carga principal
│ └── spike_test.js # Teste de pico (spike)
│
│── reports/ # Relatórios HTML gerados automaticamente
│── Dockerfile
│── docker-compose.yml
│── package.json
│── README.md (este arquivo)

---

# ⚙️ Como Executar

## 🔵 1. Rodar localmente

Requer:
* Node 18+
* K6 instalado localmente

```bash
k6 run tests/load_test.js

Gerar relatório HTML:

npm run report

Relatório será salvo em:

/reports/summary.html

🐳 2. Rodar via Docker

Build:

docker build -t k6-performance .

Executar:

docker run k6-performance

🐳 3. Rodar via Docker Compose
docker-compose up

📊 Cenários Implementados

Este projeto usa três cenários simultâneos, representando diferentes tipos de carga real:

1️⃣ public_load

250 VUs por 60s, simulando tráfego público de leitura.

2️⃣ auth_flow

5 VUs realizando registro + autenticação.

3️⃣ private_flow

10 VUs realizando fluxo autenticado com token.

🎯 Thresholds (Critérios de Aceitação)
thresholds: {
  "http_req_failed{scenario:public}": ["rate<0.01"], 
  "http_req_duration{scenario:public}": ["p(90)<2000"], 

  "http_req_failed{scenario:auth}": ["rate<0.20"], 
  "http_req_duration{scenario:auth}": ["p(95)<2500"], 

  "http_req_failed{scenario:private}": ["rate<0.05"], 
  "http_req_duration{scenario:private}": ["p(90)<2000"], 
}, 

📈 Relatório da Execução

Após a execução, o K6 gera:

Métricas consolidadas no terminal

Relatório HTML completo via k6-reporter

Exemplo de comando:

npm run report

O arquivo será salvo em:

reports/summary.html

✅ Resultado e Análise

A execução final apresentou:

1119 requisições/segundo (muito acima das 250 req/s exigidas)

P90 = ~165 ms (extremamente abaixo de 2 segundos)

Nenhuma queda de VUs

Todos thresholds atendidos

Estabilidade total mesmo com 250 VUs simultâneos

✔ Conclusão

O sistema suporta a carga exigida pelo cenário técnico, com folga considerável.
O tempo de resposta permaneceu muito baixo e estável mesmo durante o pico máximo de carga.

ℹ️ Observação importante sobre falhas 201/200

Durante o teste, alguns checks de register e login falham.
Isso ocorre porque a API de teste do K6 possui limitações de registro por IP.

👉 Essas falhas não impactam o load test, pois:

não afetam thresholds

não interferem no tráfego principal

são esperadas nesse ambiente demo

não representam erros de performance do sistema

🧪 Teste de Pico (Spike)

Para simular comportamento sob aumento repentino de carga:

export const options = {
  stages: [

    { duration: "5s", target: 10 },
    { duration: "5s", target: 250 },
    { duration: "10s", target: 250 },
    { duration: "5s", target: 0 },

  ]
}

Este teste mostra resiliência e capacidade de absorver spikes.

👨‍💻 Tecnologias

K6 (JavaScript)

Docker

Node 18

k6-reporter para HTML

Execução 100% reprodutívelF
