import { EPlatform } from "@/enums/platform.enum";

export default function getPlatformUrl(platform: EPlatform): string {
  switch (platform) {
    case EPlatform.INSTAGRAM:
      return "/img/icon/instagram.png";
    case EPlatform.YOUTUBE:
      return "/img/icon/youtube.png";
    case EPlatform.BEATPORT:
      return "/img/icon/beatport.png";
    case EPlatform.SPOTIFY:
      return "/img/icon/spotify.png";
    case EPlatform.WEB:
      return "/img/icon/_.png";
    case EPlatform.SOUNDCLOUD:
      return "/img/icon/soundcloud.png";
    default:
      return "/img/icon/_.png";
  }
}
