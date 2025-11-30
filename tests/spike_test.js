import { performanceFlow } from "../scripts/purchase-flow.js";

export const options = {
  stages: [
    { duration: "10s", target: 20 },
    { duration: "5s", target: 300 },  // spike forte
    { duration: "10s", target: 300 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(90)<2000"], 
  },
};

export default function () {
  performanceFlow();
}
