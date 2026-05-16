# ADR-002: Feature-Sliced Design + Atomic Design for Frontend

## Status
Accepted

## Context
The frontend needs a scalable structure that enforces separation between UI primitives and domain-aware components.

## Decision
Combine FSD (layer-based imports) with Atomic Design (UI composition):
- FSD enforces import direction: `shared → entities → features → widgets → pages → app`
- Atomic Design lives inside `shared/ui/`: atoms → molecules → organisms
- Atoms/molecules/organisms have zero knowledge of domain types, Zustand, or WebSocket

## Consequences
✅ Clear rules for where each file belongs  
✅ Atoms testable without any domain or WebSocket knowledge  
✅ Storybook stories are pure — no mocking of business logic in atoms/molecules  
✅ Adding a new currency pair requires changes in one place  
❌ More directories than a flat `components/` approach  
❌ Engineers unfamiliar with FSD need onboarding  
