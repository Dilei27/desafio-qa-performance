import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

export const successRate = new Rate("success_rate");

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "reports/summary.html": htmlReport(data),
  };
}

function randomEmail() {
  const r = Math.random().toString(36).substring(7);
  return `user_${r}@test.com`;
}

export const options = {
  scenarios: {
    public_load: {
      executor: "constant-vus",
      exec: "publicFlow",
      vus: 250,
      duration: "1m",
      tags: { scenario: "public" },
    },

    auth_flow: {
      executor: "constant-vus",
      exec: "authFlow",
      vus: 5,
      duration: "1m",
      tags: { scenario: "auth" },
      startTime: "5s",
    },

    private_flow: {
      executor: "constant-vus",
      exec: "privateFlow",
      vus: 10,
      duration: "1m",
      tags: { scenario: "private" },
      startTime: "10s",
    },
  },

  thresholds: {
    "success_rate": ["rate>0.95"],

    "http_req_failed{scenario:public}": ["rate<0.01"],
    "http_req_duration{scenario:public}": ["p(90)<2000"],

    "http_req_failed{scenario:auth}": ["rate<0.20"],
    "http_req_duration{scenario:auth}": ["p(95)<2500"],

    "http_req_failed{scenario:private}": ["rate<0.05"],
    "http_req_duration{scenario:private}": ["p(90)<2000"],
  },
};

export function publicFlow() {
  let res = http.get("https://test-api.k6.io/public/crocodiles/");

  check(res, {
    "public OK": (r) => r.status === 200,
  });

  successRate.add(res.status === 200);

  sleep(0.2);
}

export function authFlow() {
  const email = randomEmail();

  let res = http.post("https://test-api.k6.io/user/register/", {
    username: email,
    first_name: "Load",
    last_name: "Test",
    email: email,
    password: "123456",
  });

  check(res, {
    "register status 201": (r) => r.status === 201,
  });

  successRate.add(res.status === 201);

  res = http.post("https://test-api.k6.io/auth/token/login/", {
    username: email,
    password: "123456",
  });

  check(res, {
    "login OK": (r) => r.status === 200,
  });

  successRate.add(res.status === 200);

  sleep(0.5);
}

export function privateFlow() {
  const email = randomEmail();

  let res = http.post("https://test-api.k6.io/user/register/", {
    username: email,
    first_name: "Load",
    last_name: "Test",
    email: email,
    password: "123456",
  });

  const login = http.post("https://test-api.k6.io/auth/token/login/", {
    username: email,
    password: "123456",
  });

  const token = login.json("access");

  res = http.get("https://test-api.k6.io/my/crocodiles/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    "private OK": (r) => r.status === 200,
  });

  successRate.add(res.status === 200);

  sleep(0.5);
}
