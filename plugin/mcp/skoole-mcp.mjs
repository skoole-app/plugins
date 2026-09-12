#!/usr/bin/env node
/**
 * Le connecteur Skoole, en serveur MCP.
 *
 * Il ne contient AUCUNE règle : il traduit les outils que Claude appelle en
 * appels HTTP au connecteur de Skoole, qui décide de tout (ce que le jeton
 * autorise, ce que le formateur a le droit de lire). Ce fichier est public ;
 * il ne porte donc ni secret, ni adresse interne.
 *
 * Le jeton se donne par la variable d'environnement `SKOOLE_TOKEN`, jamais
 * dans un fichier du dépôt. On le crée dans Skoole : Mon compte, Connecteur.
 *
 * Écrit sans aucune dépendance, volontairement : un plugin qu'un formateur
 * installe ne doit pas tirer un arbre de paquets pour parler à quatre routes.
 * Le protocole tient en trois méthodes (initialize, tools/list, tools/call),
 * en JSON-RPC 2.0, une ligne par message sur l'entrée et la sortie standard.
 */

const BASE = process.env.SKOOLE_URL ?? 'https://skoole.app'
const JETON = process.env.SKOOLE_TOKEN ?? ''
const VERSION = '0.1.0'

/** Les outils, dans l'ordre où un formateur les découvre. */
const OUTILS = [
  {
    name: 'skoole_moi',
    description:
      "Qui je suis dans Skoole : mon compte, mes établissements, MES CLASSES avec leur identifiant, ce que mon jeton autorise, et la version de format attendue. À appeler en premier : les identifiants de classes viennent de là.",
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    chemin: () => '/api/mcp/moi',
  },
  {
    name: 'skoole_bibliotheque',
    description:
      "Chercher dans MA bibliothèque de briques pédagogiques (présentations, cours, QCM, questionnaires, exercices, jeux, éléments). Même recherche que l'écran de Skoole : les mots portent sur le titre, les étiquettes et les modules.",
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Les mots cherchés. Vide : tout.' },
        type: {
          type: 'string',
          description:
            "Une nature de brique (presentation, course, quiz, questionnaire, exercise, game, element…), ou 'all'.",
        },
        module: { type: 'string', description: "Un identifiant de module, 'all' ou 'none'." },
        limite: { type: 'number', description: 'Combien de briques au plus (100 au maximum).' },
      },
      additionalProperties: false,
    },
    chemin: (a) =>
      '/api/mcp/bibliotheque?' +
      new URLSearchParams(
        Object.fromEntries(
          Object.entries({ q: a.q, type: a.type, module: a.module, limite: a.limite })
            .filter(([, v]) => v !== undefined && v !== null && v !== '')
            .map(([k, v]) => [k, String(v)]),
        ),
      ).toString(),
  },
  {
    name: 'skoole_module',
    description:
      "Le détail d'un de MES modules : son titre, sa description, et ses contenus DANS L'ORDRE, avec le temps pédagogique (comprendre, pratiquer, appliquer, évaluer) et la nature de chacun.",
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: "L'identifiant du module." } },
      required: ['id'],
      additionalProperties: false,
    },
    chemin: (a) => `/api/mcp/module?id=${encodeURIComponent(a.id ?? '')}`,
  },
  {
    name: 'skoole_programme',
    description:
      "Le programme d'une de mes classes : ses crans dans l'ordre, ce qui est ouvert aux étudiants et ce qui ne l'est pas. L'identifiant de classe se lit dans skoole_moi.",
    inputSchema: {
      type: 'object',
      properties: { classe: { type: 'string', description: "L'identifiant de la classe." } },
      required: ['classe'],
      additionalProperties: false,
    },
    chemin: (a) => `/api/mcp/programme?classe=${encodeURIComponent(a.classe ?? '')}`,
  },
  {
    name: 'skoole_verser',
    description:
      "Déposer une brique écrite en MARKDOWN dans ma bibliothèque. La nature est RECONNUE au contenu, ne la demande pas : cases à cocher = QCM, questions '###' avec 'Type :' = questionnaire, '## Énoncé' = exercice, en-tête 'Jeux :' = jeu, le reste = un cours. Ne verse pas de fichiers : une annexe se dépose dans Skoole.",
    inputSchema: {
      type: 'object',
      properties: {
        markdown: { type: 'string', description: 'La brique entière, en markdown.' },
        nom: {
          type: 'string',
          description: "Un nom de fichier, qui sert de titre de repli si le markdown n'a pas de titre.",
        },
      },
      required: ['markdown'],
      additionalProperties: false,
    },
    methode: 'POST',
    chemin: () => '/api/mcp/verser',
    corps: (a) => ({ markdown: a.markdown ?? '', nom: a.nom }),
  },
  {
    name: 'skoole_ranger',
    description:
      "Ranger une brique de ma bibliothèque dans un de MES modules, à un temps pédagogique (comprendre, pratiquer, appliquer, evaluer). Les identifiants viennent de skoole_verser, skoole_bibliotheque et skoole_module.",
    inputSchema: {
      type: 'object',
      properties: {
        module: { type: 'string', description: "L'identifiant du module." },
        brique: { type: 'string', description: "L'identifiant de la brique à ranger." },
        nature: {
          type: 'string',
          description:
            'La nature de la brique : presentation, course, quiz, questionnaire, game, exercise, element, resource.',
        },
        temps: {
          type: 'string',
          description:
            "Le temps pédagogique : comprendre, pratiquer, appliquer, evaluer. À défaut, celui qui va de soi pour la nature.",
        },
      },
      required: ['module', 'brique', 'nature'],
      additionalProperties: false,
    },
    methode: 'POST',
    chemin: () => '/api/mcp/ranger',
    corps: (a) => ({ module: a.module, brique: a.brique, nature: a.nature, temps: a.temps }),
  },
  {
    name: 'skoole_programmer',
    description:
      "Poser un de MES modules dans un cran du programme d'une classe, et l'ouvrir ou le fermer aux étudiants. L'identifiant du programme se lit dans skoole_programme : ne le devine pas, une classe peut en porter plusieurs. Un module posé arrive TOUT FERMÉ tant qu'on ne demande pas de l'ouvrir.",
    inputSchema: {
      type: 'object',
      properties: {
        programme: { type: 'string', description: "L'identifiant du programme." },
        module: { type: 'string', description: "L'identifiant du module à poser." },
        ouvrir: {
          type: 'boolean',
          description: 'true pour ouvrir aux étudiants, false pour fermer. Absent : on ne touche à rien.',
        },
      },
      required: ['programme', 'module'],
      additionalProperties: false,
    },
    methode: 'POST',
    chemin: () => '/api/mcp/programmer',
    corps: (a) => ({ programme: a.programme, module: a.module, ouvrir: a.ouvrir }),
  },
]

