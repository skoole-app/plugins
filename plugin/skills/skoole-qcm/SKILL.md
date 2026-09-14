---
name: skoole-qcm
description: Écrire un QCM au format QCM-MD de Skoole (questions à cases à cocher, corrigées automatiquement) et le verser dans la bibliothèque du formateur. Déclencher sur « écris un QCM Skoole », « fais un quiz sur ce cours », « un test de positionnement pour ma classe », « dix questions notées sur le chapitre », « verse ce QCM dans Skoole ».
---

# Le QCM dans Skoole

## Ce que c'est

Un **QCM** est une brique corrigée automatiquement : l'étudiant répond, Skoole
note. Il se range dans un module au temps **`evaluer`** par défaut. C'est la
seule nature dont l'étudiant voit un score.

Un QCM n'est pas un questionnaire : ici il y a des bonnes réponses. Un sondage
sans bonne réponse relève de la compétence `skoole-questionnaire`.

**La marque reconnue par Skoole, ce sont les cases à cocher** (`- [ ]`,
`- [x]`) ou une ligne `Réponses acceptées :`. Sans elles, le fichier devient
un cours.

## Le format QCM-MD

```markdown
# Titre du QCM

Format : quiz Skoole v1
Identifiant : un-identifiant-en-minuscules
Usage : formatif
Duree : 10 min
Melanger les questions : non
Melanger les options : oui

## Q1. L'énoncé de la question
- [ ] une option fausse
- [x] la bonne réponse
- [ ] une autre option fausse
> Pourquoi c'est la bonne réponse.
```

**L'en-tête**, une ligne par réglage, entre le titre et la première question :

| Ligne | Obligatoire | Valeurs |
|---|---|---|
| `Format : quiz Skoole v1` | non, mais c'est l'usage | |
| `Identifiant :` | fortement conseillé | minuscules et tirets ; c'est la clé anti-doublon |
| `Usage :` | non | `formatif` (défaut) ou `positionnement` |
| `Duree :` | non | « 10 min » |
| `Melanger les questions :` | non | `oui` / `non` (défaut : non) |
| `Melanger les options :` | non | `oui` / `non` (défaut : non) |

**Les questions** : un titre de niveau 2, `## Q1. L'énoncé`. Quatre formes :

- **Choix unique** : des options, une seule cochée. Une question Vrai / Faux
  est un choix unique à deux options (`- [ ] Vrai` / `- [x] Faux`) : il n'y a
  pas de type `vrai_faux` dans un QCM.
- **Choix multiple** : plusieurs cochées, plus une ligne `Points : 2` sous le
  titre. **Au moins trois options**, et **au moins autant de fausses que de
  justes**, sinon la question est écartée.
- **Réponse courte** : pas de cases. Une ligne `Reponses acceptees :` suivie
  des réponses admises en tirets, puis `Tolerance : exacte | normale | souple`.
- **Explication** : une ligne de citation `> ...` après les options.
  Facultative, mais c'est elle que l'étudiant lit après coup.

Deux lignes facultatives de plus : `Points : n` (barème) et
`Note formateur : ...`, qui ne sort **jamais** vers un étudiant.

**Les paliers de fin**, en fin de fichier :

```markdown
## Messages de fin
- 0 % : message
- 50 % : message
- 80 % : message
```

### Trois règles de qualité, sans exception

1. **Une explication ne nomme jamais une lettre d'option** (« la réponse B ») :
   l'ordre affiché est tiré pour chaque étudiant.
2. **Les options d'une question font à peu près la même longueur**, sinon la
   bonne réponse se devine sans connaître le cours.
3. **Un choix multiple compte au moins autant de distracteurs que de bonnes
   réponses**, sinon le barème pénalise un étudiant qui a appris.

Le parseur est tolérant en lecture : gras autour d'un mot-clé, bloc de code
autour du fichier, frontmatter YAML, accents manquants, tout passe. Écrire
quand même la forme canonique ci-dessus.

## Exemple canonique

`exemple.md`, à côté de ce fichier : quatre questions, les quatre formes, les
paliers de fin.

## Les erreurs fréquentes

| Ce qui arrive | Ce que l'import répond |
|---|---|
| aucune case à cocher | ce n'est pas un QCM : la brique part en cours, sans erreur |
| zéro question reconnue | le seul échec de niveau fichier : l'import refuse et dit ce qu'il cherchait |
| choix multiple à moins de trois options, ou dont tout est coché | la question est ÉCARTÉE, le reste passe, l'import rend « n question(s) écartée(s) » |
| choix multiple à 3 bonnes réponses pour 1 distracteur | question écartée, avec le motif |
| réponse courte sans `Reponses acceptees :` | question écartée : rien ne permettrait de la corriger |
| identifiant déjà utilisé | REFUS net : « Tu as déjà un QCM importé sous l'identifiant … Choisis d'en créer un nouveau, ou modifie l'identifiant. » Rien n'est écrasé, jamais |

Une question écartée n'arrête pas l'import : lire les `warnings` de la réponse
et les rapporter au formateur.

## Comment on injecte

```
skoole_import { markdown: "<le QCM entier>", name: "crc-positionnement.qcm.md" }
```

Il rend `{ brick: { type: "quiz", id, title, warnings } }`. Garder l'`id`.

```
skoole_attach { module: "<id du module>", brick: "<id du QCM>", kind: "quiz", phase: "evaluer" }
```

`phase` est facultatif : sans lui, un QCM va de lui-même dans `evaluer`.
