import crypto from "crypto";
import fetch from "node-fetch";
import https from "https";

const USERNAME = "admin";
const PASSWORD = "md284183."; // Cambia esto

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

export async function POST(request: Request) {
  const { remoteUrl } = await request.json();
  if (!remoteUrl) {
    return new Response(JSON.stringify({ error: "remoteUrl es requerido" }), {
      status: 400,
    });
  }
  try {
    // Paso 1: Obtener el nonce y realm del 401
    const initial = await fetch(remoteUrl, {
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
      uri: "/ISAPI/AccessControl/UserInfo/Search?format=json",
      realm,
      nonce,
      qop,
      nc,
      cnonce,
    });

    // Paso 2: Hacer solicitud con autenticación Digest
    // Paso 2: Hacer solicitud con autenticación Digest
    const final = await fetch(remoteUrl, {
      method: "POST",
      headers: {
        Authorization: digest,
      },
      agent: httpsAgent,
    });

    // Leer la respuesta como arrayBuffer y devolverla como imagen
    const buffer = await final.arrayBuffer();
    return new Response(Buffer.from(buffer), {
      status: final.status,
      headers: {
        "Content-Type": final.headers.get("content-type") || "image/jpeg",
      },
    });
  } catch (error: any) {
    console.error("Error en solicitud Digest:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
