# Les plugins Skoole

Le connecteur qui permet à l'agent Claude d'un formateur de travailler
directement dans sa plateforme [Skoole](https://skoole.app) : lire ses classes,
chercher dans sa bibliothèque, ouvrir un module, lire le programme d'une classe.

**Rien dans ce dépôt n'est secret.** Le jeton reste chez le formateur, il n'est
jamais stocké par Skoole (seule son empreinte l'est), et il se révoque d'un
clic.

## Installer

Dans Claude Code :

```
/plugin marketplace add skoole-app/plugins
/plugin install skoole@skoole
```

## Le jeton

1. Dans Skoole : **Mon compte → Connecteur → Créer un jeton**.
2. Il s'affiche **une seule fois**. Le copier.
3. Le poser dans le fichier `~/.skoole/token`, une seule ligne :

```bash
mkdir -p ~/.skoole && chmod 700 ~/.skoole && printf '%s\n' 'COLLE_TON_JETON_ICI' > ~/.skoole/token && chmod 600 ~/.skoole/token
```

Puis **redémarrer Claude Code** : le serveur du connecteur lit le jeton à son
démarrage.

> **Pourquoi un fichier et pas une variable d'environnement ?** Parce qu'une
> application de bureau lancée depuis le Dock n'hérite pas du `~/.zshrc` de son
> utilisateur : on pose la variable, on ne voit aucun réglage dans l'interface,
> et le connecteur répond « jeton absent » sans qu'on puisse rien y faire.
> Le fichier marche partout, terminal compris. `SKOOLE_TOKEN` reste accepté
> pour ceux qui préfèrent, et prend le dessus s'il est renseigné.

Deux portées au choix à la création : **Verser** (déposer des briques) et
**Verser et piloter** (déposer, ranger dans un module, ouvrir et fermer). Un
jeton ne donne jamais plus que ce que le formateur voit lui-même à l'écran, et
il se révoque au même endroit.

## Ce que le connecteur sait faire aujourd'hui

| Outil | Ce qu'il fait | Portée |
|---|---|---|
| `skoole_me` | le compte, les établissements, les classes et leurs identifiants, la portée du jeton, la version de format | lecture |
| `skoole_library` | les briques du formateur, avec la recherche de l'écran | lecture |
| `skoole_module` | un module et ses contenus dans l'ordre | lecture |
| `skoole_program` | les programmes d'une classe, leurs crans, ce qui est ouvert | lecture |
| `skoole_import` | déposer une brique écrite en markdown dans la bibliothèque | Verser |
| `skoole_attach` | ranger une brique dans un module, à un temps pédagogique | Verser et piloter |
| `skoole_programr` | poser un module dans un cran de programme, l'ouvrir, le fermer | Verser et piloter |

**La nature d'une brique n'est pas déclarée, elle est reconnue** : cases à
cocher = QCM, questions « ### » avec « Type : » = questionnaire, « ## Énoncé »
= exercice, en-tête « Jeux : » = jeu, le reste = un cours. C'est la même
reconnaissance que la zone de dépôt de Skoole.

Ce que le connecteur **ne fait pas** : supprimer, archiver, déposer un fichier
(une annexe se dépose dans Skoole), créer un module, ni toucher à la copie
d'un étudiant.

## Ce qu'il ne fera jamais

- Dicter une pédagogie. Ce plugin dit le format et l'état de Skoole ; les règles
  pédagogiques restent celles de chaque formateur.
- Agir au nom du serveur. Le jeton se résout en utilisateur, et le formateur
  n'obtient rien de plus que ce qu'il voit dans son navigateur.

## Contenu du dépôt

```
.claude-plugin/marketplace.json   la marketplace, qui pourra porter d'autres plugins
plugin/
  .claude-plugin/plugin.json      le plugin « skoole »
  .mcp.json                       le serveur MCP, lancé par Claude Code
  mcp/skoole-mcp.mjs              le serveur, en Node pur, sans dépendance
  skills/skoole/SKILL.md          ce que l'agent doit savoir de Skoole
```

## Pourquoi des noms d'outils en anglais

Les outils, leurs paramètres et les clés des réponses sont des **identifiants**,
et ils sont en anglais, comme le code. Le vocabulaire du produit, lui, reste
celui du formateur : une **brique**, un **module**, un **cran**, et les quatre
temps `comprendre`, `pratiquer`, `appliquer`, `evaluer` gardent leurs noms
français jusque dans les valeurs, parce que ce sont des données de Skoole et
non des mots de protocole.

La raison est simple : un nom d'outil ne se renomme pas. Un agent qui a appris
`skoole_import` dans une conversation ne retrouve rien le jour où l'outil
s'appelle autrement, et aucune redirection n'existe pour cela. Les
**descriptions**, elles, sont en français aujourd'hui et se traduiront sans
rien casser.

## Version de format

Le connecteur annonce la version de format qu'il attend (`version_format` dans
`skoole_me`), et ce plugin déclare celle qu'il connaît. Un écart entre les
deux veut dire qu'il faut mettre le plugin à jour :

```
/plugin marketplace update skoole
/plugin update skoole@skoole
```

Version de format de ce plugin : **2026-09-12**.
