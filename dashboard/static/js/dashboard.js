// Genesis Real-Time Dashboard JavaScript

let currentSection = 'executive';
let metricsData = null;
let charts = {};

// Load metrics on page load
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadMetrics();

    // Auto-refresh every 30 seconds
    setInterval(loadMetrics, 30000);
});

function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentSection = tab.dataset.section;
            updateActiveTab();
            renderSection();
        });
    });
}

function updateActiveTab() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.section === currentSection);
    });
}

async function loadMetrics() {
    try {
        const response = await fetch('/api/metrics');
        const result = await response.json();

        if (result.status === 'success') {
            metricsData = result.data;
            updateLastUpdated();
            renderSection();
        } else {
            showError('Failed to load metrics: ' + result.error);
        }
    } catch (error) {
        showError('Error loading metrics: ' + error.message);
    }
}

function updateLastUpdated() {
    const date = new Date(metricsData.generated_at);
    document.getElementById('last-updated').textContent =
        'Last updated: ' + date.toLocaleTimeString();
}

function renderSection() {
    if (!metricsData) return;

    const content = document.getElementById('content');

    // Clear existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    switch (currentSection) {
        case 'executive':
            content.innerHTML = renderExecutive();
            break;
        case 'agents':
            content.innerHTML = renderAgents();
            createAgentCharts();
            break;
        case 'orchestration':
            content.innerHTML = renderOrchestration();
            break;
        case 'evolution':
            content.innerHTML = renderEvolution();
            break;
        case 'safety':
            content.innerHTML = renderSafety();
            break;
        case 'costs':
            content.innerHTML = renderCosts();
            createCostCharts();
            break;
    }
}

function renderExecutive() {
    const exec = metricsData.executive_overview;

    return `
        <h2 class="section-title">Executive Overview</h2>
        <div class="grid">
            <div class="card">
                <div class="card-title">Monthly Revenue</div>
                <div class="card-value success">$${formatNumber(exec.monthly_revenue)}</div>
                <div class="card-subtitle">Trailing 30 days</div>
            </div>
            <div class="card">
                <div class="card-title">Monthly Costs</div>
                <div class="card-value warning">$${formatNumber(exec.monthly_costs)}</div>
                <div class="card-subtitle">LLM + infrastructure</div>
            </div>
            <div class="card">
                <div class="card-title">Monthly Profit</div>
                <div class="card-value ${exec.monthly_profit >= 0 ? 'success' : 'error'}">
                    $${formatNumber(exec.monthly_profit)}
                </div>
                <div class="card-subtitle">Revenue - Costs</div>
            </div>
            <div class="card">
                <div class="card-title">Active Businesses</div>
                <div class="card-value">${exec.businesses_active}</div>
                <div class="card-subtitle">Currently running</div>
            </div>
            <div class="card">
                <div class="card-title">Completed Businesses</div>
                <div class="card-value success">${exec.businesses_completed}</div>
                <div class="card-subtitle">Successfully deployed</div>
            </div>
            <div class="card">
                <div class="card-title">Discarded Businesses</div>
                <div class="card-value error">${exec.businesses_discarded}</div>
                <div class="card-subtitle">Not viable</div>
            </div>
            <div class="card">
                <div class="card-title">Tasks Completed</div>
                <div class="card-value">${exec.tasks_completed_30d}</div>
                <div class="card-subtitle">Last 30 days</div>
            </div>
            <div class="card">
                <div class="card-title">Success Rate</div>
                <div class="card-value success">${(exec.system_success_rate * 100).toFixed(1)}%</div>
                <div class="card-subtitle">System-wide</div>
            </div>
        </div>
    `;
}

