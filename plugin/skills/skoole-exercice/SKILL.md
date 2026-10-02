---
name: skoole-exercice
description: >-
  Écrire un EXERCICE au format EXERCICE-MD de Skoole (une situation, un travail à faire, un exemple de rendu, un corrigé, et le document à remplir), le verser dans la bibliothèque du formateur, lui rattacher ses outils et ses pages, puis proposer la correction des copies. Déclencher sur « écris un exercice Skoole », « une mise en situation pour mes NDRC », « un cas pratique avec son corrigé », « un travail à rendre sur ce chapitre », « verse cet exercice dans Skoole », « mets le site à auditer dans l'exercice », « propose la correction des copies ».
---

# L'exercice dans Skoole

## Ce que c'est

Un **exercice** est un travail que l'étudiant rend : une situation, des
questions numérotées, et le corrigé que le formateur garde. Il se range dans
un module au temps **`pratiquer`** (affiché « S'entraîner ») par défaut.

L'étudiant y entre par **« Faire l'exercice »** (puis **« Continuer
l'exercice »** tant qu'il n'a pas rendu). Il rédige ET dépose ses fichiers
dans le **plein écran de l'exercice**, sous l'éditeur, avec la consigne sous
la main et les onglets de l'exercice : les **« Ressources »** rattachées, les pièces
de son entreprise, les annexes, son équipe, ses notes. S'il y en a un, il
trouve le **document à remplir** déjà posé dans sa copie. Si le formateur
l'a ouvert, un onglet **« Exemple »**, juste après la consigne, lui montre la
forme attendue sur une entreprise fictive. Il ne voit pas le corrigé. **Un exercice ne se rend pas en PDF** : Skoole fabrique le document
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

## Exemple de rendu

Une partie traitée comme on l'attend, sur une entreprise FICTIVE, le reste
laissé à l'étudiant.

## Corrigé

Les réponses attendues, question par question.

## Barème

| Critère | Points |
| --- | --- |
| Question 1 : le choix (4) et sa justification (4) | 8 |
| Question 2 | 12 |
| **Total** | **20** |

Seuils : acquis à partir de 14, en cours de 8 à 13,5, non acquis en dessous de 8

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
| `## Exemple de rendu` | non | la FORME attendue, sur une entreprise fictive, incomplète ; fermée à l'étudiant tant que le formateur ne l'ouvre pas |
| `## Corrigé` | non | jamais montré à l'étudiant par défaut |
| `## Barème` | non | les critères et leurs points, APRÈS `## Corrigé` ; RÉSERVÉ au formateur, l'étudiant ne le voit pas ; peut porter une ligne `Seuils :` (voir plus bas) |
| `## Rendu à remplir` | non | le document VIDE que l'étudiant trouve déjà dans sa copie |

**`## Consigne` ou `## Énoncé`** : Skoole dit « Consigne » partout à l'écran,
et la reconnaissance lit les deux titres (`## Enonce`, sans accent, aussi).
Écrire `## Consigne`.

Le reste : tout ce qui suit `## Consigne`, `###` compris, reste dans la
consigne jusqu'à la partie suivante. L'ordre de `## Exemple de rendu`,
`## Corrigé` et `## Rendu à remplir` est libre ; écrire l'exemple juste après
la consigne. `## Barème`, lui, vient TOUJOURS après `## Corrigé`. Le titre est EXACT : `## Exemple de rendu` (ou `## Exemple`),
rien d'autre sur la ligne. Un sous-titre de consigne s'écrit en `###`
(`### Exemple de réponse` reste dans la consigne). Les lignes d'en-tête (`Identifiant :`,
`Niveau :`, `Noté :`, `Travail :`, `Entreprise :`, `Annexe :`) sont
**avant** la consigne.

### Le barème : en face du corrigé

Facultatif, il s'écrit avec l'exercice, critère par critère, avec ses points
(« ils vont par paire », dit Cyril). Il n'est JAMAIS montré à l'étudiant pour
l'instant. Titre EXACT : `## Barème` (ou `## Bareme`), rien d'autre sur la
ligne ; un `### Barème` reste dans la partie où il est. Il se relit par
`skoole_brick` (`content.scale`), avec `content.graded` qui dit si
l'exercice est noté.

⚠️ **Il se place APRÈS `## Corrigé`.** Sans corrigé, pas de barème : écrit
avant le corrigé (ou sans corrigé), le `## Barème` reste dans la partie qui
le précède, donc sous les yeux des élèves, et l'import le signale. Écrire un
total (`| **Total** | **20** |`) : c'est sur lui que se lisent les seuils.

### Les seuils : une ligne facultative dans le barème

Sur un exercice NOTÉ, le barème peut porter UNE ligne qui fixe les seuils du
niveau d'acquisition :

```
Seuils : acquis à partir de 14, en cours de 8 à 13,5, non acquis en dessous de 8
```

- **Sur une seule ligne**, qui commence par « Seuils » (une puce, du gras ou
  un `###` devant sont tolérés), puis deux points, puis les tranches.
  « acquis » et « en cours » au moins ; « non acquis en dessous de 8 » peut
  tenir lieu du début d'« en cours ». Les tranches montent et se touchent.
  Décimales à la française (13,5).
- **Sur le total du barème** : celui de sa ligne `| **Total** | **20** |`
  (dans un tableau, la colonne « Points »), ou « Total : 40 », ou « Noté sur
  40 ». Pour un barème sur 40, écrire les seuils sur 40, ou le dire dans la
  ligne, qui l'emporte :
  `Seuils (sur 40) : acquis à partir de 28, en cours de 16 à 27,5`.
  Sans total nulle part, c'est 20. Deux totaux qu'on ne sait pas
  départager : la ligne est refusée, écrire `(sur N)`.
- **L'import dit ce qu'il a lu** dans ses `warnings` (« Seuils lus : acquis à
  partir de 14, … (sur 20, le total du barème) »), ou pourquoi la ligne ne
  se lit pas : une ligne qui commence par « Seuils » sans se lire n'est
  jamais tue. La corriger, et renvoyer l'exercice ENTIER sous le même
  `Identifiant :`.
- **Aucun seuil par défaut** : sans ligne, le niveau reste un jugement
  d'ensemble. Sur un exercice `Noté : non`, sans note proposée, les seuils
  ne donnent aucun niveau.
- Ce que les seuils changent à la correction : plus bas, « Après le
  rendu ».

### L'exemple de rendu : la forme, jamais la réponse

Il montre aux étudiants à quoi doit RESSEMBLER leur rendu : la longueur, le
ton, la présentation, le niveau de détail. Trois règles :

- **Une entreprise FICTIVE**, nommée comme telle, jamais celle de l'étudiant
  ni celle du sujet : l'exemple ne doit pas pouvoir se recopier.
- **Incomplet, volontairement** : une partie traitée comme on l'attend (un
  axe, une ligne du tableau, un paragraphe), le reste marqué « à toi de
  jouer ».
