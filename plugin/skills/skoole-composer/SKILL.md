---
name: skoole-composer
description: >-
  Composer dans Skoole : lire ce que le formateur a déjà (bibliothèque, briques, modules, programmes), monter un module en rangeant les briques par temps et par zone, composer le fil de la séance, outiller un exercice (outils, calculs, pages), puis poser le module dans le programme d'une classe et décider de l'ouverture. Déclencher sur « monte-moi un module », « prépare la séance de la semaine prochaine », « qu'est-ce que j'ai déjà sur ce thème », « range ça dans un module », « accroche l'exercice à la bonne slide », « pose-le dans le programme de mes NDRC », « ouvre le cran à la classe ».
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
lecture qui évite de réécrire ce qui existe déjà. Pour un exercice,
`content.solution` est son corrigé rédigé ; `solution: null` avec
`solutionFile: true` veut dire qu'un corrigé existe en Word, que le connecteur
ne transporte pas, et non qu'il n'y en a pas.

**`skoole_module`** (`id`) rend un module et ses contenus dans l'ordre, avec
leur temps, leur nature, et l'identifiant de leur RANGEMENT (`contents[].id`).
**`skoole_program`** (`class`) rend les programmes d'une classe, leurs crans,
et ce qui est ouvert.

> Une classe porte souvent **plusieurs programmes** (un par matière, un par
> formateur). Les lire avant d'en créer un.

## 2. Monter le module

1. **Verser d'abord les briques manquantes**, une par une, avec
   `skoole_import` (voir les compétences de format : `skoole-cours`,
   `skoole-qcm`, `skoole-questionnaire`, `skoole-exercice`, `skoole-jeux`).
   Garder l'identifiant rendu par chacune. **Chaque brique porte un
   `Identifiant :` stable** : renvoyée sous le même, elle est corrigée en
   place au lieu d'être dupliquée (`updated: true`), ou versionnée si des
   élèves sont passés (`previousId`, voir la compétence `skoole`). Poser les
   étiquettes dès l'envoi (`tags`) : elles s'ajoutent, un réimport n'en
   retire jamais.
   **Une présentation** (le zip du Studio) se verse en deux temps :
   `skoole_upload {}` rend une adresse signée (`url`) et un identifiant
   (`upload`) ; pousser le zip par
   `curl -X PUT -H 'Content-Type: application/zip' --data-binary @cours.zip '<url>'` ;
   puis `skoole_import { upload }`. Même `id` de `course.json` : remplacée en
   place. L'adresse vaut deux heures, 100 Mo au plus.
   **Un document** (récapitulatif, corrigé, fiche) se verse avec
   `kind: "document"`, et `visibility: "formateur"` s'il ne doit jamais
   atteindre un élève ; il revient en `element`.
2. **Créer le module** avec `skoole_module_create` (`title`, et si utile
   `description`, `tags`). Vérifier d'abord avec `skoole_library` qu'un module
   du même sujet n'existe pas déjà.
3. **Ranger chaque brique** avec `skoole_attach` (`module`, `brick`, `kind`,
   et si utile `phase`, `zone`), dans l'ordre voulu : l'ordre des appels est
   l'ordre des contenus à l'intérieur d'un temps. Chaque appel rend `item`,
   l'identifiant du rangement : le garder pour le fil.

**Jamais un module vide posé pour plus tard.** Le module se crée quand ses
briques existent.

Les **cinq temps** (`phase`) rangent la vue de l'ÉLÈVE :

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

Les **zones** (`zone`) rangent la page du module, celle que voit le
FORMATEUR :

| Zone | Ce qui y va |
|---|---|
| `a_classer` | le défaut, ce dont on n'est pas sûr. Rien de ce qui est à classer ne part chez les élèves |
| `avant` | ce qui ouvre la séance |
| `apres` | ce qui la ferme |
| `disposition` | ce qui se consulte, jamais une étape |
| `formateur` | pour le formateur seul, jamais montré aux élèves : récapitulatif nominatif, corrigé, grille |

