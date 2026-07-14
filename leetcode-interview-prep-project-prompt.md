# Prompt: Build Me a Follow-Along LeetCode Interview Prep Project

Copy everything under **Prompt** into a new coding-agent conversation opened in the directory where you want the project created.

---

## Prompt

I want you to design and build a hands-on interview-preparation project for LeetCode-style software engineering interviews.

I am an experienced software engineer, but I am relatively inexperienced with LeetCode, competitive-programming conventions, and recognizing algorithmic patterns under interview pressure. Do not treat me as a beginner programmer. Focus teaching time on problem decomposition, pattern recognition, complexity analysis, selecting data structures, communicating during an interview, and turning a reasonable first approach into a correct and efficient solution.

The finished project should use the same general learning style as an interactive coding workshop:

- It contains a sequence of progressively unlocked steps.
- In step `n`, I edit focused TODOs until an automated condition passes.
- Each step has written instructions, starter code, tests, graduated hints, and a clear pass condition.
- Tests should evaluate correctness, edge cases, and complexity-sensitive behavior where practical.
- The project tracks progress and tells me what lesson, document, and source file to open next.
- Hints should help me reason toward an answer without immediately revealing complete solutions.
- Reference solutions should not be visible during the normal learning path unless I explicitly choose that format during the interview below.
- The project should teach a repeatable interview process, not just provide a bag of unrelated problems.

Your first job is not to build anything. Your first job is to interview me and determine what project would fit me best.

### Phase 1: Inspect the environment

Before asking questions, inspect the current workspace non-destructively. Determine whether a project already exists, which languages and package managers are available, and whether there are repository conventions you should preserve. Do not ask me questions that the environment can answer.

Briefly summarize what you discovered before beginning the interview.

### Phase 2: Interview me

Conduct a structured but conversational interview. Ask questions in small groups of no more than three at a time, and wait for my answers before continuing. Prefer meaningful multiple-choice options with a recommended default, but allow me to answer freely.

Do not rush into proposing a curriculum. Continue until you understand all of the following:

#### Goals and interview context

- What roles and seniority levels I am targeting.
- Whether I am preparing for a particular company style or general technical interviews.
- My expected interview timeline and weekly time budget.
- Whether my goal is interview readiness, rebuilding fundamentals, improving speed, or some combination.
- What success should look like in observable terms.

#### Current algorithm experience

- Which LeetCode or similar problems I have attempted and how they felt.
- My comfort with Big-O analysis.
- My familiarity with arrays, strings, hash maps, linked lists, stacks, queues, trees, heaps, graphs, recursion, dynamic programming, tries, intervals, and union-find.
- Whether I can usually find a brute-force solution but struggle to optimize, or struggle earlier with problem decomposition.
- How comfortable I am deriving an algorithm without remembering a named pattern.
- Whether syntax, data-structure APIs, mathematical reasoning, or interview pressure is the larger obstacle.

Do not make me self-rate everything with vague labels such as “beginner” or “advanced.” Ask for concrete evidence or short diagnostic examples where useful.

#### Language and tooling

- Which interview language I want to use.
- Whether I want language-specific data-structure utilities supplied or built as exercises.
- Whether tests should use a standard test runner, a custom CLI, or both.
- Whether I want to practice LeetCode-compatible function signatures, realistic application-oriented wrappers, or both.
- Whether I want all work in one progressive project, separate topic folders, or another organization.

#### Learning and feedback style

- Whether I want focused TODOs, light scaffolding, or near-blank exercises.
- Whether hints should be Socratic questions, increasingly explicit technical hints, or a mixture.
- Whether and when full solutions may be revealed.
- How much written theory I want before coding.
- Whether I learn best from one evolving problem, several carefully selected problems, or a hybrid.
- Whether failed tests should identify the failing category or remain closer to opaque interview feedback.
- Whether I want timed attempts, untimed learning, or timed checkpoints only after mastery.

#### Interview simulation

- How often I want mock-interview checkpoints.
- Whether the system should require me to write down clarifying questions, examples, invariants, and complexity before coding.
- Whether I want behavioral prompts for explaining tradeoffs and responding to interviewer hints.
- Whether evaluation should include communication artifacts as well as executable code.
- How strict the mock interviewer should be about incomplete reasoning, premature coding, and unspoken assumptions.

#### Scope and progression

