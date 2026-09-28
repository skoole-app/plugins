---
name: skoole-cours
description: >-
  Écrire un COURS pour Skoole (la matière rédigée, en markdown) et le verser dans la bibliothèque du formateur ; et animer les slides d'une présentation sans script (la marque skoole-active). Déclencher sur « écris un cours Skoole », « rédige la partie théorique », « fais-moi le cours sur X pour mes NDRC », « verse ce cours dans ma bibliothèque », « anime cette slide », « un schéma qui se dessine quand j'arrive sur la slide », ou quand un texte rédigé doit entrer dans Skoole.
---

# Le cours dans Skoole

## Ce que c'est

Le **cours** est la matière RÉDIGÉE : du texte, des listes, des tableaux. Ce
n'est pas la présentation (les slides, un zip du Studio, qui se verse par
`skoole_upload` puis `skoole_import { upload }`, voir `skoole-composer` ; son
mouvement est plus bas). Ce n'est pas non plus un site web complet, qui va
dans les **Pages** du formateur (`skoole_coffre`, voir la compétence
`skoole`). Un cours entre dans la bibliothèque, se range dans un module au
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
- **Puis une ligne `Identifiant : un-identifiant-en-minuscules`**, avant la
  première partie `##`. C'est la clé de correction : renvoyé sous le même
  identifiant, le cours est réécrit en place (elle sort du texte affiché).
  Sans elle, chaque envoi crée un cours de plus.
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
| une ligne `Réponses nominatives :` | un questionnaire |
| une section `## Consigne` ou `## Énoncé` | un exercice |
| une ligne `Jeux :` en en-tête | un jeu |
| une section `## Paires`, `## Séquence`, `## Texte à trous` ou `## Étiquettes` (l'ancien format des jeux) | un jeu |
| une section dont le titre EST une clé de jeu (`## Tri`, `## Les cartes`, `## Ordre`) | un jeu |

Le dernier piège est le plus sournois : l'article est ignoré à la
reconnaissance, donc `## Les cartes` vaut `cartes`. Nommer la section
autrement (`## Les cartes de visite`) et le problème disparaît. Même prudence
avec `## Consigne` : une partie de cours qui porterait ce titre ferait de
tout le fichier un exercice.

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

## Le mouvement dans les slides d'une présentation

Une présentation (le zip du Studio) peut s'animer : une boucle qui montre un
flux, un schéma qui se dessine quand on arrive sur la slide, un chiffre qui
défile. **Sans aucun script** : l'import retire tout `<script>` d'une slide,
sauf `fit()`, la mise à l'échelle. Le mouvement passe par le CSS (animations
et transitions), un SVG animé, un GIF ou un WebP animé. Le formateur a
souvent son propre catalogue d'animations : partir du sien.

**La marque `skoole-active`.** Skoole la pose sur la balise `<html>` de la
slide qu'on regarde, dans le lecteur, la projection, la vue présentateur et la
diffusion en classe. Il la retire quand on quitte la slide et la repose quand
on y revient : une entrée se rejoue à chaque passage. Les slides préchargées,
les aperçus, le PDF et les captures ne la portent pas. On écrit donc les
entrées sous elle :

```css
/* Le repos : la slide finie, tout est visible. */
.bloc { opacity: 1; }

/* L'entrée, seulement quand la slide est regardée. */
.skoole-active .bloc { animation: monter .6s ease-out both; }
@keyframes monter { from { opacity: 0; transform: translateY(16px); } }

/* La garde, à écrire soi-même. */
@media (prefers-reduced-motion: reduce) {
  .skoole-active .bloc { animation: none; }
}
```

Les règles, sans exception :

- **Sans la marque, la slide est COMPLÈTE.** L'état de repos est la slide
  finie ; l'animation part d'un état masqué seulement quand la slide est
  active. Un aperçu, le PDF, une capture, l'impression voient tout.
- **La marque est sur `<html>`**, jamais sur `<body>` : écrire
  `.skoole-active .bloc{…}`. Ne jamais l'écrire en dur dans la slide : Skoole
  la retire là où elle ne doit pas être.
- **Une boucle est photographiée dans son style de repos**, au PDF comme dans
  la capture du carnet de l'élève : le style de l'élément SANS animation doit
  tout montrer.
- **Seul l'ordre d'apparition de Skoole cache vraiment une réponse.** Une
  réponse retenue par un délai CSS sort visible au PDF et dans la capture de
  l'élève, qui figent l'état final.
- **Pas d'entrée sur un élément de l'ordre d'apparition** : il est caché
  quand elle se joue, et se montre ensuite par un simple fondu.
- **La garde `prefers-reduced-motion` s'écrit à la main**, dans chaque slide
  animée : aujourd'hui, Skoole ne coupe pas le mouvement à la place de
  l'auteur.
- **Aucun script**, jamais : l'import le retirerait, et la slide doit tenir
  sans lui.

Et quelques règles de bon goût : les couleurs par `var(--…)` ; animer
`transform` et `opacity`, fluides même sur un petit ordinateur ; une entrée
dure moins d'une seconde, une boucle reste discrète ; jamais plus de trois
clignotements par seconde ; une animation porte UNE idée.