Poser ce dont on est sûr, laisser le reste à classer. Ce qui n'est que pour le
formateur se range DIRECTEMENT en `formateur`, jamais « à classer » en
comptant sur un geste à la main. Un QCM de positionnement sans zone ouvre ET
ferme la séance : ne lui mettre `avant` ou `apres` que s'il ne doit être que
d'un côté. Le FIL n'est pas une zone qu'on pose ici : on y entre par une
ancre (étape suivante).

Les `kind` acceptés par `skoole_attach` : `presentation`, `course`, `quiz`,
`questionnaire`, `exercise`, `game`, `element`, `resource`.

## 3. Composer le fil de la séance

Le fil, c'est la suite des slides, avec sous chaque slide les pièces qu'on y
accroche. Tout passe par `skoole_deroule` (la compétence `skoole` en donne le
détail).

```
skoole_deroule { module: "mod-…" }
  -> slides : le FICHIER, le numéro et le titre de chaque slide
     pieces : chaque rangement, avec sa zone, sa source (posee, nature, deduite), son ancre
     suggested : des ancres proposées, rien n'est posé

skoole_deroule { module: "mod-…", anchors: [
    { item: "itm-ex", presentation: "prs-…", slide: "9.html" }
] }
  -> la pièce entre dans le fil : relue zone: fil, zoneSource: posee
```

- **Une slide se désigne par son FICHIER**, jamais par son numéro.
- **Une ancre sort la pièce d'« à classer »** et la met dans le fil, après
  l'avoir fermée aux élèves dans chaque cran : c'est le formateur qui ouvre.
- **N'ancrer une pièce à classer que si on l'a versée soi-même, ou si le
  formateur le demande.**
- **Les numéros** (`numeros: [{ item, numero }]`) rangent la vue du formateur
  dans le programme de sa classe. ⚠️ **Ils ne changent RIEN pour les
  étudiants**, qui suivent l'ordre du module. Poser des numéros sur les pièces
  d'une slide efface le rang que le formateur y a posé au glisser.
- **Le déroulé écrit (`markdown`) n'existe plus** : il est refusé depuis le
  22 septembre 2026. Le fil fait ce qu'il faisait.

## 4. Outiller un exercice, et y mettre une page

`skoole_outils { brick }` (sans `add` ni `remove`) rend ce qui est déjà
rattaché à l'exercice ET tout ce qu'on peut rattacher : les outils du
formateur (des liens, des calculs, ses pages) et les calculs du catalogue de
Skoole. Puis `skoole_outils { brick, add: ["<ref>"] }`. L'élève trouve ce qui
est rattaché dans l'onglet **« Outils »** de l'exercice. Ne rattacher que ce
qui sert vraiment : c'est DONNÉ à l'élève avec l'exercice.

Un outil manque : `skoole_outil_create`, un lien (`name`, `url`) ou un calcul
en markdown. Appeler `skoole_outils` AVANT, pour ne rien recréer.

Un **site web complet** va dans les **Pages** du formateur, jamais dans une
slide ni dans une brique :

```
skoole_coffre { action: "list" }
  -> open: true, sites: [...]   (fermées : rien ne se publie, le formateur le demande à l'équipe Skoole)
skoole_upload { filename: "site-a-auditer.zip" }
(dans le terminal) curl -X PUT -H 'Content-Type: application/zip' --data-binary @site-a-auditer.zip '<url>'
skoole_coffre { action: "publish", upload: "dep-…", name: "Boutique à auditer" }
  -> { site: "…", url: "https://<nom>-<5 caractères>.skoole.page", remarks: [...] }
skoole_coffre { action: "list" }
  -> sites[].tool : l'outil de nature « site » de cette page
skoole_outils { brick: "ex-…", add: ["<tool>"] }
```

L'élève la trouve dans l'onglet « Outils » de l'exercice, affichée « Page »,
et l'ouvre dans un nouvel onglet. Pour la remplacer : `publish` avec `site`,
le lien ne change pas. Le nom devient l'adresse : jamais celui d'une école ni
d'un élève. Au formateur, dire « page », pas « coffre ».

## 5. Poser dans le programme

1. `skoole_program { class }` pour lire les programmes et choisir le bon.
   **Ne jamais deviner un identifiant de programme.**
2. S'il n'y en a aucun qui convienne, et seulement là :
   `skoole_program_create { class, title, subject }`.