function renderAgents() {
    const agents = metricsData.agent_performance.agents;
    const summary = metricsData.agent_performance.summary;

    let html = `
        <h2 class="section-title">Agent Performance</h2>
        <div class="grid">
            <div class="card">
                <div class="card-title">Total Agents</div>
                <div class="card-value">${summary.agents_reporting}</div>
                <div class="card-subtitle">Reporting metrics</div>
            </div>
            <div class="card">
                <div class="card-title">Avg Latency</div>
                <div class="card-value">${summary.avg_latency_seconds.toFixed(2)}s</div>
                <div class="card-subtitle">Per task</div>
            </div>
            <div class="card">
                <div class="card-title">Avg Cost</div>
                <div class="card-value">$${summary.cost_per_task_usd.toFixed(3)}</div>
                <div class="card-subtitle">Per task</div>
            </div>
            <div class="card">
                <div class="card-title">Total Tasks (7d)</div>
                <div class="card-value">${summary.tasks_last_7d}</div>
                <div class="card-subtitle">Last 7 days</div>
            </div>
        </div>

        <div class="chart-container">
            <h3>Agent Success Rates</h3>
            <canvas id="agentChart" height="80"></canvas>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Agent</th>
                    <th>Success Rate</th>
                    <th>Completed</th>
                    <th>Failed</th>
                    <th>Avg Duration</th>
                    <th>Cost/Task</th>
                    <th>Quality</th>
                </tr>
            </thead>
            <tbody>
                ${agents.map(agent => `
                    <tr>
                        <td><strong>${agent.agent.replace('_', ' ')}</strong></td>
                        <td><span class="badge badge-success">${(agent.success_rate * 100).toFixed(1)}%</span></td>
                        <td>${agent.completed}</td>
                        <td>${agent.failed}</td>
                        <td>${agent.avg_duration_seconds.toFixed(2)}s</td>
                        <td>$${agent.cost_per_task.toFixed(3)}</td>
                        <td>${agent.quality_score.toFixed(1)}/10</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    return html;
}

