<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 1.1.0
Amendment Date: 2025-10-05

Principles Modified:
- I. Code Quality Standards → Added minimal dependencies constraint
- III. User Experience Consistency → Added responsive design requirements and enhanced UI/UX standards

Sections Added:
- Responsive Design subsection in Principle III
- Dependency Minimization guidelines in Principle I

Sections Removed:
- None

Templates Status:
✅ plan-template.md - Constitution Check aligns with updated principles
✅ spec-template.md - Requirements support responsive web and minimal dependencies
✅ tasks-template.md - Task categorization supports responsive design testing
⚠️  Future agent files - Should include responsive design and dependency constraints

Follow-up TODOs:
- When generating features, ensure responsive design is tested across breakpoints
- Evaluate all new dependencies against minimal dependencies principle

Rationale for v1.1.0 (MINOR):
- New guidance added to existing principles (responsive design, minimal dependencies)
- Expanded UI/UX standards without breaking existing requirements
- No removal or redefinition of existing principles
-->

# Client Product Manager Constitution

## Core Principles

### I. Code Quality Standards

**Requirements**:
- All code MUST follow established language-specific style guides and linting rules
- Code MUST be self-documenting with clear naming conventions
- Complex logic MUST include explanatory comments
- Functions MUST have a single responsibility with clear inputs and outputs
- Code duplication MUST be eliminated through reusable abstractions
- All dependencies MUST be explicitly declared with version pinning
- MUST NOT introduce compiler/linter errors without immediate resolution

**Dependency Minimization** (NEW):
- Dependencies MUST be evaluated for necessity before adoption
- Prefer native/standard library solutions over external dependencies
- Each dependency MUST be justified by:
  * Solving a complex problem that native solutions cannot reasonably address
  * Active maintenance with security updates
  * Acceptable license compatibility
  * Small bundle size impact for client-side code
- Dependencies MUST NOT duplicate functionality already provided by other dependencies
- Regular dependency audits MUST identify and remove unused or replaceable dependencies

**Rationale**: Maintainable code reduces technical debt, accelerates onboarding, and minimizes bugs. Quality standards ensure the codebase remains comprehensible as it scales. Minimal dependencies reduce security vulnerabilities, decrease bundle sizes, simplify maintenance, and reduce the risk of supply chain attacks.

### II. Testing Standards (NON-NEGOTIABLE)

**Test-Driven Development (TDD)**:
- Tests MUST be written before implementation (Red-Green-Refactor cycle)
- Implementation MAY NOT proceed until tests are written and failing
- All tests MUST pass before code is considered complete

**Coverage Requirements**:
- Contract tests MUST be written for all API endpoints before implementation
- Integration tests MUST cover all user-facing workflows
- Unit tests MUST cover business logic, validation, and edge cases
- Test coverage MUST exceed 80% for core business logic
- Tests MUST be independent, repeatable, and fast (<5s per test)

**Test Organization**:
- `tests/contract/` - API contract tests validating request/response schemas
- `tests/integration/` - End-to-end workflow tests
- `tests/unit/` - Isolated component tests

**Rationale**: TDD ensures correctness by design, provides living documentation, and enables confident refactoring. High test coverage catches regressions early and reduces production incidents.

### III. User Experience Consistency

**Responsive Design** (NEW):
- User interfaces MUST be fully responsive across mobile and desktop devices
- Mobile breakpoints MUST be tested at minimum: 320px, 375px, 768px
- Desktop breakpoints MUST be tested at minimum: 1024px, 1440px, 1920px
- Touch targets MUST be minimum 44×44px for mobile interactions
- Text MUST remain readable without horizontal scrolling at all breakpoints
- Images and media MUST scale appropriately without distortion
- Navigation patterns MUST adapt to screen size (e.g., hamburger menu for mobile)
- Performance MUST NOT degrade on mobile devices (see Performance Requirements)

**Design Principles**:
- User interfaces MUST follow a consistent design system
- User interactions MUST provide immediate feedback (<100ms perceived response)
- Error messages MUST be user-friendly, actionable, and never expose technical details
- Loading states MUST be shown for operations >200ms
- Accessibility MUST meet WCAG 2.1 Level AA standards
- Visual hierarchy MUST guide users through tasks intuitively
- White space MUST be used effectively to reduce cognitive load
- Color contrast MUST meet accessibility standards (4.5:1 for normal text, 3:1 for large text)

**Interaction Patterns**:
- Forms MUST validate inline with clear error indicators
- Confirmation MUST be required for destructive actions
- Success/error states MUST use consistent visual patterns
- Navigation MUST be intuitive with clear hierarchy
- Keyboard navigation MUST be fully supported
- Touch gestures MUST follow platform conventions on mobile devices

**Documentation**:
- User-facing features MUST include usage documentation
- API documentation MUST be automatically generated and kept in sync
- Breaking changes MUST be documented with migration guides

**Rationale**: Consistent UX reduces cognitive load, improves user satisfaction, and decreases support burden. Accessibility ensures inclusivity and often improves overall usability. Responsive design is essential for modern web applications where users access content across diverse devices. A well-designed interface directly impacts user retention and satisfaction.

