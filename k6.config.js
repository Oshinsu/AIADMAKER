import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
  },
};

const BASE_URL = 'http://localhost:3001';

export default function () {
  // Test workflow creation
  let workflowPayload = {
    name: `Test Workflow ${__VU}`,
    description: 'Performance test workflow',
    nodes: [
      {
        id: 'brief-gen',
        type: 'agent',
        position: { x: 100, y: 100 },
        data: { agentType: 'brief-gen' }
      }
    ],
    edges: []
  };

  let response = http.post(`${BASE_URL}/api/workflows/create`, JSON.stringify(workflowPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'workflow created successfully': (r) => r.status === 201,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  if (response.status === 201) {
    let workflow = JSON.parse(response.body);
    
    // Test workflow execution
    let runPayload = {
      workflowId: workflow.id,
      inputs: {
        brand: 'Test Brand',
        product: 'Test Product',
        objective: 'Test Objective'
      }
    };

    let runResponse = http.post(`${BASE_URL}/api/workflows/run`, JSON.stringify(runPayload), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(runResponse, {
      'workflow run started': (r) => r.status === 202,
      'run response time < 2s': (r) => r.timings.duration < 2000,
    });
  }

  sleep(1);
}
