---
name: feat
description: "Pipeline complet d'une feature : du brief utilisateur jusqu'a la Pull Request prete a review, en 7 phases. Utiliser quand l'utilisateur veut implementer une feature complete."
---

# /workflow:feat — Pipeline complet d'une feature

Orchestre le cycle de vie complet d'une feature, du brief utilisateur jusqu'a la Pull Request prete a review, en 7 phases.

```
Brief -> Grill -> PRD/Plan -> Issues GitHub -> Code (TDD) -> Review -> PR
Phase 1   Phase 2   Phase 3     Phase 4        Phase 5     Phase 6  Phase 7
```

Chaque phase requiert une **validation explicite de l'utilisateur** avant de passer a la suivante. Ne jamais enchainer automatiquement.

## Utilisation

```
/workflow:feat Description de la feature a implementer
```

L'argument `$ARGUMENTS` contient la description de la feature fournie par l'utilisateur.

---

## Phase 1 — Comprendre le besoin

**Objectif** : Recueillir et structurer le besoin de l'utilisateur.

1. Si `$ARGUMENTS` contient une description, l'utiliser comme point de depart
2. Si `$ARGUMENTS` est vide, demander a l'utilisateur de decrire la feature souhaitee
3. Explorer la codebase pour comprendre l'etat actuel du code en lien avec la feature
4. Presenter un resume structure :
   - Titre de la feature
   - Description du probleme a resoudre
   - Solution envisagee
   - Modules/fichiers potentiellement concernes
   - Zones floues detectees

**Demander** : "Le resume est-il correct ? On passe au grill ?"

---

## Phase 2 — Grill (stress-test de la feature)

**Objectif** : Clarifier toutes les ambiguites par un interrogatoire structure.

1. Invoquer le skill `grill-me` avec le contexte de la feature
2. Explorer le code existant pour proposer des recommandations a chaque question
3. Couvrir systematiquement :
   - Comportement attendu et cas limites
   - Donnees : entites, champs, relations (schema Prisma)
   - Permissions et roles (Better Auth organizations)
   - UI/UX : flux, ecrans, etats (loading, empty, error)
   - Performance : volumes, cache, requetes
   - Edge cases et scenarios d'erreur
   - Impact sur les features existantes

Continuer jusqu'a resolution complete de toutes les branches de decision.

**Demander** : "Toutes les zones d'ombre sont levees. On genere le PRD ?"

---

## Phase 3 — Generation du PRD et plan d'implementation

**Objectif** : Produire les specifications et un plan phase.

### 3a. PRD

Invoquer le skill `write-a-prd` avec le contexte du grill. Le PRD doit contenir :
- **Problem Statement** : probleme utilisateur resolu
- **Solution** : solution retenue
- **User Stories** : format "En tant que {role}, je veux {action} afin de {benefice}"
- **Implementation Decisions** : decisions techniques, schema, API
- **Testing Decisions** : strategie de tests
- **Out of Scope** : ce qui est exclu
- **Further Notes** : notes complementaires

### 3b. Plan d'implementation

Invoquer le skill `prd-to-plan` avec le PRD genere :
- Decoupage en **tracer-bullet vertical slices**
- Chaque phase = tranche verticale complete (schema -> API/actions -> UI -> tests)
- Chaque phase est demo-able individuellement
- Plan sauvegarde dans `./plans/{feature-name}.md`

**Demander** : "Le PRD et le plan te conviennent ? On decoupe en issues ?"

---

## Phase 4 — Creation des issues GitHub (conditionnelle)

**Objectif** : Creer une issue GitHub par vertical slice, **uniquement si le plan contient 3+ phases ou si la feature est complexe** (multi-module, backend + frontend, plusieurs jours de travail).