- **Pas le corrigé** : ni la réponse du sujet réel, ni ses chiffres.

Il arrive **fermé** : le formateur l'ouvre dans la vue de travail (volet
« Exemple »), et Skoole ajoute en tête, chez l'étudiant, une mention fixe
(« exemple sur une entreprise fictive, incomplet »). Renvoyé sous le même
`Identifiant :` avec un exemple CHANGÉ alors qu'il était ouvert, il est
refermé : l'import le dit dans ses `warnings`, et c'est au formateur de le
rouvrir.

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
**« Ressources »** de l'exercice. Ne rattacher que ce qui sert : c'est DONNÉ à
l'élève avec l'exercice.

Un **site à auditer** (un faux site d'entreprise, avec ses scripts) ne s'écrit
jamais dans la consigne : il se publie dans les **Pages** du formateur
(`skoole_coffre`, voir la compétence `skoole`), puis son outil se rattache à
l'exercice. L'élève le voit affiché **« Page »** dans l'onglet « Ressources », et
l'ouvre dans un nouvel onglet. Au formateur, dire « page ».

### Les mots de la consigne

La consigne parle de l'écran que l'élève a sous les yeux : on rédige et on
dépose ses fichiers dans le plein écran de l'exercice ; ce qu'il faut est dans
l'onglet « Ressources ». **Jamais « en bas de la page », « Ce qu'il te faut »,
« Outils » ni « Reprendre »** : ces mots ne sont plus à l'écran.

### Trois règles de fond

- **La consigne ne contient jamais la réponse.**
- **Le corrigé ne dit pas « voir cours »** : il dit ce qu'un bon travail
  contient, et le critère qui sépare une bonne réponse d'une mauvaise.
- Quand le travail consiste à REMPLIR quelque chose (tableau, fiche, grille),
  écrire `## Rendu à remplir` avec le document vide. Sans lui, l'étudiant
  rédige dans une page blanche.

## Exemple canonique

`exemple.md`, à côté de ce fichier : un identifiant, une situation, un travail
à faire, un exemple de rendu, un corrigé, un barème avec son total et sa
ligne de seuils, un rendu à remplir, une annexe déclarée.

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
| `## Barème` avant `## Corrigé` | succès, avec l'avertissement « « ## Barème » lu AVANT le corrigé : il est resté dans la partie qui le précède, donc montré aux étudiants… » |
| une ligne `Seuils` qui ne se lit pas | succès, avec « Ligne « Seuils » du barème illisible : » et la raison ; aucun niveau ne sera calculé tant qu'elle n'est pas corrigée |

Les `warnings` disent aussi ce qui a été compris (`Noté :`, `Travail :`, les
pièces de l'entreprise, l'exemple de rendu, le barème, les seuils et le
total sur lequel ils se lisent) : les relire.

### Corriger un exercice qui existe

Lire d'abord `skoole_brick` : `content.text` (la consigne), `content.example`
et `content.exampleOpen` (l'exemple, et s'il est ouvert), `content.solution`
(le corrigé), `content.scale` (le barème), `content.template` (le rendu à
remplir). Puis renvoyer
l'exercice ENTIER sous le même `Identifiant :`. **Une partie absente du
renvoi est effacée** : un exemple ou un rendu que l'on n'a pas relu disparaît.

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
   `skoole_brick` (`content.solution`), et l'exemple de rendu aussi
   (`content.example`) : une copie qui REPREND l'exemple (l'entreprise
   fictive, ses chiffres, ses phrases) se signale dans la correction, elle
   n'est pas un bon travail.
