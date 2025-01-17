export function getYouTubeVideoId(url: string): string {
  // Expresión regular para capturar el ID del video
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // Intentar extraer el ID del video
  const match = url?.match(regex);

  // Retornar el ID si coincide, de lo contrario null
  return match ? match[1] : null;
}
