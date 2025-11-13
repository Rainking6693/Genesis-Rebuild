const state = {
  payload: null,
  charts: {},
  currentSection: "executive",
};

const sections = {
  executive: {
    title: "Executive Overview",
    description: "Revenue, cost, throughput, and quality for the last 30 days.",
    render: renderExecutiveSection,
  },
  agents: {
    title: "Agent Performance",
    description: "Success, latency, cost, and quality by agent persona.",
    render: renderAgentSection,
  },
  orchestration: {
    title: "Orchestration Metrics",
    description: "HTDAG, HALO, AOP, and circuit-breaker activity.",
    render: renderOrchestrationSection,
  },
  evolution: {
    title: "Evolution & Learning",
    description: "SE-Darwin experiments, ATLAS knowledge, and AgentGit history.",
    render: renderEvolutionSection,
  },
  safety: {
    title: "Safety & Governance",
    description: "Policy violations, human oversight, and WaltzRL guardrails.",
    render: renderSafetySection,
  },
  cost: {
    title: "Cost Optimization",
    description: "LLM mix, savings, and active cost controls.",
    render: renderCostSection,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("refresh-btn").addEventListener("click", loadData);
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.addEventListener("click", () => setSection(btn.dataset.section));
  });
  loadData();
});

async function loadData() {
  try {
    const response = await fetch(`dashboard-data.json?ts=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Failed to load dashboard data (${response.status})`);
    }
    state.payload = await response.json();
    const updatedAt = state.payload.generated_at
      ? new Date(state.payload.generated_at).toLocaleString()
      : new Date().toLocaleString();
    document.getElementById("sidebar-updated").textContent = `Updated ${updatedAt}`;
    setSection(state.currentSection);
  } catch (error) {
    const content = document.getElementById("content");
    content.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

function setSection(section) {
  if (!state.payload) return;
  if (!sections[section]) section = "executive";
  state.currentSection = section;
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === section);
  });
  document.getElementById("section-title").textContent = sections[section].title;
  document.getElementById("section-description").textContent =
    sections[section].description;
  clearCharts();
  const content = document.getElementById("content");
  content.innerHTML = sections[section].render(state.payload);
  initializeCharts(section, state.payload);
}

function clearCharts() {
  Object.values(state.charts).forEach((chart) => chart.destroy());
  state.charts = {};
}