### IV. Performance Requirements

**Response Time Targets**:
- API endpoints MUST respond within 200ms at p95 under normal load
- UI interactions MUST render within 100ms for perceived instant response
- Page loads MUST complete within 2 seconds on standard connections
- Database queries MUST execute within 50ms for simple operations
- Mobile page loads MUST complete within 3 seconds on 3G connections

**Resource Constraints**:
- Memory usage MUST stay below 500MB per service instance
- Database connections MUST be pooled and reused
- Large file operations MUST stream data rather than loading into memory
- Background jobs MUST not block user-facing operations
- Client-side bundles MUST be optimized (code splitting, lazy loading, tree shaking)
- Initial JavaScript bundle MUST be under 200KB (gzipped) for web applications

**Scalability**:
- Services MUST be designed for horizontal scaling
- State MUST NOT be stored in application memory
- Caching MUST be implemented for expensive operations
- Rate limiting MUST protect against abuse

**Monitoring**:
- All services MUST expose health check endpoints
- Performance metrics MUST be collected and monitored
- Slow queries MUST trigger alerts
- Performance regressions MUST fail CI/CD pipelines

**Rationale**: Performance directly impacts user satisfaction and retention. Clear targets enable objective measurement and prevent degradation over time. Mobile performance is critical as mobile users represent a significant and growing portion of web traffic.

## Development Workflow

### Planning Phase
1. Feature specifications MUST be documented in `spec.md` before technical planning
2. Implementation plans MUST be reviewed in `plan.md` with constitution compliance check
3. Research MUST resolve all ambiguities before design begins
4. Design artifacts (data-model, contracts, quickstart) MUST be created before implementation

### Implementation Phase
1. Tests MUST be written first (contract → integration → unit)
2. Tests MUST fail initially to verify they test the right behavior
3. Implementation MUST make tests pass without compromising quality
4. Linter errors MUST be resolved immediately
5. Each task MUST be committed atomically with descriptive messages

### Review Phase
1. All code MUST pass automated tests in CI pipeline
2. Code reviews MUST verify constitutional compliance
3. Performance benchmarks MUST meet targets
4. Documentation MUST be updated to reflect changes

## Quality Gates

**Phase 0 - Research**:
- [ ] All technical unknowns resolved
- [ ] Technology choices justified with alternatives considered
- [ ] Dependencies evaluated for security, maintenance, license, and necessity

**Phase 1 - Design**:
- [ ] Data model covers all entities and relationships
- [ ] API contracts defined for all endpoints
- [ ] Test scenarios written for all user stories
- [ ] Responsive design breakpoints identified
- [ ] Constitution compliance verified

**Phase 2 - Testing**:
- [ ] Contract tests written and failing
- [ ] Integration tests written and failing  
- [ ] Unit tests planned for business logic
- [ ] Performance test scenarios defined
- [ ] Responsive design tests written for key breakpoints

**Phase 3 - Implementation**:
- [ ] All tests passing
- [ ] No linter errors or warnings
- [ ] Code review approved
- [ ] Documentation updated

**Phase 4 - Validation**:
- [ ] Performance benchmarks meet targets
- [ ] Accessibility standards verified
- [ ] Responsive design validated across all breakpoints
- [ ] User documentation complete
- [ ] Quickstart scenarios pass

## Governance

### Constitution Authority
- This constitution supersedes all other development practices and guidelines
- All pull requests MUST demonstrate constitutional compliance
- Deviations MUST be explicitly justified in the Complexity Tracking section of the implementation plan
- Unjustified deviations MUST be rejected

### Amendment Process
1. Proposed amendments MUST be documented with rationale
2. Impact analysis MUST identify affected templates and workflows
3. Migration plan MUST be provided for existing code
4. All dependent documentation MUST be updated atomically
5. Version MUST be incremented according to semantic versioning:
   - MAJOR: Breaking changes to principles or removal of requirements
   - MINOR: New principles or expanded guidance
   - PATCH: Clarifications, corrections, or non-semantic improvements

### Compliance Review
- Constitution compliance MUST be verified at design phase (before implementation)
- Constitution compliance MUST be re-verified after design phase (before task generation)
- CI/CD pipelines MUST enforce automated quality gates
- Regular audits SHOULD verify ongoing compliance
- Team retrospectives SHOULD evaluate constitutional effectiveness

### Runtime Guidance
- Agent-specific guidance files MAY supplement this constitution
- Supplemental guidance MUST NOT contradict constitutional principles
- For Cursor-specific development guidance, see repository root agent files (e.g., `CLAUDE.md`, `AGENTS.md`)

### Continuous Improvement
- Constitution reviews SHOULD occur quarterly
- Team feedback MUST inform amendments
- Metrics SHOULD validate principle effectiveness
- Outdated or ineffective principles MUST be revised or removed

**Version**: 1.1.0 | **Ratified**: 2025-10-04 | **Last Amended**: 2025-10-05