async function appeler(outil, args) {
  if (!JETON) {
    return {
      erreur:
        "Aucun jeton. Crée-le dans Skoole (Mon compte, Connecteur) et pose-le dans la variable d'environnement SKOOLE_TOKEN.",
    }
  }
  const parametres = args ?? {}
  const methode = outil.methode ?? 'GET'
  const entetes = { authorization: `Bearer ${JETON}`, accept: 'application/json' }
  const reponse = await fetch(BASE + outil.chemin(parametres), {
    method: methode,
    headers:
      methode === 'POST' ? { ...entetes, 'content-type': 'application/json' } : entetes,
    // Un outil d'écriture porte son corps en JSON ; une lecture n'en a pas.
    body: methode === 'POST' ? JSON.stringify(outil.corps?.(parametres) ?? {}) : undefined,
  })
  const texte = await reponse.text()
  try {
    return JSON.parse(texte)
  } catch {
    // Une réponse qui n'est pas du JSON veut presque toujours dire qu'on a
    // reçu une page HTML : mauvaise adresse, ou route non publique côté Skoole.
    return { erreur: `Réponse inattendue (${reponse.status}).` }
  }
}

function ecrire(message) {
  process.stdout.write(JSON.stringify(message) + '\n')
}

function reponse(id, resultat) {
  ecrire({ jsonrpc: '2.0', id, result: resultat })
}

function erreur(id, code, message) {
  ecrire({ jsonrpc: '2.0', id, error: { code, message } })
}

async function traiter(requete) {
  const { id, method, params } = requete

  if (method === 'initialize') {
    const demandee = params?.protocolVersion
    reponse(id, {
      protocolVersion: typeof demandee === 'string' ? demandee : '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'skoole', version: VERSION },
    })
    return
  }

  // Les notifications n'ont pas d'identifiant : on ne répond rien.
  if (id === undefined) return

  if (method === 'tools/list') {
    reponse(id, {
      tools: OUTILS.map(({ name, description, inputSchema }) => ({
        name,
        description,
        inputSchema,
      })),
    })
    return
  }

  if (method === 'tools/call') {
    const outil = OUTILS.find((o) => o.name === params?.name)
    if (!outil) {
      erreur(id, -32602, `Outil inconnu : ${params?.name}`)
      return
    }
    try {
      const donnees = await appeler(outil, params?.arguments)
      reponse(id, {
        content: [{ type: 'text', text: JSON.stringify(donnees, null, 2) }],
        isError: Boolean(donnees?.erreur),
      })
    } catch (e) {
      reponse(id, {
        content: [{ type: 'text', text: `Skoole est injoignable : ${String(e)}` }],
        isError: true,
      })
    }
    return
  }

  if (method === 'ping') {
    reponse(id, {})
    return
  }

  erreur(id, -32601, `Méthode inconnue : ${method}`)
}

let tampon = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (morceau) => {
  tampon += morceau
  let coupure
  while ((coupure = tampon.indexOf('\n')) !== -1) {
    const ligne = tampon.slice(0, coupure).trim()
    tampon = tampon.slice(coupure + 1)
    if (!ligne) continue
    let requete
    try {
      requete = JSON.parse(ligne)
    } catch {
      continue
    }
    void traiter(requete)
  }
})
