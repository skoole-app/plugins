---
name: skoole
description: Travailler dans Skoole depuis Claude, au nom du formateur connecté. Sait lire ses classes, chercher dans sa bibliothèque de briques, ouvrir un module et lire le programme d'une classe. Déclencher quand l'utilisateur parle de SA plateforme Skoole, de ses classes, de ses modules, de sa bibliothèque, ou demande « où en est ma classe », « qu'est-ce que j'ai déjà sur ce thème », « montre-moi le module de la semaine dernière ».
---

# Skoole, vu depuis Claude

Skoole est la plateforme où ce formateur range ses cours, ses QCM, ses jeux et
ses exercices, et où il ouvre chaque semaine des contenus à ses classes. Ce
plugin donne à Claude quatre lectures sur SES données, par un jeton personnel
qu'il crée lui-même et qu'il peut révoquer.

## Avant tout : le jeton

Le connecteur ne fonctionne qu'avec un jeton :

1. dans Skoole, **Mon compte → Connecteur → Créer un jeton** ;
2. il s'affiche **une seule fois**, le copier ;
3. le poser dans la variable d'environnement `SKOOLE_TOKEN`.

Sans jeton, chaque outil répond qu'il en manque un. Ce n'est pas une panne.

## Le vocabulaire de Skoole, en six mots

Le formateur emploie ces mots-là, et Claude doit les employer aussi.

- **Brique** : une unité de contenu. Sept natures : présentation (des slides),
  cours (du texte rédigé), QCM, questionnaire, exercice, jeu, élément (un
  document ou un lot de fichiers). Tout ce qui entre dans Skoole est une
  brique : rien ne se dépose « en vrac ».
- **Bibliothèque** : toutes ses briques, cherchables.
- **Module** : un assemblage de briques, rangées en quatre temps :
  **comprendre, pratiquer, appliquer, évaluer**.
- **Programme** : la suite de crans d'une classe, dans l'ordre de l'année. Un
  module se pose dans un cran.
- **Ouvrir / fermer** : ce que les étudiants voient d'un module, cran par cran.
  Une brique existe sans être ouverte.
- **Classe** : un groupe d'étudiants d'un établissement. Un formateur en tient
  souvent plusieurs, dans plusieurs écoles.

## Les outils

| Outil | Ce qu'il rend |
|---|---|
| `skoole_moi` | le compte, les établissements, **les classes avec leur identifiant**, la portée du jeton, la version de format |
| `skoole_bibliotheque` | les briques du formateur, avec la recherche de l'écran (`q`, `type`, `module`, `limite`) |
| `skoole_module` | un module et ses contenus **dans l'ordre**, avec leur temps et leur nature |
| `skoole_programme` | les programmes d'une classe, leurs crans, ce qui est ouvert |

**Commencer par `skoole_moi`** : les identifiants de classes viennent de là, et
personne ne les connaît par cœur.

## Ce que le connecteur ne fait pas encore

- **Il ne verse rien.** Déposer une brique, la ranger dans un module, ouvrir un
  cran : c'est le lot suivant. Aujourd'hui, tout est en lecture.
- **Il ne lit pas les copies des élèves.** Prévu, borné aux exercices que le
  formateur a lui-même donnés, et journalisé.
- **Il ne dicte aucune pédagogie.** Ce plugin dit le FORMAT et l'ÉTAT de
  Skoole ; les règles pédagogiques restent celles du formateur, dans son propre
  projet. C'est une frontière voulue : le plugin est multi-matière.

## Deux réflexes

- **Un refus n'est pas une panne.** « Introuvable, ou hors de ce que ce compte
  peut lire » veut dire que la brique appartient à quelqu'un d'autre, ou
  n'existe pas. Le connecteur ne dit jamais laquelle des deux : c'est voulu.
- **La version de format s'annonce.** `skoole_moi` rend `version_format`. Si
  elle est plus récente que celle que ce plugin connaît, le dire au formateur :
  il lui manque une mise à jour, et un contenu écrit à l'ancien format pourrait
  être refusé à l'import.

Version de format connue de ce plugin : **2026-09-12**.
