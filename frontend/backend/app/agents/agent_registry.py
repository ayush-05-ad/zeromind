import time
from typing import Dict, Any, List
from datetime import datetime

from app.agents.orchestrator import orchestrator_agent
from app.agents.researcher import researcher_agent
from app.agents.coder import coder_agent
from app.agents.analyzer import analyzer_agent
from app.agents.writer import writer_agent
from app.agents.study_helper import study_helper_agent
from app.agents.reviewer import reviewer_agent


# Registry of all available agents
AGENT_REGISTRY = {
    "orchestrator": orchestrator_agent,
    "researcher": researcher_agent,
    "coder": coder_agent,
    "analyzer": analyzer_agent,
    "writer": writer_agent,
    "study_helper": study_helper_agent,
    "reviewer": reviewer_agent,
}


class AgentPipeline:
    """Executes the multi-agent pipeline for a given task.

    Flow:
    1. Orchestrator creates execution plan
    2. Each agent executes its subtask in order
    3. Results are chained — each agent gets previous agent's output
    4. Reviewer does final quality check
    5. Final output returned to user
    """

    def __init__(self):
        self.execution_log: List[Dict] = []

    async def run(self, task: str, callback=None) -> Dict[str, Any]:
        """Execute the full agent pipeline.

        Args:
            task: User's task description
            callback: Optional async function called after each step
                      callback(step_data) for real-time updates

        Returns:
            Dict with: final_output, execution_plan, steps, total_tokens, total_time_ms
        """
        start_time = time.time()
        total_tokens = 0
        steps = []

        # Step 1: Orchestrator creates the plan
        if callback:
            await callback({
                "event": "agent:activated",
                "agent": "orchestrator",
                "status": "running",
                "message": "Planning task execution..."
            })

        plan_result = await orchestrator_agent.execute(task)
        plan = plan_result["output"]
        total_tokens += plan_result.get("tokens_used", 0)

        steps.append({
            "step": 0,
            "agent": "orchestrator",
            "action": "task_decomposition",
            "output": str(plan),
            "status": "completed",
            "tokens": plan_result.get("tokens_used", 0),
            "model": plan_result.get("model", "unknown")
        })

        if callback:
            await callback({
                "event": "agent:completed",
                "agent": "orchestrator",
                "status": "completed",
                "message": f"Plan created: {len(plan.get('subtasks', []))} subtasks",
                "plan": plan
            })

        # Step 2: Execute each subtask
        previous_output = ""
        subtasks = plan.get("subtasks", [])

        for subtask in subtasks:
            agent_name = subtask.get("agent", "writer")
            instruction = subtask.get("instruction", task)
            step_num = subtask.get("step", 0)

            agent = AGENT_REGISTRY.get(agent_name)
            if not agent:
                print(f"Warning: Agent '{agent_name}' not found, skipping...")
                continue

            if callback:
                await callback({
                    "event": "agent:activated",
                    "agent": agent_name,
                    "step": step_num,
                    "status": "running",
                    "message": f"{agent.role} is working..."
                })

            # Execute agent with context from previous steps
            try:
                result = await agent.execute(
                    task=instruction,
                    context={
                        "previous_output": previous_output,
                        "original_task": task,
                        "plan": plan
                    }
                )

                previous_output = result.get("output", "")
                total_tokens += result.get("tokens_used", 0)

                steps.append({
                    "step": step_num,
                    "agent": agent_name,
                    "action": instruction[:200],
                    "output": previous_output[:2000],
                    "status": "completed",
                    "tokens": result.get("tokens_used", 0),
                    "tools_used": result.get("tools_used", []),
                    "model": result.get("model", "unknown")
                })

                if callback:
                    await callback({
                        "event": "agent:completed",
                        "agent": agent_name,
                        "step": step_num,
                        "status": "completed",
                        "message": f"{agent.role} finished!",
                        "output_preview": previous_output[:300]
                    })

            except Exception as e:
                steps.append({
                    "step": step_num,
                    "agent": agent_name,
                    "action": instruction[:200],
                    "output": f"Error: {str(e)}",
                    "status": "failed",
                    "tokens": 0,
                    "model": "none"
                })

                if callback:
                    await callback({
                        "event": "agent:failed",
                        "agent": agent_name,
                        "step": step_num,
                        "message": f"Error: {str(e)}"
                    })

        total_time_ms = int((time.time() - start_time) * 1000)

        return {
            "final_output": previous_output,
            "execution_plan": plan,
            "steps": steps,
            "total_tokens": total_tokens,
            "total_time_ms": total_time_ms,
            "agents_used": [s["agent"] for s in steps],
            "status": "completed"
        }


# Singleton instance
agent_pipeline = AgentPipeline()