function renderOrchestration() {
    const orch = metricsData.orchestration;

    return `
        <h2 class="section-title">Orchestration Metrics</h2>

        <div class="grid">
            <div class="card">
                <div class="card-title">HTDAG Runs</div>
                <div class="card-value">${orch.htdag.total_runs}</div>
                <div class="card-subtitle">Task decompositions (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">HALO Routing</div>
                <div class="card-value">${orch.halo.routing_decisions}</div>
                <div class="card-subtitle">Agent routing decisions (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">AOP Validations</div>
                <div class="card-value">${orch.aop.total_validations}</div>
                <div class="card-subtitle">Validations (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">Circuit Breaker</div>
                <div class="card-value ${orch.circuit_breaker.status === 'CLOSED' ? 'success' : 'error'}">
                    ${orch.circuit_breaker.status}
                </div>
                <div class="card-subtitle">Trips: ${orch.circuit_breaker.trips}</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>HTDAG Details</h3>
                <p>Avg Depth: ${orch.htdag.avg_depth}</p>
                <p>Avg Nodes: ${orch.htdag.avg_nodes}</p>
                <p>Circular Dependencies: ${orch.htdag.circular_dependencies}</p>
            </div>
            <div class="card">
                <h3>HALO Details</h3>
                <p>Avg Routing Time: ${orch.halo.avg_routing_time_ms}ms</p>
                <p>Load Balancing Events: ${orch.halo.load_balancing_events}</p>
                <p>Routing Failures: ${orch.halo.routing_failures}</p>
            </div>
            <div class="card">
                <h3>AOP Details</h3>
                <p>Solvability Failures: ${orch.aop.solvability_failures}</p>
                <p>Completeness Failures: ${orch.aop.completeness_failures}</p>
                <p>Redundancy Detected: ${orch.aop.redundancy_detected}</p>
            </div>
        </div>

        <h3 class="section-title" style="margin-top: 30px;">⚠️ Error Monitoring (Last 24h)</h3>

        <div class="grid">
            <div class="card">
                <div class="card-title">Total Errors</div>
                <div class="card-value ${orch.errors.total_errors_24h > 0 ? 'error' : 'success'}">
                    ${orch.errors.total_errors_24h}
                </div>
                <div class="card-subtitle">Last 24 hours</div>
            </div>
            <div class="card">
                <div class="card-title">API Quota Errors</div>
                <div class="card-value ${orch.errors.api_quota_errors > 0 ? 'warning' : 'success'}">
                    ${orch.errors.api_quota_errors}
                </div>
                <div class="card-subtitle">429 / Quota exceeded</div>
            </div>
            <div class="card">
                <div class="card-title">LLM Failures</div>
                <div class="card-value ${orch.errors.llm_failures > 0 ? 'warning' : 'success'}">
                    ${orch.errors.llm_failures}
                </div>
                <div class="card-subtitle">Generation failures</div>
            </div>
            <div class="card">
                <div class="card-title">Critical Errors</div>
                <div class="card-value ${orch.errors.critical_errors > 0 ? 'error' : 'success'}">
                    ${orch.errors.critical_errors}
                </div>
                <div class="card-subtitle">Requires attention</div>
            </div>
        </div>

        ${orch.errors.recent_errors && orch.errors.recent_errors.length > 0 ? `
            <div class="card" style="margin-top: 20px;">
                <h3>📋 Recent Errors</h3>
                <div style="max-height: 400px; overflow-y: auto;">
                    <table style="font-size: 0.9rem;">
                        <thead>
                            <tr>
                                <th style="width: 150px;">Time</th>
                                <th style="width: 120px;">File</th>
                                <th>Error Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orch.errors.recent_errors.map(error => `
                                <tr>
                                    <td style="white-space: nowrap; font-size: 0.85rem;">${error.timestamp}</td>
                                    <td style="font-size: 0.85rem;">${error.file}</td>
                                    <td style="font-family: monospace; font-size: 0.8rem; color: #ef4444;">${error.message}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <p style="margin-top: 15px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; font-size: 0.9rem;">
                    <strong>💡 Troubleshooting:</strong><br>
                    • API Quota errors (429): System uses fallback generation - no action needed unless persistent<br>
                    • LLM failures: Check API keys in .env file<br>
                    • Critical errors: Review error log and restart Genesis if needed
                </p>
            </div>
        ` : `
            <div class="card" style="margin-top: 20px;">
                <h3>✅ No Recent Errors</h3>
                <p style="color: var(--success);">System is running smoothly - no errors in the last 24 hours.</p>
            </div>
        `}
    `;
}

function renderEvolution() {
    const evo = metricsData.evolution;

    return `
        <h2 class="section-title">Evolution & Learning</h2>

        <div class="grid">
            <div class="card">
                <div class="card-title">SE-Darwin Runs</div>
                <div class="card-value">${evo.se_darwin.evolution_runs}</div>
                <div class="card-subtitle">Evolution runs (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">Improvements</div>
                <div class="card-value success">${evo.se_darwin.improvements_generated}</div>
                <div class="card-subtitle">Generated (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">ATLAS Updates</div>
                <div class="card-value">${evo.atlas.learning_updates}</div>
                <div class="card-subtitle">Learning updates (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">AgentGit Commits</div>
                <div class="card-value">${evo.agentgit.commits}</div>
                <div class="card-subtitle">Commits (7d)</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>SE-Darwin</h3>
                <p>Quality Improvement: +${evo.se_darwin.avg_quality_improvement_pct}%</p>
                <p>Archive Size: ${evo.se_darwin.archive_size}</p>
            </div>
            <div class="card">
                <h3>ATLAS</h3>
                <p>Knowledge Items: ${evo.atlas.knowledge_items_learned}</p>
                <p>Learning Rate: ${(evo.atlas.learning_rate * 100).toFixed(1)}%</p>
            </div>
            <div class="card">
                <h3>AgentGit</h3>
                <p>Versions Tracked: ${evo.agentgit.versions_tracked}</p>
                <p>Rollbacks (7d): ${evo.agentgit.rollbacks}</p>
            </div>
        </div>
    `;
}

function renderSafety() {
    const safety = metricsData.safety;

    return `
        <h2 class="section-title">Safety & Governance</h2>

        <div class="grid">
            <div class="card">
                <div class="card-title">Policy Violations</div>
                <div class="card-value ${safety.policy_violations.total > 0 ? 'warning' : 'success'}">
                    ${safety.policy_violations.total}
                </div>
                <div class="card-subtitle">Last 7 days</div>
            </div>
            <div class="card">
                <div class="card-title">Approvals Requested</div>
                <div class="card-value">${safety.human_oversight.approvals_requested}</div>
                <div class="card-subtitle">Human oversight (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">Unsafe Detections</div>
                <div class="card-value ${safety.waltzrl.unsafe_detections > 0 ? 'error' : 'success'}">
                    ${safety.waltzrl.unsafe_detections}
                </div>
                <div class="card-subtitle">WaltzRL (7d)</div>
            </div>
            <div class="card">
                <div class="card-title">Safety Score</div>
                <div class="card-value success">${safety.waltzrl.safety_score}/100</div>
                <div class="card-subtitle">Overall safety</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>Violations by Severity</h3>
                <p>Critical: <span class="error">${safety.policy_violations.critical}</span></p>
                <p>High: <span class="warning">${safety.policy_violations.high}</span></p>
                <p>Medium: <span class="warning">${safety.policy_violations.medium}</span></p>
            </div>
            <div class="card">
                <h3>Human Oversight</h3>
                <p>Granted: <span class="success">${safety.human_oversight.approvals_granted}</span></p>
                <p>Denied: <span class="error">${safety.human_oversight.approvals_denied}</span></p>
                <p>Avg Response: ${safety.human_oversight.avg_response_time_minutes}min</p>
            </div>
            <div class="card">
                <h3>WaltzRL</h3>
                <p>Feedback Loops: ${safety.waltzrl.feedback_loops}</p>
                <p>Safety Score: ${safety.waltzrl.safety_score}/100</p>
            </div>
        </div>
    `;
}

function renderCosts() {
    const costs = metricsData.cost_optimization;

    return `
        <h2 class="section-title">Cost Optimization</h2>

        <div class="grid">
            <div class="card">
                <div class="card-title">Monthly Baseline</div>
                <div class="card-value">$${costs.cost_comparison.monthly_baseline_usd}</div>
                <div class="card-subtitle">Expected cost</div>
            </div>
            <div class="card">
                <div class="card-title">Monthly Actual</div>
                <div class="card-value success">$${costs.cost_comparison.monthly_actual_usd.toFixed(2)}</div>
                <div class="card-subtitle">Current spend</div>
            </div>
            <div class="card">
                <div class="card-title">Cost Reduction</div>
                <div class="card-value success">${costs.cost_comparison.cost_reduction_pct.toFixed(1)}%</div>
                <div class="card-subtitle">Savings achieved</div>
            </div>
        </div>

        <div class="chart-container">
            <h3>LLM Usage Distribution</h3>
            <canvas id="llmChart" height="80"></canvas>
        </div>

        <div class="card">
            <h3>LLM Breakdown</h3>
            <table>
                <thead>
                    <tr>
                        <th>Provider</th>
                        <th>Calls</th>
                        <th>Percentage</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>GPT-4o</strong></td>
                        <td>${costs.llm_usage.gpt4o.calls}</td>
                        <td>${costs.llm_usage.gpt4o.percentage.toFixed(1)}%</td>
                        <td>$${costs.llm_usage.gpt4o.cost_usd.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Gemini Flash</strong></td>
                        <td>${costs.llm_usage.gemini_flash.calls}</td>
                        <td>${costs.llm_usage.gemini_flash.percentage.toFixed(1)}%</td>
                        <td>$${costs.llm_usage.gemini_flash.cost_usd.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Claude Sonnet</strong></td>
                        <td>${costs.llm_usage.claude_sonnet.calls}</td>
                        <td>${costs.llm_usage.claude_sonnet.percentage.toFixed(1)}%</td>
                        <td>$${costs.llm_usage.claude_sonnet.cost_usd.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="card">
            <h3>Active Optimizations</h3>
            <ul>
                ${costs.active_optimizations.map(opt => `<li>${opt}</li>`).join('')}
            </ul>
        </div>
    `;
}

function createAgentCharts() {
    const agents = metricsData.agent_performance.agents;

    const ctx = document.getElementById('agentChart');
    if (ctx) {
        charts.agentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: agents.map(a => a.agent.replace('_agent', '')),
                datasets: [{
                    label: 'Success Rate (%)',
                    data: agents.map(a => a.success_rate * 100),
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

function createCostCharts() {
    const costs = metricsData.cost_optimization.llm_usage;

    const ctx = document.getElementById('llmChart');
    if (ctx) {
        charts.llmChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['GPT-4o', 'Gemini Flash', 'Claude Sonnet'],
                datasets: [{
                    data: [
                        costs.gpt4o.calls,
                        costs.gemini_flash.calls,
                        costs.claude_sonnet.calls
                    ],
                    backgroundColor: ['#4f46e5', '#10b981', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(2);
}

function showError(message) {
    document.getElementById('content').innerHTML = `
        <div class="error-message">
            <strong>Error:</strong> ${message}
        </div>
    `;
}