**Si la feature est simple** (modification d'un seul composant, < 1 jour de travail) : **sauter cette phase** et passer directement a la Phase 5. Informer l'utilisateur que la creation d'issues n'est pas necessaire.

**Si la feature necessite des issues** :

1. Invoquer le skill `prd-to-issues` avec le PRD
2. Pour chaque phase du plan, creer une issue GitHub via `gh issue create` :
   - **Titre** : `[Feature] Phase N : {titre}`
   - **Body** : what to build + acceptance criteria + blocked by
   - **Labels** : `feature`, `backend` / `frontend` / `fullstack`
3. Creer une issue parente qui reference toutes les sous-issues

**Demander** : "Les issues sont creees. On lance l'implementation ?"

---

## Phase 5 — Implementation (TDD)

**Objectif** : Implementer la feature en approche TDD.

### Preparation Git

```bash
git checkout main && git pull && git checkout -b feat/{feature-name-kebab-case}
```

### Implementation

Invoquer le skill `tdd` pour chaque phase du plan :

1. **Planning** : confirmer les interfaces et comportements a tester
2. **Tracer bullet** : RED -> GREEN pour le premier comportement
3. **Boucle incrementale** : RED -> GREEN pour chaque comportement suivant
4. **Refactor** : une fois tous les tests au vert, nettoyer le code

### Verification continue

Apres chaque phase :
- Type checking : `pnpm ts`
- Linting : `pnpm lint`
- Tests unitaires : `pnpm test:ci`
- Si applicable, tests e2e : `pnpm test:e2e:ci`

### Regles specifiques au projet

- Server Components par defaut, `"use client"` uniquement si necessaire
- Server actions dans des fichiers `.action.ts` via `safe-actions.ts`
- API routes via `zod-route.ts`
- Formulaires avec TanStack Form (jamais React Hook Form)
- HTTP client : `up-fetch.ts` (jamais `fetch` directement)
- Dialogs via `dialog-manager`
- Imports : toujours utiliser les alias `@/`, `@app/`, `@email/`

**Demander** : "L'implementation est terminee. On lance la review ?"

---

## Phase 6 — Review complete

**Objectif** : Valider qualite, securite et performance.

### Verifications automatiques

```bash
pnpm ts          # Type checking
pnpm lint        # ESLint
pnpm test:ci     # Tests unitaires
```

### Review manuelle

Verifier systematiquement :

| Domaine | Points de controle |
|---------|--------------------|
| **Conventions** | Respect du CLAUDE.md, patterns existants, nommage |
| **Securite** | Validation serveur, pas de secrets, XSS, injection |
| **Performance** | Pas de N+1, cache Redis si pertinent, lazy loading |
| **Accessibilite** | HTML semantique, labels, navigation clavier, contrastes |
| **Tests** | Couverture des chemins critiques, tests comportementaux |
| **Types** | Strict TypeScript, pas de `any`, Zod aux frontieres |

### Cycle de correction

Si des problemes sont detectes : corriger -> re-verifier. **Maximum 2 cycles**.

**Demander** : "La review est clean. On cree la PR ?"

---

## Phase 7 — Creation de la Pull Request

**Objectif** : PR vers `main` avec resume complet.

### 1. Commit & Push

```bash
git add <fichiers-modifies>
git commit -m "feat({scope}): {description}"
git push -u origin feat/{feature-name-kebab-case}
```

Le message de commit suit le format conventional commits :
- `feat` pour une nouvelle feature
- `fix` pour un bugfix
- Scope = module principal concerne

### 2. Creation de la PR

Creer la PR via `gh pr create` :

```bash
gh pr create --title "feat({scope}): {description}" --body "$(cat <<'EOF'
## Summary

- {Description principale de la feature}
- {Changements secondaires}

## Changes

- {Liste des fichiers/modules modifies}

## Test plan

- [ ] Tests unitaires passes (`pnpm test:ci`)
- [ ] Type checking passe (`pnpm ts`)
- [ ] Lint passe (`pnpm lint`)
- [ ] {Tests manuels specifiques a la feature}
EOF
)"
```

### 3. Mise a jour du changelog

Ajouter une entree dans `CHANGELOG.md` a la date du jour :

```markdown
## YYYY-MM-DD

FEATURE: {Description courte de la feature}
```

### 4. Mise a jour des issues GitHub

Si des issues ont ete creees en Phase 4, ajouter un commentaire sur chaque issue avec le lien de la PR.

---

## Regles transversales

- **Validation humaine obligatoire** entre chaque phase
- **Langue** : reponses en francais, code en anglais, commits en anglais (conventional commits)
- **Conventions** : respecter le CLAUDE.md et les `.claude/rules/` du projet
- **Git** : toujours brancher depuis `main`
- **Scope** : ne jamais modifier de code hors du scope de la feature
- **Avant d'editer** : toujours lire au moins 3 fichiers similaires pour garantir la coherence
