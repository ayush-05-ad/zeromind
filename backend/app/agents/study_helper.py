from typing import Dict, Any
from app.agents.base_agent import BaseAgent


class StudyHelperAgent(BaseAgent):
    """Student-focused agent — exam prep, notes, quizzes, study planning.
    This is ZeroMind's KEY DIFFERENTIATOR for students.
    """

    def __init__(self):
        super().__init__()
        self.name = "study_helper"
        self.role = "Exam Prep, Notes, Quizzes & Study Planning"
        self.tools = ["web_search"]
        self.system_prompt = """You are the Study Helper Agent of ZeroMind — designed specifically for college students.

Your capabilities:
1. **Notes Generation**: Create comprehensive, exam-ready notes from topics or syllabus
2. **Quiz Generation**: Create MCQs, short answer, and long answer questions with answers
3. **Study Plan**: Create day-wise study schedules based on exam dates and syllabus
4. **Concept Explanation**: Explain complex topics in simple language with examples and analogies
5. **Previous Year Questions**: Generate probable exam questions based on topic patterns
6. **Assignment Help**: Structure assignments, suggest content, provide references
7. **Placement Prep**: DSA practice plans, aptitude tips, interview preparation
8. **Syllabus Analysis**: Break down syllabus into important vs less important topics

Rules:
- Always structure notes with headings, subheadings, bullet points
- Include mnemonics and memory tricks where possible
- Add real-world examples and analogies for complex concepts
- For quizzes: provide answers AND explanations
- For study plans: be realistic about time allocation
- Use simple language — explain like talking to a friend
- Highlight important terms and definitions
- Include diagrams descriptions where helpful (describe what diagram should look like)
- Mark topics as [IMPORTANT], [MODERATE], or [OPTIONAL] for exam priority
"""

    async def execute(self, task: str, context: Dict = None) -> Dict[str, Any]:
        """Help students with study-related tasks."""
        previous = context.get("previous_output", "") if context else ""

        # Detect sub-type of study task
        task_lower = task.lower()
        if any(w in task_lower for w in ["quiz", "mcq", "question", "test"]):
            study_type = "quiz_generation"
        elif any(w in task_lower for w in ["notes", "summarize", "summary", "explain"]):
            study_type = "notes_generation"
        elif any(w in task_lower for w in ["plan", "schedule", "timetable", "routine"]):
            study_type = "study_plan"
        elif any(w in task_lower for w in ["placement", "interview", "dsa", "aptitude"]):
            study_type = "placement_prep"
        elif any(w in task_lower for w in ["assignment", "project", "report"]):
            study_type = "assignment_help"
        else:
            study_type = "concept_explanation"

        type_instructions = {
            "quiz_generation": """Generate a quiz with:
- 10 MCQs with 4 options each (mark correct answer)
- 5 Short answer questions (2-3 line answers)
- 3 Long answer questions (detailed answers)
- Include difficulty level for each: [Easy], [Medium], [Hard]
- Provide explanations for MCQ answers""",

            "notes_generation": """Create comprehensive exam-ready notes with:
- Clear topic headings and subheadings
- Key definitions highlighted
- Important formulas/concepts in boxes
- Real-world examples for each concept
- Memory tricks and mnemonics
- Mark importance: [IMPORTANT], [MODERATE], [OPTIONAL]
- Summary at the end""",

            "study_plan": """Create a detailed study plan with:
- Day-wise schedule with specific time slots
- Topics to cover each day with estimated time
- Break times and revision slots
- Weekly revision days
- Tips for each study session
- Priority order of topics
- Include buffer days for unexpected delays""",

            "placement_prep": """Create a placement preparation guide with:
- DSA topics to cover (priority order)
- Daily practice plan (easy → medium → hard problems)
- Key aptitude topics and shortcuts
- Common interview questions for the topic
- Resources and practice platforms
- Tips for each round (aptitude, coding, technical, HR)""",

            "assignment_help": """Help structure the assignment with:
- Suggested outline/table of contents
- Key points to cover in each section
- References and sources to cite
- Word count suggestions per section
- Formatting guidelines
- Tips for getting better marks""",

            "concept_explanation": """Explain the concept with:
- Simple definition (like explaining to a friend)
- Real-world analogy
- Step-by-step breakdown
- Examples with solutions
- Common mistakes to avoid
- Related concepts to know
- Exam tips for this topic"""
        }

        prompt = f"""Task: {task}

Study Task Type: {study_type}

Additional context: {previous[:2000] if previous else 'None'}

{type_instructions[study_type]}

Remember: You're helping a B.Tech engineering student. Use simple language, practical examples, and focus on what's most likely to come in exams."""

        result = await self.think(prompt, temperature=0.5)

        return {
            "output": result["response"],
            "status": "completed",
            "tokens_used": result.get("tokens", 0),
            "tools_used": [],
            "model": result.get("model", "unknown"),
            "study_type": study_type
        }


study_helper_agent = StudyHelperAgent()
