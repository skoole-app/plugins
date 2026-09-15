---
name: skoole-composer
description: >-
  Composer dans Skoole : lire ce que le formateur a déjà (bibliothèque, briques, modules, programmes), monter un module en rangeant les briques par temps, puis le poser dans le programme d'une classe et décider de l'ouverture. Déclencher sur « monte-moi un module », « prépare la séance de la semaine prochaine », « qu'est-ce que j'ai déjà sur ce thème », « range ça dans un module », « pose-le dans le programme de mes NDRC », « ouvre le cran à la classe ».
---

# Composer dans Skoole

Trois temps, jamais pris à l'envers : **lire**, **monter le module**, **poser
dans le programme**.

## 1. Lire ce qui existe

Toujours commencer par `skoole_me` : il rend le compte, les établissements,
les classes **avec leur identifiant**, et la portée du jeton.

**`skoole_library`** cherche dans la bibliothèque, avec la recherche de
l'écran (les mots portent sur le titre, les étiquettes et les modules) :

| Paramètre | Valeurs |
|---|---|
| `q` | les mots cherchés. Vide : tout |
| `type` | `presentation`, `course`, `quiz`, `questionnaire`, `exercise`, `game`, `element`, ou `all` |
| `module` | un identifiant de module, `all`, ou `none` (les briques rangées nulle part) |
| `limit` | 100 au maximum |

**`skoole_brick`** (`id`, `kind`) rend le CONTENU d'une brique : le corps d'un
cours ou d'un exercice, les questions d'un QCM ou d'un questionnaire, la suite
d'un lot de jeux, les fichiers d'un élément, les titres des slides. C'est la
lecture qui évite de réécrire ce qui existe déjà.

**`skoole_module`** (`id`) rend un module et ses contenus dans l'ordre, avec
leur temps. **`skoole_program`** (`class`) rend les programmes d'une classe,
leurs crans, et ce qui est ouvert.

> Une classe porte souvent **plusieurs programmes** (un par matière, un par
> formateur). Les lire avant d'en créer un.

## 2. Monter le module

1. **Verser d'abord les briques manquantes**, une par une, avec
   `skoole_import` (voir les compétences de format : `skoole-cours`,
   `skoole-qcm`, `skoole-questionnaire`, `skoole-exercice`, `skoole-jeux`).
   Garder l'identifiant rendu par chacune. **Chaque brique porte un
   `Identifiant :` stable** : renvoyée sous le même, elle est corrigée en
   place au lieu d'être dupliquée (`updated: true`), ou versionnée si des
   élèves sont passés (`previousId`, voir la compétence `skoole`).
   **Une présentation** (le zip du Studio) se verse en deux temps :
   `skoole_upload {}` rend une adresse signée (`url`) et un identifiant
   (`upload`) ; pousser le zip par
   `curl -X PUT -H 'Content-Type: application/zip' --data-binary @cours.zip '<url>'` ;
   puis `skoole_import { upload }`. Même `id` de `course.json` : remplacée en
   place.
2. **Créer le module** avec `skoole_module_create` (`title`, et si utile
   `description`, `tags`). Vérifier d'abord avec `skoole_library` qu'un module
   du même sujet n'existe pas déjà.
3. **Ranger chaque brique** avec `skoole_attach` (`module`, `brick`, `kind`,
   `phase`), dans l'ordre voulu : l'ordre des appels est l'ordre des contenus
   à l'intérieur d'un temps.

**Jamais un module vide posé pour plus tard.** Le module se crée quand ses
briques existent.

Les **cinq temps** (`phase`) et ce qu'on y range :

| Temps | Affiché | Ce qui y va |
|---|---|---|
| `comprendre` | Comprendre | présentations, cours |
| `pratiquer` | S'entraîner | exercices, jeux |
| `appliquer` | Appliquer | la mission sur l'entreprise fictive |
| `evaluer` | Évaluer | QCM, questionnaires |
| `elements` | Éléments | ce qui s'appuie : documents, fichiers, podcasts, images |

`phase` est facultatif : sans lui, la nature décide (cours et présentation en
`comprendre`, exercice et jeu en `pratiquer`, QCM et questionnaire en
`evaluer`, élément en `elements`). Le préciser quand la place voulue diffère
du défaut, et seulement là.

Les `kind` acceptés par `skoole_attach` : `presentation`, `course`, `quiz`,
`questionnaire`, `exercise`, `game`, `element`, `resource`.

