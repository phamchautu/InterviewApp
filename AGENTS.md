# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Feature Development Protocol

For EVERY feature, Antigravity MUST strictly execute the following sequential workflow:

1. **Information Gathering**:
   - Investigate requirements, codebase structure, dependencies, and relevant documentation.
   - Inspect existing architecture and UI/UX patterns.

2. **Implementation Planning**:
   - Create a detailed implementation plan in `implementation_plan.md`.
   - Explicitly highlight design choices and open questions.
   - Wait for the user's feedback/comments and explicit approval before modifying code.

3. **UI MCP Connection**:
   - Check if UI MCP tools are needed for design/asset generation or visual review.
   - Explicitly offer the user the choice: connect/use UI MCP or proceed without UI MCP.

4. **Implementation (UX First)**:
   - Prioritize User Experience: intuitive user flows, clear visual hierarchy, responsive layout, loading/error states, and smooth interactions.
   - Write clean, maintainable, typed code following the Expo/React Native conventions.

5. **Add Unit Tests**:
   - Write unit and component tests (e.g. Jest / React Native Testing Library) covering key flows, edge cases, and user interactions.
   - Verify tests pass cleanly.

6. **Review and Push Code**:
   - Review changes and git diffs against requirements.
   - Run verification checks (lint, typecheck, test runner).
   - Commit cleanly and push code to the remote repository.
