import {
  HeroSection,
  HeroSectionProps,
  NavigationItemProps,
  ButtonItemProps,
} from '../../domain/entities/HeroSection';
import { Url } from '../../domain/value-objects/Url';
import { HeroSectionDto, NavigationItemDto, ButtonItemDto } from '../dto/AppDataDto';

export class HeroSectionMapper {
  static toDto(heroSection: HeroSection): HeroSectionDto {
    return {
      id: heroSection.id,
      title: heroSection.title,
      subtitle: heroSection.subtitle,
      paragraph: heroSection.paragraph,
      navigator: heroSection.navigator.map(item => ({
        id: item.id,
        text: item.text,
        link: item.link.value,
        isExternal: item.isExternal,
        target: item.target,
      })),
      buttons: heroSection.buttons.map(button => ({
        id: button.id,
        text: button.text,
        link: button.link.value,
        variant: button.variant,
        size: button.size,
        disabled: button.disabled,
        isEnabled: button.isEnabled(),
      })),
      coverMobile: heroSection.coverMobile,
      coverDesktop: heroSection.coverDesktop,
      hasNavigation: heroSection.hasNavigation(),
      hasButtons: heroSection.hasButtons(),
      enabledButtons: heroSection.getEnabledButtons().map(button => ({
        id: button.id,
        text: button.text,
        link: button.link.value,
        variant: button.variant,
        size: button.size,
        disabled: button.disabled,
        isEnabled: button.isEnabled(),
      })),
      hasCover: heroSection.hasCover(),
      createdAt: heroSection.createdAt.toISOString(),
      updatedAt: heroSection.updatedAt.toISOString(),
    };
  }

  static toEntity(dto: HeroSectionDto): HeroSection {
    const navigator: NavigationItemProps[] = dto.navigator.map(item => ({
      id: item.id,
      text: item.text,
      link: new Url(item.link),
      isExternal: item.isExternal,
      target: item.target as any,
    }));

    const buttons: ButtonItemProps[] = dto.buttons.map(button => ({
      id: button.id,
      text: button.text,
      link: new Url(button.link),
      variant: button.variant as any,
      size: button.size as any,
      disabled: button.disabled,
    }));

    const props: HeroSectionProps = {
      id: dto.id,
      title: dto.title,
      subtitle: dto.subtitle,
      paragraph: dto.paragraph,
      navigator,
      buttons,
      coverMobile: dto.coverMobile,
      coverDesktop: dto.coverDesktop,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };

    return new HeroSection(props);
  }
}
