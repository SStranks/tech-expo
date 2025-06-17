# 📁 Folder: `types/`

## 📌 Purpose

Holds TypeScript type declarations shared across the app. These include DTOs, enums, interfaces for services, and contextual types (e.g. GraphQL context, Express request extensions).

## 📐 Scope

- Shared, global or cross-layer TypeScript types
- GraphQL input/output types (if not colocated)
- DB DTOs (exported from Drizzle types or customized)

## 🔗 Dependencies

- `drizzle-orm`, `zod`
- Your project’s internal model/service types

## 📄 Example Files

| File         | Description                          |
| ------------ | ------------------------------------ |
| `company.ts` | `TCompanyDTO`, `TCompanyWithCountry` |
| `graphql.ts` | GraphQL context or auth user types   |

## 🧠 Common Patterns

- Use `types.d.ts` for global declarations
- Avoid putting logic or imports here — keep it clean
