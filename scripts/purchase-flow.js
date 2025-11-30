import http from "k6/http";
import { check } from "k6";

function randomEmail() {
  const r = Math.random().toString(36).substring(7);
  return `user_${r}@test.com`;
}

export function performanceFlow() {
  let res = http.get("https://test-api.k6.io/public/crocodiles/");
  check(res, {
    "public crocs OK": (r) => r.status === 200,
  });

  const email = randomEmail();
  res = http.post(
    "https://test-api.k6.io/user/register/",
    {
      username: email,
      first_name: "Dilei",
      last_name: "QA",
      email: email,
      password: "123456",
    }
  );
  check(res, {
    "register OK": (r) => r.status === 201,
  });

  res = http.post("https://test-api.k6.io/auth/token/login/", {
    username: email,
    password: "123456",
  });

  check(res, {
    "login OK": (r) => r.status === 200,
  });

  const token = res.json("access");

  res = http.get("https://test-api.k6.io/my/crocodiles/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    "get MY crocs OK": (r) => r.status === 200,
  });
}