3. `skoole_correction { exercise, corrections: [{ student, markdown, note, level }] }` :
   ce qui tient, ce qui est à reprendre, une piste ; `note` facultative, sur
   20, jamais pour un exercice `Noté : non` ; `level` facultatif, le NIVEAU
   D'ACQUISITION (`acquis`, `en_cours`, `non_acquis`), une autre façon
   d'évaluer que la note, ou en plus d'elle.
4. Dans le même appel (ou seul, après une nouvelle passe), `report` et
   `class` : le RAPPORT D'ENSEMBLE de la classe, à lire en premier par le
   formateur (niveau général, élèves en difficulté nommés, erreurs qui
   reviennent, à reprendre en classe). Le dernier remplace le précédent :
   renvoie-le entier et à jour. Détail dans la compétence `skoole`.

**Quand un barème existe** (`content.scale`), la correction dit les points
critère par critère (ce qui a été gagné, ce qui a été perdu, pourquoi), et
elle est plus fournie quand l'exercice est noté (`content.graded`).

**Quand le barème a une ligne `Seuils`**, la réponse de `skoole_correction`
rend en tête `thresholds` (les seuils compris, ou `error` si la ligne ne se
lit pas), et pour chaque copie de `written` `levelFromScale`, le niveau que
donnent ta note et les seuils (`null` sans note). Si ton `level` s'en écarte,
`levelGap` le signale. **Skoole ne l'impose jamais** : ton niveau est posé
tel quel, et un écart se justifie dans la correction (un critère
éliminatoire manqué, une copie juste sur le fond et mal rendue). La note
reste sur 20, ramenée au total des seuils (12/20 sur un barème de 10,
c'est 6).

**L'élève ne voit rien de ce qui est proposé.** Le formateur lit la
proposition sous la copie, dans la vue de travail de l'exercice, et la rend
telle quelle ou retouchée. Rendue, elle arrive chez l'élève, dont la copie
corrigée s'ouvre sur l'onglet **« Tout »** : l'énoncé, sa copie et la
correction à la suite.
