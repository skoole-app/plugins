---
name: skoole-cours
description: Écrire un COURS pour Skoole (la matière rédigée, en markdown) et le verser dans la bibliothèque du formateur. Déclencher sur « écris un cours Skoole », « rédige la partie théorique », « fais-moi le cours sur X pour mes NDRC », « verse ce cours dans ma bibliothèque », ou quand un texte rédigé doit entrer dans Skoole.
---

# Le cours dans Skoole

## Ce que c'est

Le **cours** est la matière RÉDIGÉE : du texte, des listes, des tableaux. Ce
n'est pas la présentation (les slides, un zip du Studio, que le connecteur ne
verse pas). Un cours entre dans la bibliothèque, se range dans un module au
temps **`comprendre`** par défaut, et l'étudiant le lit dans le module, une
fois le cran ouvert.

C'est aussi la nature de REPLI : tout markdown que Skoole ne reconnaît pas
comme QCM, questionnaire, exercice ou jeu devient un cours. Un QCM mal formé
ne produit donc pas une erreur, il produit un cours, ce qui est rarement ce
qu'on voulait. Relire le format avant de verser.

## Le format

Rien d'obligatoire au-delà du titre, et c'est voulu : un cours est du
markdown ordinaire.

- **Première ligne : `# Titre du cours`.** C'est lui qui nomme la brique. Sans
  titre `#`, Skoole prend le nom de fichier passé en `name`.
- Des parties en `##`, des sous-parties en `###`.
- Paragraphes courts, listes à tirets, tableaux markdown pour les
  comparaisons, un exemple concret par notion.
- Une partie finale `## À retenir`, en quelques points, est l'usage de Skoole.
- Français, **jamais de tiret cadratin ni quadratin**.

### Les pièges qui changent la nature de la brique

La nature n'est pas déclarée, elle est RECONNUE au contenu. Un cours doit donc
éviter, sous peine de partir ailleurs :

| Dans le texte | Ce que Skoole en fait |
|---|---|
| une case à cocher `- [ ]` ou `- [x]` | un QCM |
| une ligne `Réponses acceptées :` | un QCM |
| une ligne `Format : quiz` | un QCM |
| un `###` plus une ligne `Type :` | un questionnaire |
| une section `## Énoncé` | un exercice |
| une ligne `Jeux :` en en-tête | un jeu |
| une section dont le titre EST une clé de jeu (`## Tri`, `## Les cartes`, `## Ordre`) | un jeu |

Le dernier piège est le plus sournois : l'article est ignoré à la
reconnaissance, donc `## Les cartes` vaut `cartes`. Nommer la section
autrement (`## Les cartes de visite`) et le problème disparaît.

### Autres limites

- **Pas d'image en chemin relatif** : elle ne serait pas servie. Une image se
  dépose dans Skoole comme élément.
- **Un fichier, une brique** : jamais un markdown qui contient un cours ET son
  QCM. Deux briques, deux `skoole_import`.

## Exemple canonique

`exemple.md`, à côté de ce fichier : un cours court, complet, qui passe la
reconnaissance de Skoole.

## Les erreurs fréquentes

| Ce qui arrive | Ce que l'import répond |
|---|---|
| markdown vide | « Rien à verser : le markdown est vide. » |
| pas de titre `#` | rien ne casse : la brique prend le nom de fichier passé en `name`, ou « brique.md » |
| un cours qui contenait une case à cocher | l'import rend `type: "quiz"` : c'est le signe qu'un piège du tableau ci-dessus a parlé |

## Comment on injecte

```
skoole_import { markdown: "<le cours entier>", name: "prospection-telephonique.md" }
```

Il rend `{ brick: { type: "course", id, title, warnings: [] } }`. Garder l'`id`.

Puis, si un module l'attend :

```
skoole_attach { module: "<id du module>", brick: "<id du cours>", kind: "course", phase: "comprendre" }
```

`phase` est facultatif : sans lui, un cours va de lui-même dans `comprendre`.
L'enchaînement complet (module, programme, ouverture) est dans la compétence
`skoole-composer`.
