---
name: skoole
description: Travailler dans Skoole depuis Claude, au nom du formateur connecté : lire ses classes, chercher dans sa bibliothèque, verser une brique, composer un module, le poser dans le programme d'une classe. Déclencher quand l'utilisateur parle de SA plateforme Skoole, de ses classes, de ses modules, de sa bibliothèque, ou dit « verse ça dans Skoole », « où en est ma classe », « qu'est-ce que j'ai déjà sur ce thème », « monte-moi un module pour la semaine prochaine ».
---

# Skoole, vu depuis Claude

Skoole est la plateforme où un formateur range ses cours, ses QCM, ses
questionnaires, ses exercices et ses jeux, et où il ouvre chaque semaine des
contenus à ses classes. Il y travaille seul ou pour une école. Ce plugin donne
à Claude dix outils sur SES données, par une connexion qu'il autorise lui-même
et révoque quand il veut. Il dit le FORMAT de chaque contenu, les RÈGLES de
Skoole et l'ÉTAT de sa plateforme. **Il ne dicte aucune pédagogie** : ce qu'on
enseigne, dans quel ordre et pour quelle matière reste au formateur. C'est une
frontière voulue, Skoole étant multi-matière.

## La connexion

Le connecteur est hébergé par Skoole et s'authentifie **par le navigateur** :
dans Claude Code, `/mcp` puis **Authenticate** sur la ligne `skoole` ; dans
l'application Claude, ajouter `https://skoole.app/mcp` en connecteur
personnalisé. Le formateur clique « Autoriser » sur un écran Skoole, et c'est
tout.

⚠️ **Ne jamais lui demander un jeton, ni lui proposer d'en coller un** : il
n'y en a pas. « Authentification requise » veut dire que la connexion n'est
pas faite ou qu'elle a été révoquée : refaire `/mcp` puis Authenticate,
jamais chercher un secret quelque part. Il coupe l'accès dans Skoole, **Mon
compte, Connecteur**.

Deux portées : **Verser** (lire et déposer des briques, créer un module) et
**Verser et piloter** (en plus : ranger dans un module, poser dans un
programme, ouvrir et fermer).

## Le vocabulaire

- **Brique** : une unité de contenu. Sept natures : présentation (des
  slides), cours (du texte rédigé), QCM, questionnaire, exercice, jeu,
  élément (un document, un fichier). **Tout contenu est une brique** : rien
  ne se dépose en vrac.
- **Bibliothèque** : toutes ses briques, cherchables. La Bibliothèque CRÉE.
- **Module** : un assemblage de briques, rangées en **cinq temps** :
  `comprendre`, `pratiquer` (affiché « S'entraîner »), `appliquer`,
  `evaluer`, `elements` (ce qui s'appuie : documents, fichiers, podcasts).
- **Programme** : la suite des crans d'une classe, dans l'ordre de l'année.
  Un module se pose dans un cran. Le programme DIFFUSE.
- **Classe** : un groupe d'étudiants d'un établissement. Elle porte les
  résultats. Un formateur en tient souvent plusieurs, dans plusieurs écoles.
- **Ouvrir / fermer** : ce que les étudiants voient d'un cran. Une brique
  existe sans être ouverte, un module posé arrive **tout fermé**.
- **Posé, visible, invisible** : un module posé dans un cran est là ; le cran
  est visible (ouvert) ou invisible (fermé) pour les étudiants.

## Les dix outils

| Outil | Ce qu'il fait |
|---|---|
| `skoole_me` | le compte, les établissements, **les classes avec leur identifiant**, la portée, la version de format |
| `skoole_library` | les briques du formateur, avec la recherche de l'écran (`q`, `type`, `module`, `limit`) |
| `skoole_brick` | le CONTENU d'une brique (`id`, `kind`) : sa matière, ses étiquettes, ses modules |
| `skoole_module` | un module et ses contenus dans l'ordre, avec leur temps et leur nature |
| `skoole_program` | les programmes d'une classe, leurs crans, ce qui est ouvert |
| `skoole_import` | déposer une brique écrite en **markdown** dans la bibliothèque |
| `skoole_module_create` | créer un module (`title`, `description`, `tags`) |
| `skoole_attach` | ranger une brique dans un module, à un temps |
| `skoole_program_create` | créer un programme dans une classe qui n'en a aucun qui convienne |
| `skoole_schedule` | poser un module dans un cran, l'ouvrir ou le fermer |

**Commencer par `skoole_me`** : les identifiants de classes viennent de là.

## L'ordre de composition

Il ne se prend jamais à l'envers, c'est la règle la plus importante.

1. **Verser les briques une par une** avec `skoole_import`, et garder
   l'identifiant de chacune.
2. **Créer le module** avec `skoole_module_create`, puis y ranger chaque
   brique à son temps avec `skoole_attach`.
3. **Poser le module** dans un cran avec `skoole_schedule`, l'identifiant du
   programme venant de `skoole_program` (ou de `skoole_program_create` si la
   classe n'a aucun programme qui convienne).

Jamais un module vide posé pour plus tard, jamais un cran avant son module.

**Pour composer, lis d'abord** : `skoole_library` dit ce qui existe,
`skoole_brick` dit ce qu'il y a dedans. Une brique déjà en bibliothèque se
range telle quelle, elle ne se réécrit pas.

## Ce que le connecteur ne fait pas

- **Aucun fichier.** Une annexe, un PDF, une image se déposent dans Skoole
  par le formateur. Un exercice qui déclare « Annexe : x.xlsx » est versé
  avec son annexe ATTENDUE, pas avec le fichier.
- **Aucune copie d'étudiant**, ni en lecture ni en écriture.
- **Aucune suppression, aucun archivage.** Un geste destructeur ne passe
  jamais par le connecteur.
- **Aucune pédagogie dictée** (voir plus haut).

## La marque du robot

Tout ce qu'un agent pose dans Skoole (brique, module, rangement, cran de
programme) est **marqué d'un robot** dans l'interface, et filtrable. Le
formateur voit donc ce qui vient de Claude. Le dire plutôt que le taire : ce
n'est pas une surveillance, c'est de quoi relire.

## Deux réflexes

- **Un refus n'est pas une panne.** « Introuvable, ou hors de ce que ce
  compte peut lire » veut dire que la chose appartient à quelqu'un d'autre,
  ou n'existe pas. Le connecteur ne dit jamais laquelle des deux.
- **La version de format s'annonce.** `skoole_me` rend `format_version` : plus
  récente que celle de ce plugin, il manque `/plugin update skoole@skoole`.

## Les compétences de format

Une par nature que le connecteur sait verser. Les lire AVANT d'écrire :
`skoole-cours`, `skoole-qcm`, `skoole-questionnaire`, `skoole-exercice`,
`skoole-jeux`. Et `skoole-composer` pour l'enchaînement complet.

Version de format connue de ce plugin : **2026-09-14**.
