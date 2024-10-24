![KnockBallArena_Logo](https://raw.githubusercontent.com/bobis33/KnockBallArena/main/public/logo.png)

[![KnockBallArena_CI](https://github.com/bobis33/KnockBallArena/actions/workflows/client-build.yml/badge.svg)](https://github.com/bobis33/KnockBallArena/actions/workflows/client-build.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/bobis33/KnockBallArena)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/bobis33/KnockBallArena/blob/main/LICENSE.md)


# KnockBallArena

## Challenge Web #1 | B3 Development Web & Application Efrei Bordeaux

run project:

first run db:
```bash
npm run supabase:start && npm run supabase:db:reset
```
if it doesn't work try with sudo


```bash
npm run web:start
```

You have a default user : default1@default.fr password: default

you can view the project at http://localhost:3000, db at http://localhost:54323 aand api at http://localhost:54321

# Commit Norms

| Commit Type | Description                                                                                                               |
|:------------|:--------------------------------------------------------------------------------------------------------------------------|
| build       | Changes that affect the build system or external dependencies (npm, make, etc.)                                           |
| ci          | Changes related to integration files and scripts or configuration (Travis, Ansible, BrowserStack, etc.)                   |
| feat        | Addition of a new feature                                                                                                 |
| fix         | Bug fix                                                                                                                   |
| perf        | Performance improvements                                                                                                  |
| refactor    | Modification that neither adds a new feature nor improves performance                                                     |
| style       | Change that does not affect functionality or semantics (indentation, formatting, adding space, renaming a variable, etc.) |
| docs        | Writing or updating documentation                                                                                         |
| test        | Addition or modification of tests                                                                                         |


# License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/bobis33/KnockBallArena/blob/main/LICENSE.md) file for details.
