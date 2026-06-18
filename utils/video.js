export function normalizeVideoUrl(rawUrl) {
  if (!rawUrl) return null;
  const value = rawUrl.trim();
  if (!value) return null;

  if (value.startsWith("blob:")) {
    return { kind: "file", src: value };
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return { kind: "link", src: value };
  }

  const host = url.hostname.replace(/^www\./, "");
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be" && pathParts[0]) {
    return { kind: "embed", src: `https://www.youtube.com/embed/${pathParts[0]}` };
  }

  if (host.includes("youtube.com")) {
    const watchId = url.searchParams.get("v");
    const shortsIndex = pathParts.indexOf("shorts");
    const embedIndex = pathParts.indexOf("embed");
    const id = watchId || (shortsIndex >= 0 && pathParts[shortsIndex + 1]) || (embedIndex >= 0 && pathParts[embedIndex + 1]);
    if (id) return { kind: "embed", src: `https://www.youtube.com/embed/${id}` };
  }

  if (host.includes("tiktok.com")) {
    const videoIndex = pathParts.indexOf("video");
    const id = videoIndex >= 0 ? pathParts[videoIndex + 1] : null;
    if (id) return { kind: "embed", src: `https://www.tiktok.com/embed/v2/${id}` };
  }

  if (host.includes("vimeo.com")) {
    const id = pathParts.find((part) => /^\d+$/.test(part));
    if (id) return { kind: "embed", src: `https://player.vimeo.com/video/${id}` };
  }

  if (host.includes("instagram.com") && pathParts.length >= 2) {
    const shortcode = pathParts[1];
    return { kind: "embed", src: `https://www.instagram.com/${pathParts[0]}/${shortcode}/embed` };
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url.pathname)) {
    return { kind: "file", src: value };
  }

  return { kind: "link", src: value };
}