3. `skoole_schedule { program, module, open, rank }` pose le module dans un
   cran. Sans `rank`, en dernier. Avec `rank`, le cran prend ce rang, celui que
   le formateur lit dans son programme (le premier vaut 1), et les suivants
   descendent. ⚠️ Un rang n'est pas `steps[].position`, valeur brute qui
   saute des numéros : compter le rang dans la liste.

**Un module posé arrive tout fermé.** C'est voulu : le formateur ouvre séance
après séance. N'envoyer `open: true` que si le formateur l'a demandé
explicitement, dans cette conversation. Sans le paramètre, on ne touche à
rien.

Le geste est **idempotent** : reposer un module déjà présent ne casse rien, on
retrouve son cran (`already: true`), et il n'est PAS déplacé, même avec
`rank` (`hint` le dit).

> **La Bibliothèque crée, le programme diffuse, la classe porte les
> résultats.** Un module ne s'ouvre pas depuis le module : c'est le programme
> qui place.

## Un exemple de bout en bout

Le formateur demande : « monte-moi un module sur la qualification d'un
prospect, pour mes NDRC 2, et pose-le dans leur programme. »

```
skoole_me
  -> classes: [{ id: "cls-…", nickname: "NDRC 2", establishment: "…" }]

skoole_library { q: "qualification prospect", type: "all" }
  -> un cours existant, rien d'autre

skoole_brick { id: "crs-…", kind: "course" }
  -> le cours couvre les quatre critères : on le garde tel quel

skoole_import { markdown: "<le QCM>", name: "qualification.qcm.md", tags: ["prospection"] }
  -> { brick: { type: "quiz", id: "qz-…", updated: false, previousId: null } }
skoole_import { markdown: "<l'exercice>", name: "trois-appels.md", tags: ["prospection"] }
  -> { brick: { type: "exercise", id: "ex-…", warnings: ["1 annexe(s) attendue(s)…"] } }

skoole_upload {}
  -> { upload: "dep-…", method: "PUT", url: "https://…" }
(dans le terminal) curl -X PUT -H 'Content-Type: application/zip' --data-binary @qualifier.zip '<url>'
skoole_import { upload: "dep-…" }
  -> { brick: { type: "presentation", id: "prs-…", warnings: ["12 slide(s), 3 média(s)."] } }

skoole_module_create { title: "Qualifier un prospect", tags: ["prospection"] }
  -> { module: { id: "mod-…" } }

skoole_attach { module: "mod-…", brick: "prs-…", kind: "presentation" }
skoole_attach { module: "mod-…", brick: "crs-…", kind: "course", zone: "disposition" }
skoole_attach { module: "mod-…", brick: "ex-…", kind: "exercise" }
  -> { item: "itm-ex" }          (à classer, en attendant son ancre)
skoole_attach { module: "mod-…", brick: "qz-…", kind: "quiz", zone: "apres" }

skoole_deroule { module: "mod-…" }
  -> la slide « À vous de jouer » est le fichier 9.html
skoole_deroule { module: "mod-…", anchors: [{ item: "itm-ex", presentation: "prs-…", slide: "9.html" }] }
  -> l'exercice est dans le fil, après la slide 9

skoole_program { class: "cls-…" }
  -> un programme « Relation client », id "prg-…"

skoole_schedule { program: "prg-…", module: "mod-…" }
  -> { stepId: "…", already: false, open: null }
```

Puis le dire au formateur : le module est posé et **fermé**, l'exercice est
accroché à la slide 9, l'annexe de l'exercice reste à déposer dans Skoole, et
tout ce qui vient d'être posé porte la marque du robot.

## 6. Corriger et défaire

**Corriger un module** : `skoole_module_update { module, title }` (ou
`description`, ou `tags`, la liste entière). Un paramètre absent ne change
rien. Jamais un second module pour corriger le premier.

**Défaire** : deux gestes, jamais le même.

| Geste | Ce qu'il fait | Ce qu'il ne fait pas |
|---|---|---|
| `skoole_detach` | sort une brique d'un module | elle reste en bibliothèque, et dans les autres modules |
| `skoole_delete` | supprime la brique de la bibliothèque, à la corbeille | rien n'en réchappe : elle quitte aussi tous les modules |

