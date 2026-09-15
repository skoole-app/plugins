# Les plugins Skoole

Le connecteur qui permet à l'agent Claude d'un formateur de travailler
directement dans sa plateforme [Skoole](https://skoole.app) : lire ses classes
et sa bibliothèque, écrire ses contenus au bon format, les verser, les monter
en module et poser ce module dans le programme d'une classe.

**Rien dans ce dépôt n'est secret.** Le formateur autorise la connexion dans
son navigateur, aucun jeton ne se copie nulle part, et l'accès se révoque d'un
clic dans Skoole.

## Installer

Dans Claude Code :

```
/plugin marketplace add skoole-app/plugins
/plugin install skoole@skoole
```

## Se connecter

Rien à copier, rien à poser dans un fichier : **un bouton**.

Dans Claude Code, après l'installation :

```
/mcp
```

puis, sur la ligne `skoole`, **Authenticate**. Le navigateur s'ouvre sur
Skoole, tu te connectes comme d'habitude si ce n'est pas déjà fait, tu lis ce
qui est demandé, tu cliques **Autoriser**. C'est fini.

Dans l'application Claude (sans Claude Code) : **Réglages → Connecteurs →
Ajouter un connecteur personnalisé**, et coller :

```
https://skoole.app/mcp
```

### Ce que tu autorises

L'écran de consentement dit qui demande, ce qu'il pourra faire, et sous quel
compte. Deux portées : **Verser** (lire, déposer des briques, créer un module)
et **Verser et piloter** (en plus : ranger dans un module, poser dans un
programme, ouvrir et fermer). Un connecteur ne voit jamais plus que ce que tu
vois toi-même à l'écran.

**Pour couper l'accès** : Skoole, **Mon compte → Connecteur**, et tu révoques.
L'application est déconnectée à la seconde.

**Tout ce qu'un agent pose est marqué d'un robot** dans Skoole, et filtrable :
tu vois d'un coup d'œil ce qui vient de Claude et ce qui vient de toi.

## Les dix outils

| Outil | Ce qu'il fait | Portée |
|---|---|---|
| `skoole_me` | le compte, les établissements, les classes et leurs identifiants, la portée du jeton, la version de format | Verser |
| `skoole_library` | les briques du formateur, avec la recherche de l'écran | Verser |
| `skoole_brick` | le contenu d'une brique : sa matière, ses étiquettes, ses modules | Verser |
| `skoole_module` | un module et ses contenus dans l'ordre | Verser |
| `skoole_program` | les programmes d'une classe, leurs crans, ce qui est ouvert | Verser |
| `skoole_import` | déposer une brique écrite en markdown dans la bibliothèque | Verser |
| `skoole_module_create` | créer un module (titre, description, étiquettes) | Verser |
| `skoole_attach` | ranger une brique dans un module, à un temps pédagogique | Verser et piloter |
| `skoole_program_create` | créer un programme dans une classe qui n'en a aucun | Verser et piloter |
| `skoole_schedule` | poser un module dans un cran de programme, l'ouvrir, le fermer | Verser et piloter |

**La nature d'une brique n'est pas déclarée, elle est reconnue** : cases à
cocher = QCM, questions « ### » avec « Type : » = questionnaire, section
« ## Énoncé » = exercice, une section dont le titre est une clé de jeu (ou
l'ancien en-tête « Jeux : ») = jeu, le reste = un cours. C'est la même
reconnaissance que la zone de dépôt de Skoole.

Ce que le connecteur **ne fait pas** : supprimer, archiver, déposer un fichier
(une annexe se dépose dans Skoole), ni toucher à la copie d'un étudiant.

## Les compétences

| Compétence | Ce qu'elle donne à l'agent |
|---|---|
| `skoole` | ce qu'est Skoole, le vocabulaire, la connexion, les dix outils, l'ordre de composition |
| `skoole-cours` | le format d'un cours rédigé, et les pièges qui changeraient sa nature |
| `skoole-qcm` | le format QCM-MD, ses quatre formes de question, ses règles de qualité |
| `skoole-questionnaire` | le format QUESTIONNAIRE-MD, ses quatre types, sa stricte lecture |
| `skoole-exercice` | le format EXERCICE-MD : énoncé, corrigé, rendu à remplir, annexes attendues |
| `skoole-jeux` | le format JEUX-MD « une section, un jeu », les neuf clés et leur matière |
| `skoole-composer` | lire l'existant, monter un module, le poser dans un programme |

Chaque compétence de format porte son `exemple.md` : un contenu court et
complet, qui passe le vrai parseur de Skoole (un test de la plateforme le
vérifie à chaque build).

## Ce qui change en 1.1.1

*15 septembre 2026.*

- **Trois compétences se chargeaient sans leur en-tête** : l'accueil
  (`skoole`), `skoole-jeux` et `skoole-composer` avaient une description
  contenant un deux-points, que le lecteur YAML refusait ; le plugin les
  servait avec des métadonnées vides, donc sans nom ni déclencheur. Les
  descriptions sont en bloc replié (`>-`), et `claude plugin validate` passe.
  Rien d'autre ne change.

## Ce qui change en 1.1.0

*14 septembre 2026.*

- **Sept compétences au lieu d'une.** Le plugin ne dit plus seulement ce qu'est
  Skoole : il dit le FORMAT de chaque contenu qu'on peut y verser, avec un
  exemple canonique par nature.
- **Trois outils de plus, dix en tout** : `skoole_brick` (lire le contenu
  d'une brique), `skoole_module_create` et `skoole_program_create`. L'agent
  n'a plus besoin qu'on lui prépare les contenants.
- **L'ordre de composition est écrit** : verser les briques, puis créer le
  module et y ranger, puis poser dans le programme. Jamais un module vide posé
  pour plus tard.
- **Cinq temps, plus quatre** : `elements` rejoint `comprendre`, `pratiquer`,
  `appliquer` et `evaluer`.
- **Coquille corrigée** : l'outil de programmation s'appelle `skoole_schedule`.
  La version 1.0.0 de ce README le nommait `skoole_programr`, qui n'a jamais
  existé.
- **Le format des jeux a changé** : on écrit désormais une section par jeu
  (`## tri · Titre`), chacune avec sa propre matière. L'ancien format (en-tête
  « Jeux : ») reste lu, il ne s'écrit plus.
- **La marque du robot** : tout ce qu'un agent pose est signalé dans Skoole.

## Ce qu'il ne fera jamais

- Dicter une pédagogie. Ce plugin dit le format et l'état de Skoole ; les
  règles pédagogiques restent celles de chaque formateur, et Skoole est
  multi-matière.
- Agir au nom du serveur. Le jeton se résout en utilisateur, et le formateur
  n'obtient rien de plus que ce qu'il voit dans son navigateur.

## Contenu du dépôt

```
.claude-plugin/marketplace.json   la marketplace, qui pourra porter d'autres plugins
plugin/
  .claude-plugin/plugin.json      le plugin « skoole »
  .mcp.json                       le connecteur, hébergé par Skoole
  skills/
    skoole/SKILL.md               ce que l'agent doit savoir de Skoole
    skoole-cours/                 SKILL.md + exemple.md
    skoole-qcm/                   SKILL.md + exemple.md
    skoole-questionnaire/         SKILL.md + exemple.md
    skoole-exercice/              SKILL.md + exemple.md
    skoole-jeux/                  SKILL.md + exemple.md
    skoole-composer/SKILL.md      lire, monter, poser
```

Le connecteur lui-même n'est pas ici : il vit chez Skoole, à
`https://skoole.app/mcp`. Ce dépôt ne porte que les COMPÉTENCES et la
déclaration du connecteur. Une évolution des outils arrive donc toute seule,
sans rien mettre à jour ; une évolution des FORMATS, elle, demande une mise à
jour du plugin.

## Pourquoi des noms d'outils en anglais

Les outils, leurs paramètres et les clés des réponses sont des **identifiants**,
et ils sont en anglais, comme le code. Le vocabulaire du produit, lui, reste
celui du formateur : une **brique**, un **module**, un **cran**, et les cinq
temps `comprendre`, `pratiquer`, `appliquer`, `evaluer`, `elements` gardent
leurs noms français jusque dans les valeurs, parce que ce sont des données de
Skoole et non des mots de protocole.

La raison est simple : un nom d'outil ne se renomme pas. Un agent qui a appris
`skoole_import` dans une conversation ne retrouve rien le jour où l'outil
s'appelle autrement, et aucune redirection n'existe pour cela. Les
**descriptions**, elles, sont en français aujourd'hui et se traduiront sans
rien casser.

## Version de format

Le connecteur annonce la version de format qu'il attend (`format_version` dans
`skoole_me`), et ce plugin déclare celle qu'il connaît. Un écart entre les
deux veut dire qu'il faut mettre le plugin à jour :

```
/plugin marketplace update skoole
/plugin update skoole@skoole
```

Version de format de ce plugin : **2026-09-14**.
