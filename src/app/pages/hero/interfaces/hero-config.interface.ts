import { ICover } from "@/interfaces/event.interface";
import NavigatorConfig from "./navigator-config.interface";

export default interface IHeroConfig {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  paragraph: string;
  navigator: NavigatorConfig;
  button: Button;
  cover_mobile: ICover;
  cover_desktop: ICover;
}

interface Button {
  id: number;
  text: string;
  link: string;
}