**Retirer** se fait par l'identifiant du RANGEMENT, pas par celui de la
brique : `skoole_module` le donne (`contents[].id`), et `skoole_attach` le
rend. À défaut, `{ module, brick }` suffit, sauf si la brique est rangée deux
fois dans le module : là, le connecteur refuse de choisir et redemande
l'identifiant du rangement.

```
skoole_module { id: "mod-…" }
  -> contents: [ { id: "itm-…", phase: "evaluer", kind: "quiz", title: "Les bases" } ]
skoole_detach { item: "itm-…" }
  -> { detached: "itm-…", module: "mod-…" }
```

**Supprimer** est un geste lourd, et il ne se déduit jamais d'une consigne
vague. « Enlève ça du module » veut dire `skoole_detach`. `skoole_delete` ne
part que sur une demande explicite de suppression.

```
skoole_delete { brick: "qz-…", kind: "quiz" }
  -> { error: "Des étudiants y ont travaillé : 22 copie(s), tentative(s) ou réponse(s)…",
       studentWork: 22, retryWith: "force: true" }
```

Si des étudiants ont travaillé dessus, le connecteur REFUSE et dit combien
(`studentWork`). Le rapporter au formateur tel quel, avec les deux issues :
archiver depuis Skoole, ou redemander avec `force: true` en sachant que les
copies, les tentatives et les réponses partent en corbeille avec la brique.
**Ne jamais mettre `force` de sa propre initiative.**

## Les refus qu'on peut rencontrer

| Réponse | Ce que ça veut dire |
|---|---|
| « Introuvable, ou hors de ce que ce compte peut lire. » | la chose appartient à quelqu'un d'autre, ou n'existe pas. Le connecteur ne dit jamais laquelle des deux : c'est voulu |
| « Paramètre `kind` manquant ou inconnu. Attendu : presentation, course… » | le `kind` est absent ou mal écrit (souvent `type` au lieu de `kind`) |
| « Temps inconnu. Attendu : comprendre, pratiquer, appliquer, evaluer, elements. » | la `phase` est mal écrite |
| « Zone inconnue. Attendu : a_classer, avant, apres, disposition, formateur. » | la `zone` est mal écrite |
| « La zone `fil` ne se pose pas ici… » | on entre dans le fil par une ancre : `skoole_deroule { anchors }` |
| « Le déroulé écrit n'existe plus dans Skoole… » | `markdown` a été envoyé à `skoole_deroule` : ranger avec `skoole_attach`, ancrer avec `anchors` |
| « Paramètre `position` inconnu… » ou « Paramètre `rank` : un entier à partir de 1… » | la place d'un cran se donne par `rank`, un entier à partir de 1 |
| « Ce jeton ne porte pas la portée « Verser et piloter »… » | le formateur a autorisé « Verser » seulement : il peut lire et déposer, pas ranger ni programmer. Lui dire d'en créer un autre dans Skoole, Mon compte, Connecteur |
| « Authentification requise. » | la connexion n'est pas faite ou a été révoquée : `/mcp` puis Authenticate |
| « Aucun fichier à cet identifiant de dépôt… » | le `PUT` n'a pas été fait, ou pas sur cette adresse : refaire `skoole_upload`, pousser, puis rappeler l'outil avec `upload` |
| « Donne `markdown` OU `upload`, pas les deux. » | un seul des deux par appel |
| `hint` : « Les Pages (le coffre) ne sont pas ouvertes sur ce compte… » | rien ne se publie : le formateur le demande à l'équipe Skoole |
| « Cette brique n'est pas rangée dans ce module. » | le couple `module` + `brick` de `skoole_detach` ne désigne aucun rangement : relire `skoole_module` |
| « Cette brique est rangée N fois dans ce module… » | donner `item` (l'identifiant du rangement), le connecteur ne choisit pas à ta place |
| « Des étudiants y ont travaillé : N copie(s)… » | `skoole_delete` refuse : le rapporter au formateur, ne jamais forcer soi-même |

Un refus se rapporte au formateur, il ne se contourne pas.
