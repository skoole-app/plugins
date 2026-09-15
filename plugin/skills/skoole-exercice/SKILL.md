---
name: skoole-exercice
description: Écrire un EXERCICE au format EXERCICE-MD de Skoole (une situation, un travail à faire, un corrigé, et le document à remplir) et le verser dans la bibliothèque du formateur. Déclencher sur « écris un exercice Skoole », « une mise en situation pour mes NDRC », « un cas pratique avec son corrigé », « un travail à rendre sur ce chapitre », « verse cet exercice dans Skoole ».
---

# L'exercice dans Skoole

## Ce que c'est

Un **exercice** est un travail que l'étudiant rend : une situation, des
questions numérotées, une durée, et le corrigé que le formateur garde. Il se
range dans un module au temps **`pratiquer`** (affiché « S'entraîner ») par
défaut.

L'étudiant voit la consigne et, s'il y en a un, le **document à remplir**,
déjà posé dans sa copie. Il ne voit pas le corrigé. **Un exercice ne se rend
pas en PDF** : Skoole fabrique le document Word que l'étudiant télécharge,
remplit et renvoie.

## Le format EXERCICE-MD

```markdown
# Titre de l'exercice

Identifiant : un-identifiant-en-minuscules
Niveau : 2
Annexe : fichier-de-prospects.xlsx

## Énoncé

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
| `Annexe : nom.ext` | non, répétable | déclare une annexe ATTENDUE (voir plus bas) |
| `## Énoncé` | **oui** | la situation, le travail à faire, la durée, la modalité |
| `## Corrigé` | non | jamais montré à l'étudiant par défaut |
| `## Rendu à remplir` | non | le document VIDE que l'étudiant trouve déjà dans sa copie |

⚠️ **Écrire `## Énoncé`, pas `## Consigne`.** Skoole affiche le mot
« Consigne » à l'écran, et le lecteur d'exercice accepte les deux, mais la
RECONNAISSANCE de la nature, elle, ne connaît aujourd'hui que `## Énoncé` (ou
`## Enonce`, sans accent). Un fichier qui n'a que `## Consigne` est versé
comme un COURS, sans erreur et sans que rien ne le signale.

Le reste : tout ce qui suit `## Énoncé`, `###` compris, reste dans l'énoncé
jusqu'à la partie suivante. L'ordre de `## Corrigé` et `## Rendu à remplir`
est libre. `Niveau :` et `Annexe :` doivent être **avant** l'énoncé.

### Les annexes ne sont pas transportées

`Annexe : fichier-de-prospects.xlsx` déclare un document ATTENDU. Le
connecteur **ne verse aucun fichier** : c'est le formateur qui dépose la pièce
dans Skoole, sur l'exercice. L'import le rappelle dans ses `warnings`. Le dire
au formateur plutôt que d'essayer de contourner.

### Deux règles de fond

- **La consigne ne contient jamais la réponse.**
- **Le corrigé ne dit pas « voir cours »** : il dit ce qu'un bon travail
  contient, et le critère qui sépare une bonne réponse d'une mauvaise.
- Quand le travail consiste à REMPLIR quelque chose (tableau, fiche, grille),
  écrire `## Rendu à remplir` avec le document vide. Sans lui, l'étudiant
  rédige dans une page blanche.

## Exemple canonique

`exemple.md`, à côté de ce fichier : une situation, un travail à faire, un
corrigé, un rendu à remplir, une annexe déclarée.

## Les erreurs fréquentes

| Ce qui arrive | Ce que l'import répond |
|---|---|
| pas de titre `#`, ou pas de `## Énoncé` | « Cet exercice n'a pas pu être lu : il lui faut un titre « # » et une section « ## Consigne ». » (le message dit Consigne, le lecteur veut Énoncé : voir l'avertissement plus haut) |
| énoncé vide sous le titre de partie | même refus |
| `## Consigne` seul, sans `## Énoncé` | pas d'erreur du tout : la brique part en COURS |
| `Niveau : 7` | la ligne est ignorée, le niveau reste vide (1 à 5 seulement) |
| des `Annexe :` déclarées | succès, plus l'avertissement « n annexe(s) attendue(s) : à déposer dans Skoole » |

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
que les étudiants le trouvent.
