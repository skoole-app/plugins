---
name: skoole-exercice
description: >-
  Écrire un EXERCICE au format EXERCICE-MD de Skoole (une situation, un travail à faire, un corrigé, et le document à remplir), le verser dans la bibliothèque du formateur, lui rattacher ses outils et ses pages, puis proposer la correction des copies. Déclencher sur « écris un exercice Skoole », « une mise en situation pour mes NDRC », « un cas pratique avec son corrigé », « un travail à rendre sur ce chapitre », « verse cet exercice dans Skoole », « mets le site à auditer dans l'exercice », « propose la correction des copies ».
---

# L'exercice dans Skoole

## Ce que c'est

Un **exercice** est un travail que l'étudiant rend : une situation, des
questions numérotées, et le corrigé que le formateur garde. Il se range dans
un module au temps **`pratiquer`** (affiché « S'entraîner ») par défaut.

L'étudiant y entre par **« Faire l'exercice »** (puis **« Continuer
l'exercice »** tant qu'il n'a pas rendu). Il rédige ET dépose ses fichiers
dans le **plein écran de l'exercice**, sous l'éditeur, avec la consigne sous
la main et les onglets de l'exercice : les **« Outils »** rattachés, les pièces
de son entreprise, les annexes, son équipe, ses notes. S'il y en a un, il
trouve le **document à remplir** déjà posé dans sa copie. Il ne voit pas le
corrigé. **Un exercice ne se rend pas en PDF** : Skoole fabrique le document
Word que l'étudiant télécharge, remplit et renvoie.

## Le format EXERCICE-MD

```markdown
# Titre de l'exercice

Identifiant : un-identifiant-en-minuscules
Niveau : 2
Noté : oui
Annexe : fichier-de-prospects.xlsx

## Consigne

La situation : une entreprise, un poste, les documents remis.

### Travail à faire

1. Première question.
2. Deuxième question.

Durée : 45 minutes. Travail individuel, rendu sur Skoole.

## Corrigé

Les réponses attendues, question par question.

## Rendu à remplir

| Colonne | Colonne |
| --- | --- |
|  |  |
```

| Partie | Obligatoire | Ce qu'elle fait |
|---|---|---|
| `# Titre` | **oui** | nomme la brique |
| `Identifiant : …` | fortement conseillé | minuscules et tirets ; la clé de correction : renvoyé sous le même, l'exercice est réécrit en place, ou versionné si des copies existent |
| `Niveau : 1` à `5` | non | de 1, découverte, à 5, examen |
| `Noté : oui` ou `non` | non | dit si l'exercice est noté ; absent, rien n'est décidé à la place du formateur |
| `Travail : en équipe` | non | l'exercice se fait en équipe, et le responsable rend pour tous ; absent, il est individuel. Le nombre par équipe ne s'écrit pas, il s'annonce en séance |
| `Entreprise : donnees/mon-id` | non, répétable | une pièce de l'entreprise fictive dont l'élève a besoin (`documents/`, `donnees/` ou `medias/`, une par ligne, jamais d'étoile) ; chaque classe reçoit la pièce de SON entreprise (voir `skoole_entreprise`) |
| `Annexe : nom.ext` | non, répétable | déclare une annexe ATTENDUE (voir plus bas) |
| `## Consigne` | **oui** | la situation, le travail à faire, la durée, la modalité |
| `## Corrigé` | non | jamais montré à l'étudiant par défaut |
| `## Rendu à remplir` | non | le document VIDE que l'étudiant trouve déjà dans sa copie |

**`## Consigne` ou `## Énoncé`** : Skoole dit « Consigne » partout à l'écran,
et la reconnaissance lit les deux titres (`## Enonce`, sans accent, aussi).
Écrire `## Consigne`.

Le reste : tout ce qui suit `## Consigne`, `###` compris, reste dans la
consigne jusqu'à la partie suivante. L'ordre de `## Corrigé` et
`## Rendu à remplir` est libre. Les lignes d'en-tête (`Identifiant :`,
`Niveau :`, `Noté :`, `Travail :`, `Entreprise :`, `Annexe :`) sont
**avant** la consigne.

### Les annexes ne sont pas transportées

`Annexe : fichier-de-prospects.xlsx` déclare un document ATTENDU. Le
connecteur **ne verse aucun fichier** : c'est le formateur qui dépose la pièce
dans Skoole, sur l'exercice. L'import le rappelle dans ses `warnings`. Le dire
au formateur plutôt que d'essayer de contourner.

### Ce qu'il faut pour le faire : outils, calculs, pages

Une fois l'exercice versé, lui rattacher ce dont l'élève aura besoin :
`skoole_outils { brick: "<id de l'exercice>" }` rend ce qu'on peut rattacher
(les outils du formateur, ses pages, les calculs du catalogue de Skoole), puis
`skoole_outils { brick, add: ["<ref>"] }`. L'élève les trouve dans l'onglet
**« Outils »** de l'exercice. Ne rattacher que ce qui sert : c'est DONNÉ à
l'élève avec l'exercice.

Un **site à auditer** (un faux site d'entreprise, avec ses scripts) ne s'écrit
jamais dans la consigne : il se publie dans les **Pages** du formateur
(`skoole_coffre`, voir la compétence `skoole`), puis son outil se rattache à
l'exercice. L'élève le voit affiché **« Page »** dans l'onglet « Outils », et
l'ouvre dans un nouvel onglet. Au formateur, dire « page ».

### Les mots de la consigne

La consigne parle de l'écran que l'élève a sous les yeux : on rédige et on
dépose ses fichiers dans le plein écran de l'exercice ; ce qu'il faut est dans
l'onglet « Outils ». **Jamais « en bas de la page », « Ce qu'il te faut » ni
« Reprendre »** : ces mots ne sont plus à l'écran.

### Trois règles de fond

- **La consigne ne contient jamais la réponse.**
- **Le corrigé ne dit pas « voir cours »** : il dit ce qu'un bon travail
  contient, et le critère qui sépare une bonne réponse d'une mauvaise.
- Quand le travail consiste à REMPLIR quelque chose (tableau, fiche, grille),
  écrire `## Rendu à remplir` avec le document vide. Sans lui, l'étudiant
  rédige dans une page blanche.

## Exemple canonique

`exemple.md`, à côté de ce fichier : un identifiant, une situation, un travail
à faire, un corrigé, un rendu à remplir, une annexe déclarée.

## Les erreurs fréquentes

| Ce qui arrive | Ce que l'import répond |
|---|---|
| pas de titre `#` | « Cet exercice n'a pas pu être lu : il lui faut un titre « # » et une section « ## Énoncé » (ou « ## Consigne »). » |
| consigne vide sous son titre | même refus |
| ni `## Consigne` ni `## Énoncé` | pas d'erreur du tout : la brique part en COURS |
| `Niveau : 7` | la ligne est ignorée, le niveau reste vide (1 à 5 seulement) |
| `Entreprise : donnees/*`, ou une famille inconnue | la ligne est ignorée ; l'import dit dans ses `warnings` les pièces qu'il a lues |
| pas de `Identifiant :` | succès, avec l'avertissement qu'un prochain envoi créera un second exercice |
| des `Annexe :` déclarées | succès, plus l'avertissement « n annexe(s) attendue(s) : à déposer dans Skoole, le connecteur ne verse pas de fichiers. » |

Les `warnings` disent aussi ce qui a été compris (`Noté :`, `Travail :`, les
pièces de l'entreprise) : les relire.

## Comment on injecte

```
skoole_import { markdown: "<l'exercice entier>", name: "qualifier-un-fichier.md" }
```

Il rend `{ brick: { type: "exercise", id, title, warnings } }`. Garder l'`id`.

```
skoole_attach { module: "<id du module>", brick: "<id de l'exercice>", kind: "exercise", phase: "pratiquer" }
```

`phase` est facultatif : sans lui, un exercice va de lui-même dans
`pratiquer`. Un exercice ne vit vraiment que rangé dans un module : c'est là
que les étudiants le trouvent. Sans `zone`, il arrive « à classer » ; pour le
mettre dans le fil, l'ancrer à sa slide (voir `skoole-composer`).

## Après le rendu : proposer la correction

1. `skoole_results { kind: "exercise", id, class }` : l'état des copies,
   élève par élève, et leurs identifiants.
2. `skoole_submission { exercise, student }` : le texte de la copie, et ses
   fichiers par adresse signée. Le corrigé de référence se relit par
   `skoole_brick` (`content.solution`).
3. `skoole_correction { exercise, corrections: [{ student, markdown, note }] }` :
   ce qui tient, ce qui est à reprendre, une piste ; `note` facultative, sur
   20, jamais pour un exercice `Noté : non`.

**L'élève ne voit rien de ce qui est proposé.** Le formateur lit la
proposition sous la copie, dans la vue de travail de l'exercice, et la rend
telle quelle ou retouchée. Rendue, elle arrive chez l'élève, dont la copie
corrigée s'ouvre sur l'onglet **« Tout »** : l'énoncé, sa copie et la
correction à la suite.
