import crypto from "crypto";
import fetch from "node-fetch";
import https from "https";

const USERNAME = "admin";
const PASSWORD = "md284183."; // Cambia esto

const REMOTE_URL =
  "https://200.8.127.173:10445/ISAPI/AccessControl/AcsEvent?format=json";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function md5(data: string) {
  return crypto.createHash("md5").update(data).digest("hex");
}

function buildDigestHeader({
  username,
  password,
  method,
  uri,
  realm,
  nonce,
  qop,
  nc,
  cnonce,
}: {
  username: string;
  password: string;
  method: string;
  uri: string;
  realm: string;
  nonce: string;
  qop: string;
  nc: string;
  cnonce: string;
}) {
  const ha1 = md5(`${username}:${realm}:${password}`);
  const ha2 = md5(`${method}:${uri}`);
  const response = md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);

  return `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", algorithm="MD5", response="${response}", qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
}

export async function POST() {
  try {
    // Paso 1: Obtener el nonce y realm del 401
    const initial = await fetch(REMOTE_URL, {
      method: "POST",
      agent: httpsAgent,
    });

    if (initial.status !== 401) {
      return new Response(
        JSON.stringify({ error: "Se esperaba 401 para obtener Digest Auth" }),
        { status: 500 }
      );
    }

    const authHeader = initial.headers.get("www-authenticate");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No se encontró www-authenticate" }),
        { status: 500 }
      );
    }

    const realmMatch = /realm="(.*?)"/.exec(authHeader);
    const nonceMatch = /nonce="(.*?)"/.exec(authHeader);
    const qopMatch = /qop="(.*?)"/.exec(authHeader);

    if (!realmMatch || !nonceMatch || !qopMatch) {
      return new Response(
        JSON.stringify({ error: "No se pudo extraer realm, nonce o qop" }),
        { status: 500 }
      );
    }

    const realm = realmMatch[1];
    const nonce = nonceMatch[1];
    const qop = qopMatch[1];
    const nc = "00000001";
    const cnonce = crypto.randomBytes(8).toString("hex");

    const digest = buildDigestHeader({
      username: USERNAME,
      password: PASSWORD,
      method: "POST",
      uri: "ISAPI/AccessControl/AcsEvent?format=json",
      realm,
      nonce,
      qop,
      nc,
      cnonce,
    });

    // Paso 2: Hacer solicitud con autenticación Digest
    const final = await fetch(REMOTE_URL, {
      method: "POST",
      headers: {
        Authorization: digest,
        "Content-Type": "application/json",
      },
      agent: httpsAgent,
      body: JSON.stringify({
        AcsEventCond: {
          searchID: "access_today",
          searchResultPosition: 0,
          maxResults: 100,
          major: 5,
          minor: 75,
          startTime: "2025-04-30T00:00:00+00:00",
          endTime: "2025-04-30T23:59:59+00:00",
          picEnable: true,
          timeReverseOrder: true,
        },
      }),
    });
    // https://200.8.127.173:10445/LOCALS/pic/enrlFace/0/0000000001.jpg@WEB000000000367
    // https://200.8.127.173:10445/LOCALS/pic/enrlFace/0/0000000001.jpg@WEB000000000392

    const text = await final.text();

    return new Response(text, {
      status: final.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error en solicitud Digest:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
