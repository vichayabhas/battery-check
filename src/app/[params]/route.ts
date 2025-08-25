
const userPath='networkElement/integratedrest/http'

export async function POST(
  req: Request,
  context: Promise<{ params: Promise<{ params: string }> }> // original
) {
  try {
    // Await the params first
    const { params } = await context;
    const params2=await params
    const paramValue = params2.params; // now safe to use

    const token = req.headers.get("authorization");

    const body = await req.json().catch(() => ({}));

    const backendResponse = await fetch(
      `${getBackendUrl()}/${userPath}/${paramValue}`,
      {
        method: "POST",
        headers: {
          ...(token ? { authorization: token } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(body),
      }
    );

    const result = await backendResponse.json();

    return Response.json(result, { status: backendResponse.status });
  } catch (err) {
    console.error("API Error:", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


function getBackendUrl() {
    return('http://localhost:3002')
}

