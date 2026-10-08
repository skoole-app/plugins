---
name: skoole
description: >-
  Travailler dans Skoole depuis Claude, au nom du formateur connecté : lire ses classes, chercher dans sa bibliothèque, verser une brique, composer un module, le poser dans le programme d'une classe, publier une page web, lire les copies et proposer leur correction. Déclencher quand l'utilisateur parle de SA plateforme Skoole, de ses classes, de ses modules, de sa bibliothèque, de ses pages, ou dit « verse ça dans Skoole », « où en est ma classe », « qu'est-ce que j'ai déjà sur ce thème », « monte-moi un module pour la semaine prochaine », « propose la correction de ces copies », « mets ce site en ligne pour mes élèves ».
---

# Skoole, vu depuis Claude

Skoole est la plateforme où un formateur range ses cours, ses QCM, ses
questionnaires, ses exercices et ses jeux, et où il ouvre chaque semaine des
contenus à ses classes. Il y travaille seul ou pour une école. Ce plugin donne
à Claude trente et un outils sur SES données, par une connexion qu'il autorise
lui-même et révoque quand il veut. Il dit le FORMAT de chaque contenu, les
RÈGLES de Skoole et l'ÉTAT de sa plateforme. **Il ne dicte aucune pédagogie** :
ce qu'on enseigne, dans quel ordre et pour quelle matière reste au formateur.
C'est une frontière voulue, Skoole étant multi-matière.

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

Deux portées. **Verser** : lire, déposer des briques, créer et corriger un
module, étiqueter, outiller un exercice, publier des pages, écrire dans le fil
rouge et dans les notes de slide, proposer une correction. **Verser et
piloter**, en plus : ranger dans un module et l'en retirer, composer le fil de
la séance, supprimer une brique, créer un programme, poser dans un programme,
y déplacer et en retirer un cran, ouvrir et fermer.

## Le vocabulaire

- **Brique** : une unité de contenu. Sept natures : présentation (des
  slides), cours (du texte rédigé), QCM, questionnaire, exercice, jeu,
  élément (un document, un fichier). **Tout contenu est une brique** : rien
  ne se dépose en vrac.
