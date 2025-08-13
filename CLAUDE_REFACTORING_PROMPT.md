# Claude Code Refactoring Execution Prompt

## Context & Instructions

You are about to help execute a comprehensive refactoring strategy for the DreamPlace Next.js application. This is a systematic transformation from a simple landing page into a scalable, enterprise-grade platform following SOLID principles and advanced design patterns.

## How to Use This Prompt

Copy and paste this prompt to Claude Code when you're ready to begin the refactoring process:

---

## **REFACTORING EXECUTION PROMPT**

```
I need you to help me execute the comprehensive refactoring plan for my DreamPlace application. Please read the REFACTORING_TASKLIST.md file first to understand the complete strategy and context.

IMPORTANT INSTRUCTIONS:

1. **READ THE TASKLIST FIRST**: Start by reading /home/gggaspen/DOCUMENTOS_LINUX/_DREAMPLACE/dreamplace/REFACTORING_TASKLIST.md to understand the full context, current state analysis, and refactoring strategy.

2. **PHASE-BY-PHASE EXECUTION**: Work through the phases in order (Phase 1 → Phase 2 → Phase 3, etc.). Do not skip phases unless explicitly requested.

3. **TASK TRACKING**: For each task you complete:
   - Mark the task as completed by changing [ ] to [x] in the REFACTORING_TASKLIST.md file
   - Use the TodoWrite tool to track your current progress
   - Update me on what you've completed and what's next

4. **IMPLEMENTATION APPROACH**:
   - Follow SOLID principles and clean architecture patterns
   - Implement TypeScript strict mode compliance
   - Create comprehensive tests for new code
   - Document all architectural decisions
   - Ensure backward compatibility during transitions

5. **QUALITY STANDARDS**:
   - All new code must have TypeScript strict mode enabled
   - Implement proper error handling and logging
   - Add unit tests with >80% coverage for new components
   - Follow the established design patterns and architecture
   - Create documentation for all new public APIs

6. **RISK MANAGEMENT**:
   - Make incremental changes that can be tested and verified
   - Maintain application functionality throughout the process
   - Create backup points before major structural changes
   - Test thoroughly after each phase completion

7. **COMMUNICATION**:
   - Explain your approach before starting each major task
   - Alert me to any potential breaking changes
   - Ask for clarification if any requirements are unclear
   - Provide progress updates at logical stopping points

8. **STARTING POINT**: 
   Begin with Phase 1: Foundation & Infrastructure Setup, specifically:
   - Task 1.1: Development Environment Enhancement
   - Start with subtask 1.1.1: Configure Prettier with consistent formatting rules

CURRENT REQUEST: Please start by reading the REFACTORING_TASKLIST.md file and then begin Phase 1, Task 1.1. Update the tasklist file to mark your progress as you complete each subtask.

Ready to begin the transformation? Let's build something amazing! 🚀
```

---

## **Alternative Focused Prompts**

If you want to work on specific phases or have limited time, you can use these focused prompts:

### **Foundation Only (Phase 1)**
```
Please read REFACTORING_TASKLIST.md and focus only on Phase 1: Foundation & Infrastructure Setup. This includes TypeScript strict mode, testing setup, and development environment enhancement. Mark your progress in the tasklist as you complete each subtask.
```

### **Architecture Focus (Phase 2)**
```
Please read REFACTORING_TASKLIST.md and work on Phase 2: Architecture Redesign. Focus on implementing clean architecture, state management, and API layer refactoring. Ensure Phase 1 is completed first or let me know if you need to complete any prerequisites.
```

### **Component Modernization (Phase 3)**
```
Please read REFACTORING_TASKLIST.md and work on Phase 3: Component Architecture Modernization. Focus on design system implementation, component refactoring, and performance optimization. Verify that Phases 1-2 are completed first.
```

### **Quick Assessment**
```
Please read REFACTORING_TASKLIST.md and provide me with:
1. An assessment of which phases are most critical for immediate implementation
2. Estimated time for each phase
3. Any potential blockers or dependencies I should be aware of
4. Recommendations for the optimal execution order based on the current codebase state
```

## **Tips for Effective Execution**

### **Before Starting**
1. Ensure you have a clean git state with no uncommitted changes
2. Create a new branch for the refactoring work: `git checkout -b refactor/architecture-modernization`
3. Back up your current working application
4. Understand the current functionality that must be preserved

### **During Execution**
1. **Work in Small Commits**: Commit frequently with descriptive messages
2. **Test Continuously**: Run `npm run dev` after major changes to ensure the app still works
3. **Document Changes**: Update the tasklist and add comments for complex implementations
4. **Stay Organized**: Use the TodoWrite tool to track immediate tasks and blockers

### **Quality Checkpoints**
After each phase completion, verify:
- [ ] Application still runs without errors (`npm run dev`)
- [ ] All tests pass (`npm run test` if implemented)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compilation succeeds (`npm run build`)
- [ ] No console errors in the browser
- [ ] All functionality remains intact

### **Communication Guidelines**
- **Ask Questions**: If any part of the refactoring plan is unclear, ask for clarification
- **Report Blockers**: If you encounter issues that prevent progress, document them clearly
- **Suggest Improvements**: If you identify better approaches during implementation, propose them
- **Celebrate Progress**: Acknowledge completed phases and major milestones

### **Rollback Strategy**
If any phase introduces breaking changes:
1. Document the specific issue encountered
2. Revert to the last working commit
3. Propose an alternative approach or adjusted timeline
4. Update the tasklist with lessons learned

## **Success Indicators**

You'll know the refactoring is successful when:
- [ ] All tasks in the REFACTORING_TASKLIST.md are marked as completed [x]
- [ ] TypeScript strict mode is enabled with zero `any` types
- [ ] Comprehensive test coverage is implemented
- [ ] Application performance is improved (measured by bundle size and load times)
- [ ] Code quality metrics meet the defined standards
- [ ] Architecture follows SOLID principles and clean code patterns
- [ ] Future feature development is significantly easier and faster

---

## **Ready to Execute?**

Copy the main **REFACTORING EXECUTION PROMPT** above and paste it to Claude Code to begin your transformation journey from a simple landing page to a scalable, professional application.

Good luck with your refactoring! 🎯