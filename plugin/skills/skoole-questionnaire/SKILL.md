---
name: skoole-questionnaire
description: Écrire un QUESTIONNAIRE au format QUESTIONNAIRE-MD de Skoole (un sondage nominatif, sans bonne réponse, ni noté) et le verser dans la bibliothèque du formateur. Déclencher sur « écris un questionnaire Skoole », « un diagnostic de rentrée », « sonde ma classe sur X », « un état des lieux avant le module », « un formulaire d'avis pour mes étudiants ».
---

# Le questionnaire dans Skoole

## Ce que c'est

Un **questionnaire** sonde la classe : diagnostic de rentrée, état des lieux
des pratiques, avis de fin de module. **Aucune option n'est la bonne, rien
n'est noté.** Le formateur lit les réponses, nominatives par défaut.

Il se range dans un module au temps **`evaluer`** par défaut, comme le QCM,
parce qu'il mesure, même sans note.

**La marque reconnue par Skoole** : des questions en `###` avec une ligne
`Type :`. Sans elles, le fichier devient un cours ; avec une case à cocher, il
devient un QCM.

## Le format QUESTIONNAIRE-MD

```markdown
# Titre du questionnaire

Identifiant : un-identifiant-en-minuscules
Usage : diagnostic
Reponses nominatives : oui
Duree : 10 min

Une ou deux phrases de consigne, en texte libre.

## Nom d'une section

### Q1. L'énoncé de la question
Type : choix unique
- une option
- une autre option
```

**L'en-tête**, une ligne par réglage, juste après le titre :

| Ligne | Obligatoire | Valeurs |
|---|---|---|
| `Identifiant :` | fortement conseillé | minuscules et tirets ; clé de ré-import |
| `Usage :` | non | texte libre (« diagnostic », « bilan ») |
| `Reponses nominatives :` | non | `oui` (défaut) ou `non` |
| `Duree :` | non | « 10 min » |
| `Melanger les questions :` | non | `oui` / `non` (défaut : non) |

**La consigne** : tout ce qui suit l'en-tête jusqu'au premier `##` ou `###`.

**Les sections** : `## Nom de la section`. Facultatives, elles regroupent les
questions.

**Les questions** : `### Q1. L'énoncé`, puis une ligne `Type :` **obligatoire**,
puis les options en **tirets nus**, jamais de cases à cocher.

| `Type :` | Options | Ce que l'étudiant voit |
|---|---|---|
| `choix unique` | au moins deux, en tirets | des boutons radio |
| `choix multiple` | au moins deux, en tirets | des cases à cocher |
| `echelle` | aucune | une échelle de 1 à 5 |
| `texte libre` | aucune | un champ de saisie |

Le libellé du type doit être exactement l'un de ces quatre (les accents et la
casse sont libres, « texte » seul passe aussi). Toute précision se met dans
l'énoncé, jamais sur la ligne `Type :`.

Plafonds : 26 options par question, 200 questions par questionnaire.

## Exemple canonique

`exemple.md`, à côté de ce fichier : les quatre types, deux sections.

## Les erreurs fréquentes

Le parseur d'un questionnaire est **strict** : à la première anomalie il
s'arrête, et rien n'est versé.

| Ce qui arrive | Ce que l'import répond |
|---|---|
| ligne `Type :` oubliée | « Question « … » : la ligne « Type : ... » manque. » |
| type mal écrit (« QCM », « liste ») | « type inconnu « … » (attendu : choix unique, choix multiple, echelle, texte libre) » |
| un choix à une seule option | « un choix demande au moins deux options en liste à tirets » |
| aucune question en `###` | « Aucune question trouvée… » |
| une case à cocher dans les options | ce n'est plus un questionnaire : Skoole verse un QCM |
| identifiant déjà utilisé | l'import RÉUSSIT sans rien réécrire, et rend l'avertissement « Ce questionnaire existait déjà sous cet identifiant : rien n'a été réécrit. » Le lire, sinon on croit avoir versé |

⚠️ Un questionnaire mal formé peut aujourd'hui remonter en « Erreur interne. »
plutôt qu'en message clair : relire le format avant de verser, et en cas
d'erreur interne sur un `###` + `Type :`, soupçonner d'abord une ligne `Type :`
manquante ou mal écrite.

## Comment on injecte

```
skoole_import { markdown: "<le questionnaire entier>", name: "diagnostic-rentree.md" }
```

Il rend `{ brick: { type: "questionnaire", id, title, warnings } }`. Garder
l'`id`, et **lire les `warnings`** (le cas « existait déjà »).

```
skoole_attach { module: "<id du module>", brick: "<id>", kind: "questionnaire", phase: "evaluer" }
```

`phase` est facultatif : sans lui, un questionnaire va de lui-même dans
`evaluer`.