- **Bibliothèque** : toutes ses briques, cherchables. La Bibliothèque CRÉE.
- **Module** : un assemblage de briques, rangées en **cinq temps** :
  `comprendre`, `pratiquer` (affiché « S'entraîner »), `appliquer`,
  `evaluer`, `elements` (ce qui s'appuie : documents, fichiers, podcasts).
  Dans la page du module, chaque pièce a aussi une **zone** : à classer,
  avant, le fil de la séance, après, à disposition, pour le formateur.
- **Programme** : la suite des crans d'une classe, dans l'ordre de l'année.
  Un module se pose dans un cran. Le programme DIFFUSE.
- **Classe** : un groupe d'étudiants d'un établissement. Elle porte les
  résultats. Un formateur en tient souvent plusieurs, dans plusieurs écoles.
- **Ouvrir / fermer** : ce que les étudiants voient d'un cran. Une brique
  existe sans être ouverte, un module posé arrive **tout fermé**.
- **Pages** : les sites web complets du formateur (HTML, CSS, scripts),
  chacun à sa propre adresse sur `skoole.page`. C'est le mot qu'il voit à
  l'écran : lui parler de **pages**. L'outil, lui, garde son nom,
  `skoole_coffre` (« le coffre » est l'ancien nom de l'écran).

## Les trente et un outils

Dans l'ordre où on s'en sert : lire, verser, composer, défaire, outiller,
puis le travail des élèves.

| Outil | Ce qu'il fait |
|---|---|
| `skoole_me` | le compte, les établissements, **les classes avec leur identifiant**, la portée, la version de format |
| `skoole_library` | les briques du formateur, avec la recherche de l'écran (`q`, `type`, `module`, `limit`) |
| `skoole_brick` | le CONTENU d'une brique (`id`, `kind`) : sa matière, ses étiquettes, ses modules ; pour un exercice, son corrigé, son exemple de rendu, son rendu à remplir et son barème |
| `skoole_module` | un module (`id`) et ses contenus dans l'ordre, avec leur temps, leur nature et l'identifiant de leur rangement |
| `skoole_program` | les programmes d'une classe (`class`), leurs crans avec leur rang (`steps[].rank`, le premier vaut 1), ce qui est ouvert |
| `skoole_upload` | une adresse de dépôt signée pour pousser un **zip** (un `PUT`) : une présentation, ou un site des Pages |
| `skoole_import` | déposer une brique : un **markdown**, ou le zip d'une présentation (`upload`) ; `kind: "document"` pour un document, `tags` pour les étiquettes |
| `skoole_module_create` | créer un module (`title`, `description`, `tags`) |
| `skoole_module_update` | CORRIGER un module (`module`, puis `title`, `description` ou `tags`) : un paramètre absent ne change rien |
| `skoole_tag` | poser et retirer les ÉTIQUETTES d'une brique ou d'un module (`add`, `remove`, `set`) |
| `skoole_attach` | ranger une brique dans un module (`module`, `brick`, `kind`), à un temps (`phase`) et dans une zone (`zone`) |
| `skoole_deroule` | le FIL de la séance : lire les slides et les pièces, poser les ancres (`anchors`) et les numéros d'ordre (`numeros`) |
| `skoole_program_create` | créer un programme dans une classe qui n'en a aucun qui convienne (`class`, `title`, `subject`) |
| `skoole_schedule` | poser un de SES modules dans un cran (`program`, `module`), à un rang (`rank`), l'ouvrir ou le fermer (`open`) |
| `skoole_step_move` | DÉPLACER un cran déjà posé (`program`, puis `step` ou `module`) au rang voulu (`rank`) |
| `skoole_step_remove` | RETIRER un cran du programme (`program`, puis `step` ou `module`), à la corbeille : le module reste en bibliothèque |
| `skoole_detach` | RETIRER une brique d'un module (`item`) : elle reste en bibliothèque |
| `skoole_delete` | SUPPRIMER une brique de la bibliothèque, à la corbeille, partout (`brick`, `kind`, `force`) |
| `skoole_outils` | ce qu'il faut pour FAIRE une brique : ce qui y est rattaché, tout ce qu'on peut rattacher, et rattacher (`add`) ou détacher (`remove`) |
| `skoole_outil_create` | créer un outil : un LIEN (`name`, `url` en http ou https) ou un CALCUL décrit en markdown ; `tool` pour remplacer le sien |
| `skoole_coffre` | les PAGES du formateur (`action` : `list`, `publish`, `withdraw`, `restore`, `rename`) |
| `skoole_entreprise` | écrire dans le FIL ROUGE d'une classe : une PIÈCE, ou l'IDENTITÉ de l'entreprise fictive |
| `skoole_slide_notes` | les NOTES DE SLIDE : lire, écrire, et voir ce que le formateur a changé depuis une date |
| `skoole_class_progress` | OÙ EN EST une classe (`class`) : par contenu, combien l'ont fait sur combien d'attendus |
| `skoole_results` | les résultats d'UN contenu pour une classe (`kind`, `id`, `class`), étudiant par étudiant |
| `skoole_submission` | UNE copie d'exercice (`exercise`, `student`) : son texte (la copie ENTIÈRE d'une équipe, `equipe`), le retour rendu, la correction proposée, ses fichiers par **adresse signée** |
| `skoole_correction` | PROPOSER la correction des copies d'un exercice (`exercise`, `corrections`) : l'élève ne la voit qu'une fois rendue par le formateur ; le niveau que donnent les SEUILS du barème (`thresholds`, `levelFromScale`, `levelGap`) ; et le RAPPORT D'ENSEMBLE de la classe (`report`, `class`) |
| `skoole_teams` | les ÉQUIPES d'un exercice en équipe pour une de mes classes (`exercise`, `class`) : les lire, les TIRER AU SORT (`shuffle`), POSER celles que le formateur dicte (`teams`), AJOUTER un élève à une équipe (`add`) |
| `skoole_rooms` | MES SALLES (les salles à code, sans comptes), les plus récentes d'abord, avec leurs activités lancées : c'est là qu'on retrouve la salle du jour et son identifiant |
| `skoole_room_deroule` | le FIL DE LA SÉANCE d'une de mes salles (`room`) : sans `steps`, le lire ; avec `steps`, le REMPLACER entier (sondage, QCM, jeu, message, note « à dire », chacun ancré ou non à une slide) |
| `skoole_room_results` | les réponses d'un QUESTIONNAIRE passé dans une de mes salles (`room`, `poll` facultatif : le dernier par défaut), SANS AUCUN NOM ; pendant qu'il est ouvert, relire au fil de l'eau avec `since` (repasser le `asOf` de la lecture précédente) |

**Commencer par `skoole_me`** : les identifiants de classes viennent de là.

## L'ordre de composition

Il ne se prend jamais à l'envers, c'est la règle la plus importante.

1. **Verser les briques une par une** avec `skoole_import`, et garder
   l'identifiant de chacune.
2. **Créer le module** avec `skoole_module_create`, puis y ranger chaque
   brique à son temps avec `skoole_attach`.
3. **Poser le module** dans un cran avec `skoole_schedule`, l'identifiant du
   programme venant de `skoole_program` (ou de `skoole_program_create` si la
   classe n'a aucun programme qui convienne). Sans `rank`, le cran va en
   dernier ; avec `rank` (le rang tel que le formateur le lit, le premier
   vaut 1, celui de `steps[].rank`), il prend cette place.

Jamais un module vide posé pour plus tard, jamais un cran avant son module.

**On ne pose que ses PROPRES modules et contenus** : le module d'un collègue
est refusé (« on ne pose dans un programme que ses propres modules »), même
dans un programme que le formateur tient. Un refus à rapporter, pas à
contourner.

## Réordonner et défaire le programme

- **Déplacer** un cran déjà posé : `skoole_step_move { program, step, rank }`
  (ou `module` à la place de `step`). Le cran prend ce rang, ceux qu'il
  dépasse glissent d'un cran, au-delà de la fin il va en dernier. Rien
  d'autre ne bouge (ni l'ouverture, ni les contenus). La réponse rend `rank`
  et `total`, relus après l'écriture. `skoole_schedule` ne déplace JAMAIS un
  module déjà au programme (`already: true`) : son `hint` renvoie ici.
- **Retirer** un cran : `skoole_step_remove { program, step }` (ou `module`).
  Le cran part à la CORBEILLE de Skoole avec ce qui en dépend (avancement,
  séances), le MODULE RESTE en bibliothèque. Un cran ouvert se ferme en
  partant (`wasOpen`) ; un questionnaire posé seul se ferme à la classe avec
  lui (`questionnaireClosed`), sauf si un autre cran le porte. La réponse rend
  `rank` (la place qu'il occupait) et `remaining`.
- ⚠️ **Le retrait REFUSE** (409) si des élèves de la classe ont travaillé sur
  ses contenus (`studentWork` : copies, tentatives, réponses, parties) ou si
  la classe y a avancé (`progress` : statut, séances, coches). **Il n'y a pas
  de `force`** (il est refusé s'il est envoyé) : rapporter au formateur, qui
  retire lui-même dans Skoole s'il le veut.
- Trois gestes à ne pas confondre : `skoole_step_remove` sort un cran du
  programme, `skoole_detach` sort une brique d'un module, `skoole_delete`
  supprime une brique de la bibliothèque.

**Pour composer, lis d'abord** : `skoole_library` dit ce qui existe,
`skoole_brick` dit ce qu'il y a dedans. Une brique déjà en bibliothèque se
range telle quelle, elle ne se réécrit pas. Le détail pas à pas est dans la
compétence `skoole-composer`.

## Le fil de la séance : zones, ancres, numéros

**Le déroulé écrit n'existe plus** depuis le 22 septembre 2026 :
`skoole_deroule { markdown }` est refusé. Le FIL de la séance le remplace,
dans la page du module comme dans le programme : la suite des slides, avec
sous chaque slide les pièces qui y sont accrochées.

**La zone**, posée par `skoole_attach { zone }`, dit où la pièce se range :

- `a_classer` : le défaut. Ce qui est à classer **ne part jamais chez les
  élèves**, même dans une étape ouverte : la pièce attend le formateur.
- `avant` (ce qui ouvre la séance), `apres` (ce qui la ferme),
  `disposition` (consultable, jamais une étape).
- `formateur` : pour lui seul, jamais montrée aux élèves. Y ranger
  DIRECTEMENT un récapitulatif nominatif, un corrigé, une grille ; un
  document versé avec `visibility: "formateur"` y tombe de lui-même.
- Un QCM de positionnement sans zone ouvre ET ferme la séance (relu
  `zone: avant` avec `alsoAfter: true`). Ne lui mettre `avant` ou `apres` que
  s'il ne doit être que d'un côté.

**L'ancre** est la voie du fil. `zone: "fil"` est refusé : une pièce entre
dans le fil en s'accrochant à une slide.

```
skoole_deroule { module: "mod-…", anchors: [
    { item: "itm-…", presentation: "prs-…", slide: "7.html" }
] }
```

- `item` est l'identifiant du RANGEMENT (`contents[].id` de `skoole_module`),
  jamais celui de la brique. **Une slide se désigne par son FICHIER**, jamais
  par son numéro, qui se recalcule quand une slide s'insère avant.
- Poser une ancre sur une pièce à classer la fait entrer dans le fil (relue
  `zone: fil`, `zoneSource: posee`). Skoole la ferme d'abord aux élèves dans
  chaque cran : c'est le formateur qui l'ouvre. Un QCM de positionnement
  reste aux deux bouts, une brique réservée au formateur reste `formateur`, et
  les zones `avant`, `apres`, `disposition`, `formateur` ne bougent jamais.
- ⚠️ **N'ancre une pièce à classer que si tu l'as versée toi-même, ou si le
  formateur le demande** : une pièce qu'il a ajoutée à l'écran sans la ranger
  attend SA décision.
- `presentation` et `slide` à `null` détachent l'ancre. Une pièce déjà sortie
  d'« à classer » ne le redevient pas : elle passe à disposition (ou à la
  place que sa nature lui donne), sans le filet d'« à classer », et le
  prochain « Tout ouvrir » du formateur l'ouvrira aux élèves.
- `suggested`, dans la réponse, propose des ancres pour les pièces dont le
  titre est exactement celui d'une slide. **Rien n'y est posé** : relire,
  puis renvoyer dans `anchors` celles qu'on retient.

**Le numéro d'ordre** (`numeros: [{ item, numero }]`, de 1 à 999, `null`
pour l'effacer) range la vue du formateur dans le programme de sa classe, et
là seulement : les élèves suivent l'ordre du module. Sous une même slide, le
rang que le formateur pose au glisser (`rangSousLaSlide`) passe devant, et
poser des numéros sur les pièces de cette slide l'efface : ne pas renuméroter
une slide qu'il vient de ranger sans le lui dire.

**Appelé avec `module` seul**, `skoole_deroule` rend les slides de chaque
présentation (fichier, numéro, titre), les pièces avec leur `zone`, leur
`zoneSource` (`posee`, `nature` ou `deduite`), leur numéro et leur ancre.
C'est la seule source des fichiers de slides. Ce qui reste à ranger : les
pièces `zoneSource: deduite` et celles en `a_classer`. **Relire sa réponse**
après chaque écriture : c'est là qu'on vérifie son propre travail.

Un contenu ajouté à un module déjà programmé arrive FERMÉ dans chaque cran
qui le porte. Le fil est **formateur de bout en bout** : l'étudiant ne le voit
jamais.

## Corriger ce qui existe

**Une brique : même identifiant, mise à jour.** Renvoyée par `skoole_import`
avec le même `Identifiant :` (QCM, questionnaire, exercice, cours, jeu) ou le
même `id` de `course.json` (présentation), elle **remplace celle qui
existe**, sans en créer une nouvelle :

- tant qu'aucun élève ne l'a passée, elle est réécrite **en place** : même
  identifiant Skoole, mêmes rangements dans les modules (`updated: true`) ;
- si des élèves sont passés, une **version neuve** prend l'identifiant, et
  l'ancienne garde ses résultats et ses rangements (`previousId`) : range la
  nouvelle, et dis au formateur qu'il peut retirer l'ancienne à l'écran ;
- un cours, une présentation ou un lot de jeux se remplacent toujours en
  place : rien n'y est noté.

Donc : **toujours un `Identifiant :` stable**, en minuscules et tirets, dans
chaque brique ; et pour corriger, on renvoie sous le même, jamais sous un
nouveau.

**Un document** (un récapitulatif, un corrigé, une fiche : du texte que le
formateur lit, pas un cours) ne se distingue pas d'un cours par son contenu.
Le dire : `skoole_import { markdown, kind: "document" }`, avec
`visibility: "formateur"` s'il ne doit JAMAIS atteindre un élève. Il revient
en `element`, le `kind` à donner à `skoole_attach`. Renvoyé sous le même
`Identifiant :`, il est mis à jour en place et garde sa visibilité.

**Un module** : `skoole_module_update { module, title }` corrige le titre sans
toucher au reste. `description: ""` efface la description. `tags` est la
liste ENTIÈRE et remplace celles qui sont posées ; pour ajouter ou retirer UNE
étiquette, `skoole_tag { kind: "module" }`. **Ne jamais créer un second module
pour corriger le premier.** La réponse rend le module relu et `written`, les
champs écrits.

## Les Pages (le coffre)

Un **site web complet** (un faux site d'entreprise à auditer, une page de
démonstration, un mini-outil en HTML et JavaScript) ne va **jamais** dans une
slide ni dans une brique : il va dans les **Pages** du formateur.

1. `skoole_coffre { action: "list" }` d'abord : il dit si les Pages sont
   ouvertes sur ce compte, et quels sites existent déjà. Un site qui existe
   se REMPLACE, il ne se double pas.
2. `skoole_upload {}`, puis pousser le ZIP par un `PUT` (`index.html` à la
   racine, avec ses images, CSS et scripts).
3. `skoole_coffre { action: "publish", upload, name }` pour un site neuf, ou
   `{ action: "publish", upload, site }` pour remplacer un site : le lien ne
   change pas.

Le site est servi à **sa propre adresse**, `https://<nom>-<5 caractères>.skoole.page`,
jamais sur skoole.app : ses scripts y sont permis et n'atteignent rien de
Skoole. Les moteurs de recherche ne l'indexent pas. **Le nom devient
l'adresse** : jamais le nom d'une école ni celui d'un élève. Relire les
`remarks` (scripts, liens externes, formulaire qui envoie ailleurs).

**Pour que l'élève le trouve** : chaque site publié est aussi un outil de
nature « site ». Le rattacher à l'exercice par
`skoole_outils { brick, add: ["<tool>"] }`, l'identifiant `tool` étant rendu
par `list`. L'élève le trouve dans l'onglet **« Ressources »** de l'exercice,
affiché **« Page »**, et il l'ouvre dans un nouvel onglet. On peut aussi
coller le lien dans une consigne ou un corrigé.

`withdraw` retire un site (son lien affiche « Ce site n'est plus en ligne »),
`restore` le remet au même lien, `rename` change le nom affiché, jamais
l'adresse. Les Pages s'ouvrent **compte par compte** : fermées, `list` le dit
et rien ne se publie ; le formateur le demande à l'équipe Skoole.

En écrivant le site : chaque site est chez lui à la racine de son adresse
(`/css/style.css` marche), ses ressources vont DANS le ZIP plutôt que d'être
chargées d'ailleurs, et ses fichiers se nomment sans espaces ni accents.

## Lire les copies, et proposer la correction

Quatre outils, du plus large au plus précis : `skoole_class_progress` dit où
en est la classe et ne rend aucune copie ; `skoole_results` descend dans UN
contenu ; `skoole_submission` ouvre UNE copie (son texte, le retour rendu
`retourFormateur` avec sa `note` et son `level`, la correction proposée
`correctionProposee`, et ses fichiers par une adresse signée, valable
quelques minutes, à télécharger soi-même) ; `skoole_correction` propose.

**Une copie d'ÉQUIPE se lit entière** (depuis la 1.9.2), quel que soit le
membre demandé : `texte` porte la copie de l'équipe, chaque part sous le nom
de son auteur (le responsable d'abord, « Rien d'écrit » pour une part vide),
et `equipe` donne son libellé et ses membres (`null` pour une copie rendue
seule). Les fichiers restent ceux de l'élève demandé.

```
skoole_correction { exercise: "ex-…", corrections: [
    { student: "<identifiant rendu par skoole_results>",
      markdown: "Ce qui tient. Ce qui est à reprendre. Une piste.",
      note: 14.5,
      level: "en_cours" }
] }
```

- **Une correction proposée n'est PAS visible de l'élève.** Le formateur la
  lit sous la copie, dans la vue de travail de l'exercice, puis la rend telle
  quelle ou retouchée : son geste, et lui seul, la fait passer chez l'élève.
  C'est une proposition, le formateur reste celui qui corrige.
- `note` est facultative, de 0 à 20, jamais pour un exercice non noté.
- `level`, le NIVEAU D'ACQUISITION, est facultatif aussi (`acquis`,
  `en_cours`, `non_acquis`) : une autre façon d'évaluer que la note, ou en
  plus d'elle. Il part chez l'élève avec la correction, en badge.
- Un exercice qui a un BARÈME (`skoole_brick`, `content.scale`) se corrige
  critère par critère, avec les points ; plus fourni quand il est noté.
  Une correction ne se pose que sur une copie `remis` ou `corrige`.
- **Les SEUILS du barème** (depuis la 1.9.2) : quand le barème porte une
  ligne `Seuils : …` (son écriture est dans `skoole-exercice`), la réponse
  rend en tête `thresholds` (les seuils compris : `acquis`, `en_cours`,
  `outOf`, `line` ; ou `error` si la ligne ne se lit pas), puis, pour chaque
  copie de `written`, `levelFromScale` : le niveau que donnent ta note et les
  seuils (`null` sans note). Si ton `level` s'en écarte, `levelGap` le
  signale. **Signalé, jamais imposé** : ton `level` est posé tel quel. Un
  écart se justifie dans la correction (un critère éliminatoire manqué, une
  copie juste sur le fond et mal rendue). Ta note reste sur 20 ; elle est
  ramenée au total sur lequel les seuils s'écrivent. Sans ligne `Seuils`,
  rien de tout cela : aucun seuil par défaut, le niveau reste ton jugement
  d'ensemble.
- Une nouvelle proposition remplace la précédente et redevient « à rendre ».
  Relire `written` et `ignored`. Pour savoir si elle a été rendue :
  `skoole_submission` (`rendueLe`).
- Chez l'élève, une copie corrigée s'ouvre sur l'onglet **« Tout »** :
  l'énoncé, sa copie et la correction à la suite. La correction s'écrit donc
  pour se lire après sa copie.

**LE RAPPORT D'ENSEMBLE** (depuis la 1.9.1) : à chaque passe de corrections,
envoie AUSSI le topo de la classe sur cet exercice. Le formateur le lit EN
PREMIER, tout en haut de la liste des copies (« Vue d'ensemble de la
classe »), avant le détail, parfois à la place du détail.

```
skoole_correction { exercise: "ex-…", class: "<identifiant de classe, skoole_me>",
  corrections: [ … ],
  report: "## Niveau de la classe\n…\n## En difficulté\n…\n## Erreurs qui reviennent\n…\n## À reprendre en classe\n…" }
```

- **Court et utile** : le niveau général en deux lignes, les élèves en
  difficulté NOMMÉS (et pourquoi), les erreurs qui reviennent, ce qui est
  réussi, ce qu'il faut reprendre en classe.
- **Skoole affiche à côté son propre bilan chiffré** (niveaux d'acquisition,
  moyenne) : ne le recompte pas, commente-le.
- **Un rapport par exercice et par classe**, réservé au formateur, jamais vu
  des élèves. **Le dernier envoyé REMPLACE le précédent** : après une
  nouvelle passe (copies rendues en retard, corrections reprises), renvoie un
  rapport À JOUR et ENTIER, pas un complément.
- `corrections` peut être vide ou absent : on met à jour le rapport seul.
  `class` est obligatoire avec `report`. Relire la réponse : `report`
  (`updatedAt`, `unchanged`) ou son `error`.
- Le relire avant de le réécrire : `skoole_results { kind: "exercise", id,
  class }` le rend sous `report`.

Trois choses à savoir avant de s'en servir :

- **Un questionnaire ANONYME rend ses réponses sans nom**, comme à l'écran.
  Ce n'est pas un défaut à contourner : c'est ce que la classe a reçu comme
  promesse.
- **Ce sont des données personnelles d'étudiants.** Elles entrent dans le
  contexte de l'agent parce que le formateur l'a demandé pour SON compte ; on
  ne les recopie pas ailleurs, et on ne les emporte pas hors de la demande.
- **L'autorisation est revérifiée à chaque appel** : une classe qu'on ne
  tient plus cesse d'être lisible le jour même, jeton valide ou non.

## Les notes de slide

Des notes riches, en markdown hiérarchisé, attachées à UNE slide : ce qu'il y a
à dire, les exemples, les questions à poser. Le formateur les lit et les
modifie dans un volet à droite du fil, dans son module comme dans le programme
d'une classe, avant le cours et pendant. **Les élèves ne les voient jamais.**

- **Elles sont À PART des notes présentateur de ton deck.** Renvoyer la
  présentation par `skoole_import` ne les touche pas : le formateur y écrit
  aussi à la main, et tu n'écraserais rien.
- **Une slide se désigne par son FICHIER (« 7.html »), jamais par son
  numéro.**
- **Lire** : `skoole_slide_notes { module }` (toutes ses présentations) ou
  `{ presentation }`. Chaque slide revient avec son numéro, son fichier, son
  titre, sa note, et qui l'a écrite en dernier (`updatedVia` : `ecran` pour le
  formateur, `connecteur` pour un agent).
- **Voir ce que le formateur a changé** : ajoute `since` (la date de ton
  dernier passage). `changes` rend chaque version depuis, AVANT et APRÈS, 500
  au plus (les plus récentes, `truncated: true` au-delà). Lis-les avant de
  réécrire. Une lecture qui échoue fait échouer l'appel : ne jamais en
  conclure « rien n'a changé ».
- **En léger** : `withContent: false` ne rend aucun texte de note, seulement
  sa longueur (`notesLength`), sa date et qui l'a écrite ; de quoi savoir QUOI
  relire sur trente notes sans tout recevoir.
- **Écrire** : `{ presentation, notes: [{ slide: "7.html", markdown }] }`.
  La note entière est remplacée ; une note identique n'est pas réécrite ;
  `written` et `ignored` disent ce qui s'est passé.

## Ce que voit l'élève, et les mots d'une consigne

Une consigne, un corrigé ou une correction écrits par l'agent parlent de
l'écran de l'élève tel qu'il est :

- Il entre dans un exercice par **« Faire l'exercice »**, puis **« Continuer
  l'exercice »** tant qu'il n'a pas rendu.
- Il rédige ET dépose ses fichiers dans le **plein écran de l'exercice**, sous
  l'éditeur. Il n'y a plus de réponse en bas de la page.
- Ce qui est rattaché à l'exercice (outils, calculs, pages) est dans l'onglet
  **« Ressources »** ; une page du formateur s'y affiche **« Page »**.
- Après la correction, sa copie s'ouvre sur **« Tout »**.

Donc jamais « en bas de la page », « Ce qu'il te faut » ni « Reprendre » : ces
mots-là ne sont plus à l'écran.

## Côté formateur, en passant

- La vue de travail d'un exercice a un onglet **« Ressources »**, modifiable en
  Mode édition, et la consigne peut rester à côté pendant qu'il corrige.
- Dans le lecteur de slides, à la souris, seuls les **bords** de la slide
  naviguent (le bord droit avance, le gauche recule, le milieu ne fait rien),
  et un appui maintenu montre un **point rouge**, le laser.

## Les équipes d'un exercice, en séance

Sur un exercice EN ÉQUIPE, le formateur peut te demander en séance de former
les équipes : les étudiants les trouvent en ouvrant l'exercice, et le PREMIER
nommé de chaque équipe en est le chef (lui seul rend la copie ; le formateur le
change à l'écran). `exercise` vient de `skoole_module`, `class` de `skoole_me`.

1. `skoole_teams { exercise, class }` : LIRE. `teams` (chaque équipe : `team`,
   `label` « Équipe 3 », `name`, `chief`, `frozen` si elle a déjà rendu une
   fois, `members` avec le `status` de leur part) et `withoutTeam` (les
   étudiants encore à placer : sans équipe et sans copie rendue).
2. Une SEULE écriture par appel, puis la lecture à jour revient : relis-la.
   - `shuffle: { size: 2 | 3 | 4, present?: [...] }` TIRE AU SORT parmi les
     présents (sans `present`, tous les étudiants à placer) ; le reste se
     répartit, jamais une équipe d'un seul (13 en binômes : cinq binômes et un
     trio). Un présent déjà en équipe ou qui a rendu seul revient dans
     `skipped`. Demande au formateur QUI EST ABSENT avant de tirer.
   - `teams: [[a, b], [c, d, e]]` POSE les équipes qu'il dicte, deux à huit
     par équipe ; un seul étudiant déjà en équipe, qui a rendu seul ou hors de
     la classe, et tout l'appel est refusé.
   - `add: { team, student }` AJOUTE un retardataire à une équipe, même si
     elle a déjà rendu : sa part arrive alors « Rendu » avec elle.

Les équipes déjà faites RESTENT : rien ne les défait ni ne les remélange. Aucun
texte de copie ne sort par cet outil (`skoole_submission` les lit une à une).

## La salle en direct

Dans un amphi, le formateur lance un questionnaire dans sa SALLE (les étudiants
entrent par un code, sans compte). Le connecteur LIT ce que la salle répond,
pour réagir pendant la séance : une synthèse projetée, une playlist choisie par
la salle, une analyse à chaud.

1. `skoole_rooms` : retrouver la salle (son nom, sa date) et son identifiant.
2. `skoole_room_results { room }` : la question que la salle voit en ce moment
   (`current`), les décomptes et les textes libres. Les totaux portent toujours
   sur TOUTES les réponses.
3. Pour relire, `skoole_room_results { room, since: <asOf précédent> }` : seuls
   les textes arrivés depuis. Un même texte (même `text`, même `at`) peut
   revenir une fois : ne le compte pas deux fois. Si `textBudget.truncated`,
   reprendre à `continueSince`.

**Préparer le fil de la séance** : `skoole_room_deroule { room, steps }`
remplace le fil entier, dans l'ordre de la séance. Une étape :
`{ kind: "questionnaire" | "quiz" | "game" | "message" | "note" | "card", id?, phase?,
text?, presentation?, slide?, placed? }` ; `id` est celui du contenu (un de SES
contenus), `phase` vaut `entree`, `sortie` ou `libre` (défaut) pour un QCM,
`text` porte le message affiché aux étudiants ou la note « à dire » (que le
formateur seul voit, jamais le mur), `presentation` et `slide` (« 7.html » ou un
numéro) ANCRENT l'étape à une slide : quand le formateur y arrive, l'étape
s'allume au pupitre, et il clique « Lancer ». Rien ne se lance seul. Une étape
fausse fait refuser tout l'appel, l'ancien fil reste : relis la réponse.
**La CARTE par groupe** (`kind: "card"`, le markdown dans `text`, 12 000
caractères au plus) : chaque participant reçoit sur son écran la VERSION de son
groupe (celui qu'il a choisi à l'entrée de la salle), avec des blocs à copier.
```
# Titre de l'atelier

## En boutique : l'avis à une étoile
Groupes : BTS MCO 2

**La situation.** Deux ou trois lignes.

### Demande 1 · la demande nue (2 min)
> Le texte à copier, une ou plusieurs lignes « > ».
```
`##` ouvre une version, `Groupes :` la lie aux entrées EXACTES de la liste de la
salle (séparées par « ; »), `###` titre le bloc qui suit, un bloc `>` est à
copier. 6 versions, 8 blocs par version, 1 500 caractères par bloc. Lis les
`warnings` de la réponse : un groupe qui ne correspond à aucune entrée, une
version sans groupe, une entrée sans version (ceux-là choisiront eux-mêmes).
Au pupitre : « Montrer la carte », « Retirer la carte » ; le mur garde la slide.

Relis le fil sans `steps` avant de le réécrire : les coches du formateur s'y
lisent (`done`).

Aucun nom ne sort, jamais : ne cherche pas qui a écrit quoi. Le connecteur
n'écrit rien dans une salle : lancer, passer à la question suivante, fermer,
c'est le formateur, au pupitre.

## Ce que le connecteur ne fait pas

- **Aucun fichier, sauf deux zips** par `skoole_upload` : une présentation
  (puis `skoole_import { upload }`, voir `skoole-composer`) et un site des
  Pages (puis `skoole_coffre` `publish`). Une annexe, un PDF, une image se
  déposent dans Skoole par le formateur. Un exercice qui déclare
  « Annexe : x.xlsx » est versé avec son annexe ATTENDUE, pas avec le fichier.
- **Rien dans la copie d'un étudiant.** Il lit les copies et propose une
  correction ; seul le formateur la rend.
- **Rien d'ouvert aux élèves sans le formateur.** Un module posé arrive
  fermé, et `open: true` ne part que sur sa demande.
- **Aucun archivage** : il se fait dans Skoole. La suppression existe
  (`skoole_delete`), mais elle refuse quand des étudiants ont travaillé sur la
  brique, et `force` ne se met que sur la demande explicite du formateur.
- **Aucun retrait d'un cran sur lequel la classe a travaillé ou avancé** :
  `skoole_step_remove` refuse, sans `force`, et c'est le formateur qui
  retire dans Skoole.
- **Rien d'un collègue dans un programme** : on ne pose que ses propres
  modules et contenus.
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
`skoole-cours` (et le mouvement dans les slides), `skoole-qcm`,
`skoole-questionnaire`, `skoole-exercice`, `skoole-jeux`. Et
`skoole-composer` pour l'enchaînement complet.

Version de format connue de ce plugin : **2026-09-16**.