## 3. Poser dans le programme

1. `skoole_program { class }` pour lire les programmes et choisir le bon.
   **Ne jamais deviner un identifiant de programme.**
2. S'il n'y en a aucun qui convienne, et seulement là :
   `skoole_program_create { class, title, subject }`.
3. `skoole_schedule { program, module, open }` pose le module dans un cran.

**Un module posé arrive tout fermé.** C'est voulu : le formateur ouvre séance
après séance. N'envoyer `open: true` que si le formateur l'a demandé
explicitement, dans cette conversation. Sans le paramètre, on ne touche à
rien.

Le geste est **idempotent** : reposer un module déjà présent ne casse rien, on
retrouve son cran (`already: true`).

> **La Bibliothèque crée, le programme diffuse, la classe porte les
> résultats.** Un module ne s'ouvre pas depuis le module : c'est le programme
> qui place.

## Un déroulé complet

Le formateur demande : « monte-moi un module sur la qualification d'un
prospect, pour mes NDRC 2, et pose-le dans leur programme. »

```
skoole_me
  -> classes: [{ id: "cls-…", nickname: "NDRC 2", establishment: "…" }]

skoole_library { q: "qualification prospect", type: "all" }
  -> un cours existant, rien d'autre

skoole_brick { id: "crs-…", kind: "course" }
  -> le cours couvre les quatre critères : on le garde tel quel

skoole_import { markdown: "<le QCM>", name: "qualification.qcm.md" }
  -> { brick: { type: "quiz", id: "qz-…", updated: false, previousId: null } }
skoole_import { markdown: "<l'exercice>", name: "trois-appels.md" }
  -> { brick: { type: "exercise", id: "ex-…", warnings: ["1 annexe(s) attendue(s)…"] } }

skoole_upload {}
  -> { upload: "dep-…", method: "PUT", url: "https://…" }
(dans le terminal) curl -X PUT -H 'Content-Type: application/zip' --data-binary @qualifier.zip '<url>'
skoole_import { upload: "dep-…" }
  -> { brick: { type: "presentation", id: "prs-…", warnings: ["12 slide(s), 3 média(s)."] } }

skoole_module_create { title: "Qualifier un prospect", tags: ["prospection"] }
  -> { module: { id: "mod-…" } }

skoole_attach { module: "mod-…", brick: "prs-…", kind: "presentation" }
skoole_attach { module: "mod-…", brick: "crs-…", kind: "course" }
skoole_attach { module: "mod-…", brick: "ex-…", kind: "exercise" }
skoole_attach { module: "mod-…", brick: "qz-…", kind: "quiz" }

skoole_program { class: "cls-…" }
  -> un programme « Relation client », id "prg-…"

skoole_schedule { program: "prg-…", module: "mod-…" }
  -> { stepId: "…", already: false, open: null }
```

Puis le dire au formateur : le module est posé et **fermé**, l'annexe de
l'exercice reste à déposer dans Skoole, et tout ce qui vient d'être posé porte
la marque du robot.

## Les refus qu'on peut rencontrer

| Réponse | Ce que ça veut dire |
|---|---|
| « Introuvable, ou hors de ce que ce compte peut lire. » | la chose appartient à quelqu'un d'autre, ou n'existe pas. Le connecteur ne dit jamais laquelle des deux : c'est voulu |
| « Nature inconnue. Attendu : presentation, course, quiz… » | le `kind` de `skoole_attach` est mal écrit |
| « Temps inconnu. Attendu : comprendre, pratiquer, appliquer, evaluer, elements. » | la `phase` est mal écrite |
| « Ce jeton ne porte pas la portée « Verser et piloter »… » | le formateur a autorisé « Verser » seulement : il peut lire et déposer, pas ranger ni programmer. Lui dire d'en créer un autre dans Skoole, Mon compte, Connecteur |
| « Authentification requise. » | la connexion n'est pas faite ou a été révoquée : `/mcp` puis Authenticate |
| « Aucun fichier à cet identifiant de dépôt… » | le `PUT` n'a pas été fait, ou pas sur cette adresse : refaire `skoole_upload`, pousser, puis `skoole_import { upload }` |
| « Donne `markdown` OU `upload`, pas les deux. » | un seul des deux par appel |

Un refus se rapporte au formateur, il ne se contourne pas.
