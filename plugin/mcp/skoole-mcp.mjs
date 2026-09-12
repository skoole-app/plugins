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
]

async function appeler(outil, args) {
  if (!JETON) {
    return {
      erreur:
        "Aucun jeton. Crée-le dans Skoole (Mon compte, Connecteur) et pose-le dans la variable d'environnement SKOOLE_TOKEN.",
    }
  }
  const reponse = await fetch(BASE + outil.chemin(args ?? {}), {
    headers: { authorization: `Bearer ${JETON}`, accept: 'application/json' },
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