function renderExecutiveSection(payload) {
  const exec = payload.executive_overview;
  const cards = [
    ["Monthly Revenue", exec.monthly_revenue, "Trailing 30 days"],
    ["Monthly Cost", exec.monthly_costs, "LLM + orchestration"],
    ["Monthly Profit", exec.monthly_profit, "Revenue - Cost"],
    ["Active Businesses", exec.active_businesses, "Live deployments"],
    ["Tasks (30d)", exec.tasks_completed_30d, "Components shipped"],
    [
      "Success Rate",
      `${(exec.system_success_rate * 100).toFixed(1)}%`,
      "Rolling 30-day avg",
    ],
  ];

  return `
    <div class="card-grid">
      ${cards
        .map(
          ([label, value, subtitle]) => `
            <div class="card">
              <small>${label}</small>
              <strong>${formatNumber(value)}</strong>
              <span>${subtitle}</span>
            </div>`
        )
        .join("")}
    </div>
    <div class="grid-two">
      <div class="panel">
        <h3>Throughput Trend</h3>
        <canvas id="tasksChart" height="180"></canvas>
      </div>
      <div class="panel">
        <h3>Success Rate Trend</h3>
        <canvas id="successChart" height="180"></canvas>
      </div>
    </div>
    <div class="panel">
      <h3>Highlights</h3>
      <div class="metric-list">
        ${[
          `Median completion time: ${formatSeconds(
            payload.agent_performance.summary?.avg_latency_seconds || 0
          )}`,
          `Infra errors (24h): ${exec.infra_errors}`,
          `HTDAG runs (24h): ${payload.orchestration.htdag.total_runs}`,
          `Circuit breaker trips: ${payload.orchestration.circuit_breaker.trips}`,
        ]
          .map(
            (line) => `
              <div class="metric-item">
                <p>${line}</p>
              </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderAgentSection(payload) {
  const agents = payload.agent_performance.agents || [];
  const summary = payload.agent_performance.summary || {};
  return `
    <div class="card-grid">
      ${[
        ["Avg Latency", formatSeconds(summary.avg_latency_seconds || 0)],
        ["Cost / Task", currency(summary.cost_per_task_usd || 0)],
        ["Tasks (7d)", summary.tasks_last_7d || 0],
        ["Agents Reporting", agents.length || 0],
      ]
        .map(
          ([label, value]) => `
            <div class="card">
              <small>${label}</small>
              <strong>${value}</strong>
            </div>`
        )
        .join("")}
    </div>
    <div class="grid-two">
      <div class="panel">
        <h3>Success Rate by Agent</h3>
        <canvas id="agentSuccessChart" height="200"></canvas>
      </div>
      <div class="panel">
        <h3>Latency by Agent</h3>
        <canvas id="agentLatencyChart" height="200"></canvas>
      </div>
    </div>
    <div class="panel table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Success</th>
            <th>Avg Latency</th>
            <th>Cost / Task</th>
            <th>Quality</th>
            <th>Tasks (7d)</th>
          </tr>
        </thead>
        <tbody>
          ${agents
            .map(
              (agent) => `
              <tr>
                <td>${agent.agent}</td>
                <td>${(agent.success_rate * 100 || 0).toFixed(1)}%</td>
                <td>${formatSeconds(agent.avg_duration_seconds || 0)}</td>
                <td>${currency(agent.cost_per_task || 0)}</td>
                <td>${(agent.quality_score || 0).toFixed(1)}</td>
                <td>${agent.tasks_last_7d || 0}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderOrchestrationSection(payload) {
  const o = payload.orchestration;
  return `
    <div class="grid-two">
      <div class="panel">
        <h3>HTDAG / HALO</h3>
        <div class="metric-list">
          ${metricEntry("HTDAG runs", o.htdag.total_runs)}
          ${metricEntry("Avg depth", o.htdag.avg_depth.toFixed(2))}
          ${metricEntry("Avg nodes", o.htdag.avg_nodes.toFixed(2))}
          ${metricEntry("Circular dependencies", o.htdag.circular_dependencies)}
          ${metricEntry("HALO decisions", o.halo.decisions)}
          ${metricEntry("Avg routing time", formatSeconds(o.halo.avg_time_seconds))}
          ${metricEntry("Load balance score", o.halo.load_balance_score)}
          ${metricEntry("Routing failures", o.halo.failures)}
        </div>
      </div>
      <div class="panel">
        <h3>AOP & Circuit Breaker</h3>
        <div class="metric-list">
          ${metricEntry("Validations", o.aop.validations)}
          ${metricEntry("Passes", o.aop.passes)}
          ${metricEntry("Failures", o.aop.failures)}
          ${metricEntry("Avg assignments", o.aop.avg_assignments.toFixed(1))}
          ${metricEntry("Circuit status", o.circuit_breaker.status)}
          ${metricEntry("Trips", o.circuit_breaker.trips)}
          ${metricEntry("Recent failures", o.circuit_breaker.recent_failures)}
        </div>
      </div>
    </div>
  `;
}

function renderEvolutionSection(payload) {
  const evo = payload.evolution_learning;
  return `
    <div class="card-grid">
      ${metricCard("Evolution Runs", evo.se_darwin.evolution_runs)}
      ${metricCard("Improvements", evo.se_darwin.improvements_generated)}
      ${metricCard("Quality Delta", `${evo.se_darwin.quality_improvement_pct}%`)}
      ${metricCard("Archive Size", evo.se_darwin.archive_size)}
    </div>
    <div class="grid-two">
      <div class="panel">
        <h3>ATLAS Knowledge</h3>
        <div class="metric-list">
          ${metricEntry("Updates", evo.atlas.updates)}
          ${metricEntry("Knowledge items", evo.atlas.knowledge_items)}
          ${metricEntry("Learning rate", `${(evo.atlas.learning_rate * 100).toFixed(1)}%`)}
        </div>
      </div>
      <div class="panel">
        <h3>AgentGit Activity</h3>
        <div class="metric-list">
          ${metricEntry("Commits", evo.agentgit.commits)}
          ${metricEntry("Versions tracked", evo.agentgit.versions_tracked)}
          ${metricEntry("Rollbacks", evo.agentgit.rollbacks)}
        </div>
      </div>
    </div>
  `;
}

function renderSafetySection(payload) {
  const safety = payload.safety_governance;
  const policy = safety.policy_violations;
  const oversight = safety.human_oversight;
  const waltz = safety.waltzrl;
  return `
    <div class="grid-two">
      <div class="panel">
        <h3>Policy Violations</h3>
        <div class="metric-list">
          ${metricEntry("Total", policy.total)}
          ${metricEntry("Critical", policy.by_severity.critical)}
          ${metricEntry("High", policy.by_severity.high)}
          ${metricEntry("Medium", policy.by_severity.medium)}
        </div>
      </div>
      <div class="panel">
        <h3>Human Oversight</h3>
        <div class="metric-list">
          ${metricEntry("Requests", oversight.approvals_requested)}
          ${metricEntry("Granted", oversight.granted)}
          ${metricEntry("Denied", oversight.denied)}
          ${metricEntry("Avg response", `${oversight.avg_response_minutes.toFixed(1)}m`)}
        </div>
      </div>
    </div>
    <div class="panel">
      <h3>WaltzRL Safety</h3>
      <div class="metric-list">
        ${metricEntry("Unsafe detections", waltz.unsafe_detections)}
        ${metricEntry("Feedback loops", waltz.feedback_loops)}
        ${metricEntry("Safety score", `${waltz.safety_score}/10`)}
      </div>
    </div>
  `;
}

function renderCostSection(payload) {
  const cost = payload.cost_optimization;
  const comparison = cost.monthly_cost_comparison;
  return `
    <div class="card-grid">
      ${metricCard("Baseline spend", currency(comparison.baseline || 0))}
      ${metricCard("Current spend", currency(comparison.current || 0))}
      ${metricCard("Cost reduction", `${(cost.cost_reduction_pct || 0).toFixed(1)}%`)}
      ${metricCard("Components (30d)", cost.components_completed || 0)}
    </div>
    <div class="grid-two">
      <div class="panel">
        <h3>LLM Usage</h3>
        <canvas id="llmChart" height="220"></canvas>
      </div>
      <div class="panel">
        <h3>Active Optimizations</h3>
        <div class="metric-list">
          ${cost.active_optimizations
            .map((opt) => metricEntry(opt.name, opt.status))
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function initializeCharts(section, payload) {
  if (section === "executive") {
    const series = payload.orchestration.tasks_time_series || {};
    const labels = Object.keys(series);
    const values = Object.values(series);
    state.charts.tasks = new Chart(document.getElementById("tasksChart"), {
      type: "line",
      data: {
        labels: labels.map((label) => String(label)),
        datasets: [
          {
            label: "Components",
            data: values,
            borderColor: "#5eead4",
            backgroundColor: "rgba(94,234,212,0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: { plugins: { legend: { display: false } } },
    });
    state.charts.success = new Chart(document.getElementById("successChart"), {
      type: "line",
      data: {
        labels: labels.map((label) => String(label)),
        datasets: [
          {
            label: "Success %",
            data: values.map(() => payload.executive_overview.system_success_rate * 100),
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96,165,250,0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { suggestedMin: 0, suggestedMax: 100 } },
      },
    });
  } else if (section === "agents") {
    const agents = payload.agent_performance.agents || [];
    state.charts.agentSuccess = new Chart(
      document.getElementById("agentSuccessChart"),
      {
        type: "bar",
        data: {
          labels: agents.map((a) => a.agent),
          datasets: [
            {
              label: "Success %",
              data: agents.map((a) => (a.success_rate || 0) * 100),
              backgroundColor: "#34d399",
            },
          ],
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { max: 100 } } },
      }
    );
    state.charts.agentLatency = new Chart(
      document.getElementById("agentLatencyChart"),
      {
        type: "bar",
        data: {
          labels: agents.map((a) => a.agent),
          datasets: [
            {
              label: "Latency (s)",
              data: agents.map((a) => a.avg_duration_seconds || 0),
              backgroundColor: "#fbbf24",
            },
          ],
        },
        options: { plugins: { legend: { display: false } } },
      }
    );
  } else if (section === "cost") {
    const usage = payload.cost_optimization.llm_usage || [];
    state.charts.llm = new Chart(document.getElementById("llmChart"), {
      type: "doughnut",
      data: {
        labels: usage.map((entry) => entry.model),
        datasets: [
          {
            data: usage.map((entry) => entry.percentage),
            backgroundColor: ["#60a5fa", "#22d3ee", "#c084fc", "#f472b6"],
          },
        ],
      },
    });
  }
}

function metricEntry(label, value) {
  return `<div class="metric-item"><h4>${label}</h4><p>${value}</p></div>`;
}

function metricCard(label, value) {
  return `
    <div class="card">
      <small>${label}</small>
      <strong>${value}</strong>
    </div>
  `;
}

function formatNumber(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" && value >= 1000) {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
  }
  return value ?? 0;
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatSeconds(seconds) {
  if (!seconds) return "0s";
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(1)}m`;
  return `${(minutes / 60).toFixed(1)}h`;
}