- Which topic families should be included or excluded.
- Whether the curriculum should prioritize the most common interview patterns or target known weaknesses first.
- The desired number and approximate duration of lessons.
- Whether review should use spaced repetition, mixed-topic retrieval practice, or linear completion.
- Whether previously solved problems should return with changed constraints or disguised surface details.

If my answers reveal a major gap, ask a short diagnostic question or propose a tiny read-only reasoning exercise before deciding the curriculum. Do not turn the interview itself into a full coding assessment unless I agree.

### Phase 3: Reflect and resolve ambiguity

After the interview, summarize your understanding under these headings:

- Target outcome
- Current strengths
- Current gaps
- Constraints
- Preferred learning experience
- Proposed difficulty curve

Explicitly separate what I told you from assumptions you are making. Ask any final high-impact questions needed to resolve ambiguity. Do not begin implementation until the curriculum and project behavior are decision-complete and I approve the plan.

### Phase 4: Propose the project

Present a concrete implementation plan containing:

1. The learning arc and why it fits my interview target.
2. The exact lesson sequence and the pattern or skill each lesson teaches.
3. How concepts recur through spaced review rather than appearing only once.
4. The project structure, learner-facing commands, progress format, and reset behavior.
5. The interface each exercise exposes and what code is supplied versus left as TODOs.
6. The hint ladder and solution-reveal policy.
7. Automated verification strategy, including hidden edge cases and complexity guards.
8. Mock-interview checkpoints and how communication will be assessed.
9. Completion criteria and a final readiness assessment.

The plan must leave no meaningful design decisions to the implementer. Wait for my approval before creating or editing files.

### Phase 5: Build the approved workshop

Once approved, implement the complete project—not merely a curriculum document.

Unless the interview produces different requirements, use these defaults:

- A single progressive working tree.
- A CLI with `status`, `check`, `hint`, and `reset` commands.
- One instruction document and one focused source file per lesson.
- Three graduated hints per lesson.
- No visible full solutions.
- Deterministic, offline tests.
- Progress stored in a gitignored local file.
- Reset commands that clear progress and generated test state without overwriting my code.
- A final mixed-topic interview simulation that does not announce the relevant pattern.

Each lesson document should include:

- The interview skill being developed.
- Prerequisite knowledge.
- A problem statement with examples and constraints.
- Clarifying questions I should consider before coding.
- The expected learner workflow: understand, propose brute force, analyze, optimize, implement, test, and explain.
- The exact editable file and TODO boundary.
- The automated pass condition.
- Common traps stated without giving away the final algorithm.
- A post-pass reflection and one variation question.

Each learner source file should include comments that guide the reasoning process without containing a complete solution. Comments should prompt me to identify inputs, outputs, invariants, useful operations, brute-force complexity, and the evidence that an optimization preserves correctness. Avoid comments that simply spell out the final algorithm line by line.

### Curriculum design principles

Design for transfer and interview performance:

- Introduce patterns through problems rather than asking me to memorize a pattern catalog first.
- Require a correct brute-force baseline when that is pedagogically useful.
- Make complexity analysis executable where possible using operation counts, input scaling, or time bounds that are stable in local tests.
- Revisit concepts with different surface stories so passing requires recognition rather than memorized code.
- Mix related patterns only after each has been learned in isolation.
- Include boundary cases such as empty inputs, duplicates, negative values, overflow where relevant, skewed trees, disconnected graphs, and impossible results.
- Separate algorithm mistakes from language/API mistakes in test feedback.
- Preserve realistic interview constraints: no external network access, no specialized libraries that would not be available in an interview, and no mutation of inputs unless the contract permits it.
- Teach me to communicate assumptions and tradeoffs at the level expected of an experienced software engineer.

Do not over-index on obscure tricks. Prefer durable, high-frequency reasoning skills. Dynamic programming, advanced graph algorithms, or other difficult topics should appear only at a depth justified by my goals and diagnostic answers.

### Quality bar

Before handing off the completed project:

- Type-check and run all foundation tests.
- Verify the initial learner state fails only at the intended first TODO with a useful message.
- Privately exercise every lesson verifier against a correct implementation, then restore all learner files to their intended TODO state.
- Confirm progress is reset to lesson 1.
- Confirm no complete solutions remain visible if I selected hints-only mode.
- Review every instruction page for consistency with its source signature and verifier.
- Report exactly what was built, what was tested, and the command I should run first.

Throughout the work, remember the central calibration: I already know how to engineer software. Teach me how to solve and communicate algorithmic interview problems without wasting time explaining basic programming concepts I demonstrably understand.

---
