import { BaseEntity } from './BaseEntity';
import { Url } from '../value-objects/Url';

export interface NavigationItemProps {
  id: number;
  text: string;
  link: Url;
  isExternal?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export interface ButtonItemProps {
  id: number;
  text: string;
  link: Url;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export interface HeroSectionProps {
  id: number;
  title: string;
  subtitle: string;
  paragraph: string;
  navigator: NavigationItemProps[];
  buttons: ButtonItemProps[];
  coverMobile: string[];
  coverDesktop: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NavigationItem {
  public readonly id: number;
  public readonly text: string;
  public readonly link: Url;
  public readonly isExternal: boolean;
  public readonly target: string;

  constructor(props: NavigationItemProps) {
    this.id = props.id;
    this.text = this.validateText(props.text);
    this.link = props.link;
    this.isExternal = props.isExternal ?? props.link.isExternal();
    this.target = props.target ?? (this.isExternal ? '_blank' : '_self');
  }

  public equals(other: NavigationItem): boolean {
    return this.id === other.id && this.link.equals(other.link);
  }

  private validateText(text: string): string {
    if (!text || text.trim().length === 0) {
      throw new Error('Navigation item text cannot be empty');
    }
    return text.trim();
  }
}

export class ButtonItem {
  public readonly id: number;
  public readonly text: string;
  public readonly link: Url;
  public readonly variant: string;
  public readonly size: string;
  public readonly disabled: boolean;

  constructor(props: ButtonItemProps) {
    this.id = props.id;
    this.text = this.validateText(props.text);
    this.link = props.link;
    this.variant = props.variant ?? 'primary';
    this.size = props.size ?? 'md';
    this.disabled = props.disabled ?? false;
  }

  public isEnabled(): boolean {
    return !this.disabled;
  }

  public equals(other: ButtonItem): boolean {
    return this.id === other.id && this.link.equals(other.link);
  }

  private validateText(text: string): string {
    if (!text || text.trim().length === 0) {
      throw new Error('Button text cannot be empty');
    }
    return text.trim();
  }
}

export class HeroSection extends BaseEntity {
  private readonly _title: string;
  private readonly _subtitle: string;
  private readonly _paragraph: string;
  private readonly _navigator: NavigationItem[];
  private readonly _buttons: ButtonItem[];
  private readonly _coverMobile: string[];
  private readonly _coverDesktop: string;

  constructor(props: HeroSectionProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this._title = this.validateTitle(props.title);
    this._subtitle = props.subtitle;
    this._paragraph = props.paragraph;
    this._navigator = props.navigator.map(item => new NavigationItem(item));
    this._buttons = props.buttons.map(button => new ButtonItem(button));
    this._coverMobile = props.coverMobile || [];
    this._coverDesktop = props.coverDesktop;
  }

  get title(): string {
    return this._title;
  }

  get subtitle(): string {
    return this._subtitle;
  }

  get paragraph(): string {
    return this._paragraph;
  }

  get navigator(): NavigationItem[] {
    return [...this._navigator];
  }

  get buttons(): ButtonItem[] {
    return [...this._buttons];
  }

  get coverMobile(): string[] {
    return [...this._coverMobile];
  }

  get coverDesktop(): string {
    return this._coverDesktop;
  }

  public hasNavigation(): boolean {
    return this._navigator.length > 0;
  }

  public hasButtons(): boolean {
    return this._buttons.length > 0;
  }

  public getEnabledButtons(): ButtonItem[] {
    return this._buttons.filter(button => button.isEnabled());
  }

  public hasCover(): boolean {
    return this._coverMobile.length > 0 || !!this._coverDesktop;
  }

  private validateTitle(title: string): string {
    if (!title || title.trim().length === 0) {
      throw new Error('Hero title cannot be empty');
    }
    if (title.length > 100) {
      throw new Error('Hero title cannot exceed 100 characters');
    }
    return title.trim();
  }
}
