const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);

function normalizeHostname(hostname?: string | null) {
  return hostname?.replace(/^\[|\]$/g, "").toLowerCase();
}

function isLocalHostname(hostname?: string | null) {
  const normalizedHostname = normalizeHostname(hostname);

  return Boolean(normalizedHostname && localHostnames.has(normalizedHostname));
}

function isPrivateDevelopmentHostname(hostname?: string | null) {
  const normalizedHostname = normalizeHostname(hostname);

  if (!normalizedHostname) {
    return false;
  }

  return (
    localHostnames.has(normalizedHostname) ||
    /^10\./.test(normalizedHostname) ||
    /^192\.168\./.test(normalizedHostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalizedHostname)
  );
}

function shouldUseRuntimeHostname(
  configuredHostname: string,
  runtimeHostname?: string | null
) {
  const normalizedRuntimeHostname = normalizeHostname(runtimeHostname);

  return (
    process.env.NODE_ENV !== "production" &&
    Boolean(normalizedRuntimeHostname) &&
    normalizeHostname(configuredHostname) !== normalizedRuntimeHostname &&
    (isLocalHostname(configuredHostname) ||
      isLocalHostname(normalizedRuntimeHostname)) &&
    isPrivateDevelopmentHostname(configuredHostname) &&
    isPrivateDevelopmentHostname(normalizedRuntimeHostname)
  );
}

export function getHostnameFromHostHeader(hostHeader?: string | null) {
  if (!hostHeader) {
    return undefined;
  }

  try {
    return new URL(`http://${hostHeader}`).hostname;
  } catch {
    return hostHeader.split(":")[0];
  }
}

export function resolveApiBaseUrl(runtimeHostname?: string | null) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!configuredBaseUrl) {
    return undefined;
  }

  try {
    const url = new URL(configuredBaseUrl);

    if (shouldUseRuntimeHostname(url.hostname, runtimeHostname)) {
      url.hostname = normalizeHostname(runtimeHostname) as string;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return configuredBaseUrl;
  }
}

export function resolveBrowserApiBaseUrl() {
  return resolveApiBaseUrl(
    typeof window === "undefined" ? undefined : window.location.hostname
  );
}

export function resolveRequestApiBaseUrl(requestUrl: string) {
  try {
    return resolveApiBaseUrl(new URL(requestUrl).hostname);
  } catch {
    return resolveApiBaseUrl();
  }
}