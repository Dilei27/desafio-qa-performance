FROM grafana/k6:latest

WORKDIR /app
COPY . .

CMD ["run", "tests/load_test.js"]
