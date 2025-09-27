![Repository Banner](./assets/repo_banner.jpg)
<br>

_Tech-Expo is a full-stack CRM-style application showcasing secure microservice architecture, modern DevOps practices, and production-grade observability_

![Top Language Badge](https://img.shields.io/github/languages/top/SStranks/tech-expo)
![RepoSize Badge](https://img.shields.io/github/repo-size/SStranks/tech-expo)
![Last Commit Badge](https://img.shields.io/github/last-commit/SStranks/tech-expo)

[![CodeQL Badge](https://github.com/SStranks/tech-expo/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/SStranks/tech-expo/actions/workflows/github-code-scanning/codeql)
[![MegaLint Badge](https://github.com/SStranks/tech-expo/actions/workflows/lint.yaml/badge.svg)](https://github.com/SStranks/tech-expo/actions/workflows/lint.yaml)
[![Test Badge](https://github.com/SStranks/tech-expo/actions/workflows/test.yaml/badge.svg)](https://github.com/SStranks/tech-expo/actions/workflows/test.yaml)
[![Dependencies Badge](https://github.com/SStranks/tech-expo/actions/workflows/dependencies.yaml/badge.svg)](https://github.com/SStranks/tech-expo/actions/workflows/dependencies.yaml)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [Infrastructure](#infrastructure)
  - [Database](#database-schema)
  - [Observability](#observability)
  - [Directory Structure](#directory-structure)
- [Setup and Usage](#setup-and-usage)
  - [Production Emulation](#production-emulation)
    - [Quickstart](#quickstart)
  - [Development](#development)
- [Live Demo](#live-demo)
- [Future Features](#future-features)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

<!-- TODO: Demo videos, screenshot, GIFs -->

Tech-Expo is a full-stack CRM-style application showcasing secure microservice architecture, modern DevOps practices, and production-grade observability.

I built this project to simulate how modern businesses manage and present customer data at scale, while serving as a capstone project to highlight enterprise-level engineering skills, technical ability, and attention to detail in managing a complex polished mono-repo.

It includes core CRM capabilities like customer management, secure authentication, real-time dashboard, while demonstrating modern DevOps and observability practices such as TLS certification, encrypted credential protocol, pre-commit scans, and more.

🎥 [Watch Project Overview Video [30s]]()

## Features

<details open>
<summary>Frontend</summary>
</br>

- **Framework**: React, with Redux, React-Router, React-Hook-Form
- **UI**: drag-drop Kanban board, calendar, filter-sort-paginate TanStack tables, quote PDF, user comment system, tool-tips
- **UX**: Responsive design, ARIA components and accessibility concern, sidebar and transition animations
- **Auth**: sign-up system, password strength check, persistent login (access/refresh token), TLS certification
- **State**: Redux, Apollo Client
- **Optimization**: code-splitting, lazy-loading, brotli compression, and Webpack build optimizations

</details>

<details>
<summary>Backend</summary>
</br>

- **Framework**: ExpressJS with GraphQL
- **API**: REST endpoints, GraphQL queries/mutations
- **Verification**: account verification, confirmation, and expiring token via nodemailer
- **Authentication**: password reset/update, JWT with secure cookies, access/refresh token system
- **Authorization**: role-based access, route protection, resource ownership rules
- **Database integration**: PostgreSQL, MongoDB, Redis
- **Schemas**: migration, development DB seeding, and type-safe ORM (Drizzle) schema design
- **Error Handling**: graceful termination, global error handling, logging with Pino, and production logging with Rollbar
- **Security**: secure Docker secrets and .env, audit trail, Argon2 password encryption, rate limiting, input validation and sanitization, helmet

</details>

<details>
<summary>Infrastructure & DevOps</summary>
</br>

- **Dockerfile**: custom brotli-enabled Nginx image, multi-stage and PNPM friendly layer caching
- **Compose**: multi-environment (dev, prod, swarm) multi-service orchestration
- **Secrets**: in-place secret encrypt/decrypt with Mozilla SOPS, scoped permissions/ownership of TLS keys
- **Persistence**: named database volumes, tmpfs for certification files (for dev)
- **Scripting**: processing permissions/ownership of TLS files (for dev), custom init/healthcheck, docker init helper
- **Scalability**: Docker swarm compliant
- **Security**: public-facing reverse Nginx proxy, secure internal networking, Wireguard VPN for metrics access
- **Monitoring**: scraping of expressjs and databases with Prometheus, core metrics dashboard in Grafana

</details>

<details>
<summary>Monitoring</summary>
</br>

- **Prometheus**: metrics exposed from expressJS service, postgreSQL, mongo, redis
- **Grafana**: unified dashboard with UP status overview, docker container metrics (cAdvisor), annotations, alerts
- **Dashboard**: dedicated rows for expressJS and each database; latency, query ops, memory use, requests/errors
- **Alerts**: Grafana email alerts for databases offline, high-rate 5xx server errors, redis max-memory
- **Logging**: Pino logger from expressJS to MongoDB, Rollbar real-time monitoring
- **Health checks**: docker service health checks for auto-restart resilience
- **Security**: dedicated Docker network for metrics, TLS protected, accessible through WireGuard VPN

</details>

<details>
<summary>Repo Management / Developer Experience</summary>
</br>

- **PNPM Monorepo**: centralized configuration store (/packages), repo and app targeted scripts
- **Presentation**: EditorConfig, Prettier, Eslint, Stylelint, and CommitLint conventions/styles alignment
- **Git**: CommitLint enforcing commit conventions, Husky running MegaLinter linting pre-commit
- **Actions**: github workflows for linting, testing, and dependency checks
- **Testing**: Vitest setup for unit/integration tests, Cypress for E2E
- **Security**: full SecretLint pre-commit check, MegaLinter local security scan
- **Logging**: dedicated logs folder for pre-commit megalinter report, eslint, stylelint, and secretlint scan reports
- **Documentation**: comprehensive well-structured README files

</details>

## Tech Stack

<!-- markdown-link-check-disable -->

<details open>
<summary>Repository Management</summary>
<br>

[![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![EditorConfig](https://img.shields.io/badge/Editor%20Config-fefefe?style=for-the-badge&logo=editorconfig&logoColor=black)](https://editorconfig.org/)

</details>

<details>
<summary>Languages</summary>
<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GNU Bash](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)](https://pubs.opengroup.org/onlinepubs/9799919799/)
[![Sass](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)](https://sass-lang.com/)
[![HTML5](https://img.shields.io/badge/HTML-e34c26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
<br/>

</details>

<details>
<summary>Frontend</summary>
<br>

[![Webpack](https://img.shields.io/badge/webpack-%238dd6f9.svg?style=for-the-badge&logo=webpack&logoColor=white)](https://webpack.js.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Apollo GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)](https://www.apollographql.com)
[![Storybook](https://img.shields.io/badge/-Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)

</details>

<details>
<summary>Backend</summary>
<br>

[![esbuild](https://img.shields.io/badge/esbuild-%23FFCF00.svg?style=for-the-badge&logo=esbuild&logoColor=black)](https://esbuild.github.io/)
[![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![Drizzle](https://img.shields.io/badge/drizzle-%23C5F74F.svg?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

</details>

<details>
<summary>Infrastructure</summary>
<br>

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/Mongo-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![NGINX](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/)
[![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)](https://prometheus.io/)
[![Rollbar](https://img.shields.io/badge/Rollbar-%233569F3.svg?style=for-the-badge&logo=rollbar&logoColor=white)](https://rollbar.com/)

</details>

<details>
<summary>Security</summary>
<br>

[![OpenSSL](https://img.shields.io/badge/openssl-%23731513.svg?style=for-the-badge&logo=openssl&logoColor=white)](https://www.openssl.org/)
[![Mozilla SOPS](https://img.shields.io/badge/SOPS-%23161616.svg?style=for-the-badge&logo=mozilla&logoColor=white)](https://getsops.io/)
[![WireGuard](https://img.shields.io/badge/wireguard-%2388171A.svg?style=for-the-badge&logo=wireguard&logoColor=white)](https://www.wireguard.com/)
[![JSON Web Tokens](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://www.jwt.io/)

</details>

<details>
<summary>Testing</summary>
<br>

[![Cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)](https://www.cypress.io/)
[![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)](https://vitest.dev/)
[![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Testing Library](https://img.shields.io/badge/-Testing%20Library-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)](https://testing-library.com/)
[![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)](https://developer.chrome.com/)
[![Firefox Browser](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://www.firefox.com/en-GB/channel/desktop/developer/)

</details>

<details>
<summary>Tools</summary>
<br>

[![DBeaver](https://img.shields.io/badge/DBeaver-382923?style=for-the-badge&logo=dbeaver&logoColor=white)](https://dbeaver.io/)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)
[![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/)
[![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Stylelint](https://img.shields.io/badge/stylelint-263238.svg?style=for-the-badge&logo=stylelint&logoColor=white)](https://stylelint.io/)
[![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)

</details>

<details>
<summary>Development Environment</summary>
<br>

[![Debian](https://img.shields.io/badge/Debian%20Trixie%20x86/64-a81d33?style=for-the-badge&logo=debian&logoColor=white)](https://www.debian.org/)
[![WSL2](https://img.shields.io/badge/WSL2-000000?style=for-the-badge&logo=linux&logoColor=ffcc33)](https://learn.microsoft.com/en-us/windows/wsl/install)
[![W10 Terminal](https://img.shields.io/badge/W10%20Terminal-4D4D4D?style=for-the-badge&logo=gnometerminal)](https://learn.microsoft.com/en-us/windows/terminal/install)

</details>

<!-- markdown-link-check-enable -->

## Architecture

### Infrastructure

<details open>
<summary>Infrastructure Diagram</summary>
<br>

![Architecture Diagram](./assets/architecture_diagram.jpg)

</details>

### Database Schema

<details>
<summary>PostgreSQL</summary>

###### Interactive Diagram

Explore the components of the postgres architecture through this interactive schema diagram: [`Interactive Postgres Diagram`](https://sstranks.github.io/tech-expo/assets/docs/reports/postgres/index.html)

###### Static Diagram

![Postgres Diagram](./assets/architecture_postgres.png)

</details>

<details>
<summary>GraphQL</summary>

###### Interactive Diagram

Explore the components of the graphql architecture through this interactive schema diagram: [`Interactive GraphQL Diagram`](https://sstranks.github.io/tech-expo/assets/docs/reports/graphql/index.html)

###### Static Diagram

![GraphQL Diagram](./assets/architecture_graphql.png)

</details>
<details>
<summary>Mongo</summary>

###### Interactive Diagram

Explore the components of the mongo architecture through this interactive schema diagram: [`Interactive Mongo Diagram`](https://sstranks.github.io/tech-expo/assets/docs/reports/mongo/index.html)

###### Static Diagram

![Mongo Diagram](./assets/architecture_mongo.png)

</details>

### Observability

<details>
<summary>Metrics Collection Diagram</summary>
</details>

### Directory Structure

```console
./
├─ .github/                           # github workflows
├─ .husky/                            # commit workflows
├─ .vscode/                           # vscode settings
├─ apps/                              # mono-repo applications
│  └─ crm/
│     ├─ client/                      # service; React
│     ├─ server/                      # service; ExpressJS
│     ├─ docker/
│     │  ├─ certs/                    # TLS certification
│     │  ├─ grafana/                  # service; monitoring
│     │  └─ ...more services
│     └─ shared/                      # shared types
├─ logs/
├─ node_modules/
├─ packages/                          # mono-repo configurations
├─ scripts/                           # root package.json scripts
├─ package.json
├─ .mega-linter.lint.yaml             # pre-commit linting
├─ .mega-linter.security.yaml         # manual security scan
└─ ...configuration files
```

## Setup and Usage

### Production Emulation

The application is designed to run in a Docker Swarm environment. For local use, a production-like setup is provided via [`docker-compose.prod.yml`](./apps/crm/docker/docker-compose.prod.yml), which does not require Docker Swarm.

For prerequisite certification files and detailed instructions, see the [`Docker README.md`](./apps/crm/docker/README.md).

<!-- TODO: Make quickstart: generate all required files in script -->

#### Quickstart

- Install prerequisite dependencies (see below): `Docker` `Mozilla SOPS`
- Download or Clone repository
- Run quickstart helper script;
  - generates required files: .env, .secret, TLS certification
  - output `.secret.credentials` unencrypted secrets reference for quick-access
  - automatically initializes [`docker-compose.prod.yml`](./apps/crm/docker/docker-compose.prod.yml)

```bash
git clone https://github.com/SStranks/tech-expo
cd tech-expo/apps/crm/docker
./quickstart.prod.sh
```

###### Docker

- Version: 28 or higher (Rootless recommended for security, but not strict requirement)
- Platform: Linux
- Installation: [Docker](https://docs.docker.com/engine/install/)

###### Mozilla SOPS

- Used for file encryption and secret management
- Required to run the supplied Docker setup as-is
- Alternative tools can be used, but Docker secret paths and initialization scripts (`docker.sh`) must be updated accordingly
- Installation: [Mozilla SOPS](https://github.com/getsops/sops)

### Development

###### PNPM

- Version: 10.13.1 as defined in [`package.json`](./package.json#packagemanager)
- Install via:

```bash
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<10.13.1> sh -
```

- For further information and alternative installation options: [PNPM](https://pnpm.io/installation)

###### Node

- Version: 22 as defined in [`package.json`](./package.json#engines_node)
- Recommended: Use NVM to manage multiple Node versions
- Installation: [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and
  [Node](https://nodejs.org/en/download)

###### Oxsecurity/Megalinter

- Version: 8
- Warning: Large image (11Gb)
- Used for pre-commit linting and security scans
- Installation: `docker pull oxsecurity/megalinter:v8`

###### Debugging

Please refer to the respective readme files for details on debugging configuration using VSCode:

[`Frontend README.md`](./apps/crm/client/README.md#debugging)

[`Backend README.md`](./apps/crm/server/README.md#debugging)

[`Docker README.md`](./apps/crm/docker/README.md#debugging)

For tool specific configuration refer to the respective readme sections:

[`DBeaver`](./apps/crm/docker/README.md#dbeaver)

[`Postman`](./apps/crm/server/README.md#postman)

## Live Demo

## Future Features

While this capstone demonstrates the foundation of an expo management system, I’ve identified several directions for future development. Some are geared toward expanding the product for a real-world use case, while others focus on engineering practices that reflect progression from junior to senior software engineer:

<details>
<summary>Future Features List</summary>

#### Interactive 3D Expo Map

- A landing page with a Three.js virtual expo hall where attendees can navigate booths and talks

#### Real-Time Attendee Features

- WebSocket-powered chat, Q&A, and live booth updates for collaborative engagement.

#### Ticketing & Payments:

- Stripe integration for ticket sales, booth reservations, and premium sessions.

#### Exhibitor & Sponsor Analytics:

- Dashboards for tracking booth visits, popular sessions, and attendee engagement.

#### Internationalization (i18n):

- Support for multiple languages, time zones, and currencies.

#### Infrastructure as Code:

- Terraform for reproducible cloud environments.

#### Event-Driven Microservices:

- Splitting monolith into services (e.g., payments, notifications, scheduling) to improve scalability.

#### Observability Enhancements:

- Expanding tracing and log aggregation with OpenTelemetry/ELK stack.

#### Mobile-Friendly PWA:

- Offline schedules, push notifications, and home-screen installation for attendees on the go.

</details>

## License

Licensed under the MIT License – see [`LICENSE`](./LICENSE) for details.

## Acknowledgements

A special thanks to the following platforms, communities and services that supported my learning journey on this project.

<!-- markdown-link-check-disable -->

![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![MDN Web Docs](https://img.shields.io/badge/MDN_Web_Docs-black?style=for-the-badge&logo=mdnwebdocs&logoColor=white)
![Stack Overflow](https://img.shields.io/badge/-Stackoverflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white)
![Stack Exchange](https://img.shields.io/badge/StackExchange-%23ffffff.svg?style=for-the-badge&logo=StackExchange&logoColor=black)
![freeCodeCamp](https://img.shields.io/badge/Freecodecamp-%23123.svg?&style=for-the-badge&logo=freecodecamp&logoColor=green)
![Udemy](https://img.shields.io/badge/Udemy-A435F0?style=for-the-badge&logo=Udemy&logoColor=white)
![OpenAI](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)

<!-- markdown-link-check-enable -->
