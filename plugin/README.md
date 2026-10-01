# Les plugins Skoole

Le connecteur qui permet à l'agent Claude d'un formateur de travailler
directement dans sa plateforme [Skoole](https://skoole.app) : lire ses classes
et sa bibliothèque, écrire ses contenus au bon format, les verser, les monter
en module, composer le fil de la séance, poser ce module dans le programme
d'une classe, publier ses pages web, lire les copies et en proposer la
correction.

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
compte. Deux portées : **Verser** (lire, déposer des briques, créer et
corriger un module, étiqueter, outiller un exercice, publier des pages, écrire
des notes de slide, proposer une correction) et **Verser et piloter** (en
plus : ranger dans un module et l'en retirer, composer le fil de la séance,
supprimer une brique, poser dans un programme, ouvrir et fermer). Un
connecteur ne voit jamais plus que ce que tu vois toi-même à l'écran.

**Pour couper l'accès** : Skoole, **Mon compte → Connecteur**, et tu révoques.
L'application est déconnectée à la seconde.

**Tout ce qu'un agent pose est marqué d'un robot** dans Skoole, et filtrable :
tu vois d'un coup d'œil ce qui vient de Claude et ce qui vient de toi.

## Les vingt-cinq outils

| Outil | Ce qu'il fait | Portée |
|---|---|---|
| `skoole_me` | le compte, les établissements, les classes et leurs identifiants, la portée du jeton, la version de format | Verser |
| `skoole_library` | les briques du formateur, avec la recherche de l'écran | Verser |
| `skoole_brick` | le contenu d'une brique : sa matière, ses étiquettes, ses modules ; le corrigé d'un exercice | Verser |
| `skoole_module` | un module et ses contenus dans l'ordre | Verser |
| `skoole_program` | les programmes d'une classe, leurs crans, ce qui est ouvert | Verser |
| `skoole_upload` | une adresse de dépôt signée pour pousser un zip (un `PUT`) : une présentation, ou un site des Pages | Verser |
| `skoole_import` | déposer une brique dans la bibliothèque : un markdown, ou le zip poussé par `skoole_upload` ; même identifiant = corrigée en place | Verser |
| `skoole_module_create` | créer un module (titre, description, étiquettes) | Verser |
| `skoole_module_update` | corriger le titre, la description ou les étiquettes d'un module ; un paramètre absent ne change rien | Verser |
| `skoole_tag` | poser et retirer les étiquettes d'une brique ou d'un module | Verser |
| `skoole_attach` | ranger une brique dans un module, à un temps pédagogique et dans une zone | Verser et piloter |
| `skoole_deroule` | le fil de la séance : les slides et les pièces, les ancres, les numéros d'ordre | Verser et piloter |
| `skoole_program_create` | créer un programme dans une classe qui n'en a aucun | Verser et piloter |
| `skoole_schedule` | poser un module dans un cran de programme, à un rang, l'ouvrir, le fermer | Verser et piloter |
| `skoole_detach` | retirer une brique d'un module : elle reste en bibliothèque et dans les autres modules | Verser et piloter |
| `skoole_delete` | supprimer une brique de la bibliothèque : elle part à la corbeille et quitte tous les modules | Verser et piloter |
| `skoole_outils` | ce qu'il faut pour faire un exercice : rattacher ou détacher des outils, des calculs, des pages | Verser |
| `skoole_outil_create` | créer un outil, un lien ou un calcul, dans la boîte du formateur | Verser |
| `skoole_coffre` | les Pages du formateur : lister, publier ou remplacer un site, le retirer, le remettre, le renommer | Verser |
| `skoole_entreprise` | écrire dans le fil rouge : une pièce, ou l'identité de l'entreprise fictive | Verser |
| `skoole_slide_notes` | les notes de slide : lire, écrire, voir ce que le formateur a changé | Verser |
| `skoole_class_progress` | où en est une classe, contenu par contenu, sans aucune copie | Verser |
| `skoole_results` | les résultats d'un contenu pour une classe, étudiant par étudiant | Verser |
| `skoole_submission` | une copie d'exercice : son texte, le retour rendu, la correction proposée, ses fichiers par adresse signée | Verser |
| `skoole_correction` | proposer la correction des copies d'un exercice : invisible de l'élève tant que le formateur ne l'a pas rendue | Verser |

**La nature d'une brique n'est pas déclarée, elle est reconnue** : cases à
cocher = QCM, questions « ### » avec « Type : » = questionnaire, section
« ## Consigne » (ou « ## Énoncé ») = exercice, une section dont le titre est
une clé de jeu (ou l'ancien en-tête « Jeux : ») = jeu, le reste = un cours.
C'est la même reconnaissance que la zone de dépôt de Skoole. Seule exception,
le document (un récapitulatif, un corrigé), qui se dit : `kind: "document"`.

**Les Pages** : un site web complet (HTML, CSS, scripts) ne va jamais dans une
slide ni dans une brique. Il se publie dans les Pages du formateur, à sa propre
adresse sur `skoole.page`, où ses scripts n'atteignent rien de Skoole ; il se
rattache à un exercice, et l'élève le trouve dans l'onglet « Outils ». Les
Pages s'ouvrent compte par compte. L'outil garde son nom, `skoole_coffre`.

Ce que le connecteur **ne fait pas** : archiver, déposer un fichier autre que
le zip d'une présentation ou d'un site (une annexe se dépose dans Skoole),
écrire dans la copie d'un étudiant, ni rendre une correction à sa place : il
la propose, le formateur la rend.

## Les compétences

| Compétence | Ce qu'elle donne à l'agent |
|---|---|
| `skoole` | ce qu'est Skoole, le vocabulaire, la connexion, les vingt-cinq outils, l'ordre de composition, le fil de la séance, les Pages, la correction proposée, les mots de l'écran élève |
| `skoole-cours` | le format d'un cours rédigé, les pièges qui changeraient sa nature, et le mouvement dans les slides (la marque `skoole-active`) |
| `skoole-qcm` | le format QCM-MD, ses quatre formes de question, ses règles de qualité |
| `skoole-questionnaire` | le format QUESTIONNAIRE-MD, ses quatre types, sa stricte lecture |
| `skoole-exercice` | le format EXERCICE-MD : consigne, exemple de rendu, corrigé, barème, rendu à remplir, annexes attendues ; outils et pages rattachés ; la correction proposée |
| `skoole-jeux` | le format JEUX-MD « une section, un jeu », les neuf clés et leur matière |
| `skoole-composer` | lire l'existant, monter un module (temps et zones), composer le fil, outiller un exercice, le poser dans un programme, corriger et défaire |

Chaque compétence de format porte son `exemple.md` : un contenu court et
complet, qui passe le vrai parseur de Skoole (un test de la plateforme le
vérifie à chaque build).

## Ce qui change en 1.9.0

*1er octobre 2026 au soir.*

- **Le barème d'un exercice** : une partie `## Barème`, facultative, écrite en
  face du corrigé, réservée au formateur. `skoole_brick` la rend
  (`content.scale`) avec `content.graded` (l'exercice est-il noté).
- **Le niveau d'acquisition** : `skoole_correction` prend `level`
  (`acquis`, `en_cours`, `non_acquis`), facultatif, en plus ou à la place de
  la note ; il part chez l'élève avec la correction, au geste du formateur.
  `skoole_results` et `skoole_submission` le relisent sous `level`.
- **Corriger avec un barème** : les points critère par critère, plus fourni
  quand c'est noté.

## Ce qui change en 1.8.0

*1er octobre 2026.*

- **L'exemple de rendu d'un exercice** (`skoole-exercice`) : une partie
  `## Exemple de rendu` dans EXERCICE-MD, qui montre la FORME attendue sur
  une entreprise fictive, volontairement incomplète. Fermée à l'étudiant tant
  que le formateur ne l'ouvre pas ; chez l'étudiant, un onglet « Exemple »
  juste après la consigne. Un exemple changé alors qu'il était ouvert est
  refermé, et l'import le dit.
- **`skoole_brick` rend l'exemple et le rendu à remplir** (`content.example`,
  `content.exampleOpen`, `content.template`) : pour corriger un exercice, on
  le relit entier, puis on le renvoie entier, une partie absente étant
  effacée.

## Ce qui change en 1.7.0

*28 septembre 2026.*

- **Vingt-cinq outils** (le plugin en annonçait vingt-deux, et son README
  treize) : `skoole_correction`, `skoole_module_update` et `skoole_coffre`
  rejoignent la table, et chaque ligne dit les paramètres d'aujourd'hui
  (`zone` pour ranger, `rank` pour poser un cran, `withContent: false` pour
  lire les notes de slide en léger).
- **Les Pages** : un site web complet se publie dans les Pages du formateur
  (`skoole_upload` puis `skoole_coffre`), à sa propre adresse sur
  `skoole.page`, et se rattache à un exercice par `skoole_outils`. On dit
  « pages » au formateur, l'outil garde son nom.
- **La correction proposée** : `skoole_correction` propose, le formateur rend,
  l'élève ne voit que ce qui a été rendu.
- **Le fil de la séance** : le déroulé écrit n'existe plus, les ancres sont la
  voie du fil, et une ancre posée sort une pièce d'« à classer ». Les zones
  (`a_classer`, `avant`, `apres`, `disposition`, `formateur`) sont décrites.
- **Le mouvement dans les slides** (`skoole-cours`) : la marque
  `skoole-active`, les entrées écrites sous elle, la slide complète sans elle,
  aucun script.
- **Les mots de l'écran élève** : l'onglet « Outils », « Faire l'exercice »,
  la copie rédigée et déposée en plein écran, la copie corrigée ouverte sur
  « Tout ». Une consigne ne dit plus « en bas de la page ».
- **Corrigé** : un exercice se reconnaît à `## Consigne` comme à `## Énoncé`
  (le plugin disait le contraire) ; un QCM ou un questionnaire renvoyé sous le
  même identifiant est mis à jour (le plugin annonçait un refus, ou rien de
  réécrit) ; `skoole_module` prend `id` ; les lignes `Noté :`, `Travail :` et
  `Entreprise :` d'un exercice sont décrites ; les exemples du cours et de
  l'exercice portent leur `Identifiant :`.

## De 1.3.0 à 1.6.0

- **1.6.0** (23 septembre) : les notes de slide, `skoole_slide_notes`.
- **1.5.0** (20 septembre) : le déroulé d'une séance et le numéro d'ordre,
  `skoole_deroule`, avec `skoole_tag`, `skoole_entreprise`, `skoole_outils`
  et `skoole_outil_create`.
- **1.4.0** (18 septembre) : lire les résultats, les rendus et les copies,
  `skoole_class_progress`, `skoole_results`, `skoole_submission`.
- **1.3.0** (16 septembre) : retirer une brique d'un module (`skoole_detach`)
  et la supprimer de la bibliothèque (`skoole_delete`).

## Ce qui change en 1.2.0

- **Corriger une brique existante** : renvoyée sous le même `Identifiant :`,
  elle est réécrite en place (`updated`), ou versionnée si des élèves sont
  passés (`previousId`). Les cours et les exercices portent désormais cette
  ligne. Fini les trois copies du même exercice.
- **Le zip d'une présentation** s'envoie : `skoole_upload` rend une adresse
  de dépôt signée, un `PUT` y pousse le zip, `skoole_import { upload }` en
  fait la brique. Onzième outil.
- Version de format **2026-09-16**.

## Ce qui change en 1.1.2

*15 septembre 2026.*

- **Le README vit DANS le plugin** (`plugin/README.md`), comme celui du kit
  `go` : l'afficheur de plugins de l'application Claude ouvre le README du
  plugin dans son onglet « Contenu », et un plugin sans document à sa racine
  n'avait pas cet onglet. Le README de la racine du dépôt n'est plus qu'un
  renvoi. Rien d'autre ne change.

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
README.md                         un renvoi vers celui du plugin
plugin/
  .claude-plugin/plugin.json      le plugin « skoole »
  .mcp.json                       le connecteur, hébergé par Skoole
  README.md                       ce fichier
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

Version de format de ce plugin : **2026-09-16**.
