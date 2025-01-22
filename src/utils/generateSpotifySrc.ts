const generateSpotifyEmbedSrc = (url: string): string | null => {
  const embedBase = "https://open.spotify.com/embed/artist/";
  const idRegex = /\/artist\/([a-zA-Z0-9]+)/;
  const match = url.match(idRegex);

  if (match && match[1]) {
    return `${embedBase}${match[1]}?utm_source=generator`;
  } else {
    return null;
    // throw new Error("URL inválida. No se encontró un ID de artista.");
  }
};

export default generateSpotifyEmbedSrc;
