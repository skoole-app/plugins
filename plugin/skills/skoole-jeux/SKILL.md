---
name: skoole-jeux
description: >-
  Écrire un LOT DE JEUX au format JEUX-MD de Skoole (une suite de jeux, chacun avec sa matière : tri, intrus, vrai ou faux, relier, memory, cartes, ordre, texte à trous, attrapeur) et le verser dans la bibliothèque du formateur. Déclencher sur « écris des jeux Skoole », « un jeu de tri sur ce vocabulaire », « un vrai ou faux pour réviser », « un texte à trous », « des cartes de révision », « un lot de jeux pour la fin du module ».
---

# Les jeux dans Skoole

## Ce que c'est

Un **lot de jeux** est une brique unique qui porte une **suite de jeux**, joués
les uns après les autres. Il se range dans un module au temps **`pratiquer`**
(affiché « S'entraîner ») par défaut : on s'y entraîne, rien n'y est noté.

**L'ordre du texte est l'ordre de la séance.** Un lot peut porter deux fois le
même type (deux tris sur deux notions). Chaque jeu a **sa propre matière** :
on n'écrit plus une matière dont Skoole déduirait des jeux.

## Le format : une section, un jeu

```markdown
# Titre du lot

Identifiant : un-identifiant-en-minuscules
Consigne : Une phrase pour l'ensemble du lot.
Mot de la fin : Ce qui reste quand tout est joué.

## tri · Le titre de ce jeu
Catégories : Première (aide) | Deuxième (aide)
- Un item | Première | pourquoi il est là
```

**L'en-tête** : `Identifiant :` est **obligatoire** (minuscules et tirets,
c'est la clé de mise à jour). `Consigne :`, `Mot de la fin :` et `Source :`
sont facultatifs. Toute autre clé est ignorée avec une remarque.

**Chaque jeu est une section `## <clé> · Titre`.** La clé est l'un de ces
neuf mots, **écrits exactement comme ici**, en minuscules, souligné compris :

`tri` · `intrus` · `vrai_faux` · `attrapeur` · `relier` · `memory` · `cartes`
· `ordre` · `trous`

Le titre après le point médian est libre, et facultatif. Les noms français
(« Tri en colonnes », « Vrai ou faux ») restent lus, mais ne s'écrivent plus.

## La matière, par type

| Clés | Ce qu'on écrit | Le minimum |
|---|---|---|
| `tri`, `intrus`, `attrapeur` | une ligne `Catégories : A (aide) \| B (aide)`, puis des items `- texte \| Catégorie \| explication` | 2 à 4 catégories, chacune avec au moins un item |
| `vrai_faux` | des affirmations `- texte \| vrai \| explication` (ou `faux`) | 2 affirmations |
| `relier`, `memory`, `cartes` | des paires `- face A \| face B \| explication` | 2 paires |
| `ordre` | une liste numérotée `1. étape` | 3 étapes |
| `trous` | un court texte, chaque réponse entre doubles crochets `[[comme ceci]]` | 1 trou |

L'explication en troisième champ est toujours facultative. La barre verticale
sépare les champs : elle ne peut pas apparaître dans un texte.

⚠️ **L'aide entre parenthèses ne fait pas partie du nom de la catégorie.**
`Catégories : Le navigateur (sur votre machine) | Le serveur (chez l'hébergeur)`
déclare deux catégories, `Le navigateur` et `Le serveur` ; un item écrit
`| Le navigateur |`, jamais `| Le navigateur (sur votre machine) |`, sinon le
lot entier est refusé pour « catégorie non déclarée » (leçon du 15 septembre 2026).

### Deux règles sans exception

1. **Aucun texte ne désigne une catégorie par son rang** (« la première
   colonne », « celle de gauche ») : l'ordre est mélangé pour chaque étudiant.
   On nomme les catégories par leur titre.
2. **Le vrai ou faux a sa propre matière** : des affirmations écrites pour
   lui, pas des étiquettes recyclées d'un tri.

### Le premier format

Un lot écrit à l'ancienne (en-tête `Jeux : tri, relier` et sections
`## Items étiquetés`, `## Paires`, `## Séquence · titre`, `## Texte à trous`)
**reste accepté en lecture** : trois lots de production sont dans ce format.
Il ne s'écrit plus. Écrire une section par jeu, comme ci-dessus.

## Exemple canonique

`exemple.md`, à côté de ce fichier : cinq jeux, cinq contenus, dont un
`vrai_faux` et un `trous`.

## Les erreurs fréquentes

Le lecteur de jeux refuse le lot **entier** si une seule section est mal
écrite : les erreurs sont rendues ensemble.

| Ce qui arrive | Ce que l'import répond |
|---|---|
| pas de `Identifiant :` | « L'en-tête doit porter « Identifiant : » (la clé du ré-import). » |
| `## Tri en colonnes` au lieu de `## tri` | passe encore par les alias, mais un nom hors catalogue donne « … n'est pas un jeu connu. Attendu une clé du catalogue : … » |
| une clé pas encore jouable (`mot_cache`, `mots_croises`, `mots_meles`, `frise`, `dictee`) | « … n'est pas encore jouable. Un jeu qu'on ne peut pas terminer bloquerait la suite. » |
| un item rangé dans une catégorie non déclarée | « la catégorie « … » n'est pas déclarée » |
| une catégorie déclarée sans aucun item | « la catégorie « … » n'a aucune étiquette » |
| 5 catégories | « quatre catégories au maximum, sinon l'écran ne tient plus » |
| un verdict autre que `vrai` ou `faux` dans un `vrai_faux` | « une affirmation s'écrit « - texte \| vrai \| explication » » |
| un `trous` sans `[[ ]]` | « le texte n'a aucun trou » |
| aucune section de jeu | « Le lot ne porte aucun jeu » |
| identifiant déjà utilisé | le lot est **mis à jour**, avec l'avertissement « Un lot de même identifiant existait : il a été mis à jour. » C'est la seule nature qui se remplace |

## Comment on injecte

```
skoole_import { markdown: "<le lot entier>", name: "revision-qualification.md" }
```

Il rend `{ brick: { type: "game", id, title, warnings } }`. Garder l'`id`, et
lire les `warnings` (mise à jour, lignes ignorées).

```
skoole_attach { module: "<id du module>", brick: "<id du lot>", kind: "game", phase: "pratiquer" }
```

`phase` est facultatif : sans lui, un jeu va de lui-même dans `pratiquer`.
