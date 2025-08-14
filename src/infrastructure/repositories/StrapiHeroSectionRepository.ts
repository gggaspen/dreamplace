import { IHeroSectionRepository } from '../../core/domain/repositories/IHeroSectionRepository';
import {
  HeroSection,
  HeroSectionProps,
  NavigationItemProps,
  ButtonItemProps,
} from '../../core/domain/entities/HeroSection';
import { Url } from '../../core/domain/value-objects/Url';
import {
  StrapiApiClient,
  StrapiCollectionResponse,
  StrapiResponse,
} from '../external/StrapiApiClient';

interface StrapiNavigationItemData {
  id: number;
  text: string;
  link: string;
  isExternal?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

interface StrapiButtonItemData {
  id: number;
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

interface StrapiHeroSectionData {
  id: number;
  attributes: {
    title: string;
    subtitle: string;
    paragraph: string;
    navigator: StrapiNavigationItemData[];
    button: StrapiButtonItemData[];
    cover_mobile: {
      data: Array<{
        id: number;
        attributes: {
          url: string;
          formats: any;
          name: string;
          alternativeText?: string;
        };
      }>;
    };
    cover_desktop: {
      data: {
        id: number;
        attributes: {
          url: string;
          formats: any;
          name: string;
          alternativeText?: string;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

export class StrapiHeroSectionRepository implements IHeroSectionRepository {
  constructor(private readonly apiClient: StrapiApiClient) {}

  async findCurrent(): Promise<HeroSection | null> {
    try {
      const response = await this.apiClient.get<StrapiCollectionResponse<StrapiHeroSectionData>>(
        'hero-sections',
        {
          'fields[1]': 'title',
          'fields[2]': 'subtitle',
          'fields[3]': 'paragraph',
          'populate[navigator][fields]': '*',
          'populate[button][fields]': '*',
          'populate[cover_mobile][fields][0]': 'url',
          'populate[cover_mobile][fields][1]': 'formats',
          'populate[cover_desktop][fields][0]': 'url',
          'populate[cover_desktop][fields][1]': 'formats',
        }
      );

      if (response.data.length === 0) {
        return null;
      }

      return this.mapToDomainEntity(response.data[0]);
    } catch (error) {
      throw new Error(
        `Failed to fetch current hero section: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findById(id: number): Promise<HeroSection | null> {
    try {
      const response = await this.apiClient.get<StrapiResponse<StrapiHeroSectionData>>(
        `hero-sections/${id}`,
        {
          'populate[navigator][fields]': '*',
          'populate[button][fields]': '*',
          'populate[cover_mobile][fields][0]': 'url',
          'populate[cover_mobile][fields][1]': 'formats',
          'populate[cover_desktop][fields][0]': 'url',
          'populate[cover_desktop][fields][1]': 'formats',
        }
      );

      return this.mapToDomainEntity(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error(
        `Failed to fetch hero section ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async save(heroSection: HeroSection): Promise<HeroSection> {
    try {
      const data = this.mapToStrapiData(heroSection);

      if (heroSection.isNew()) {
        const response = await this.apiClient.post<StrapiResponse<StrapiHeroSectionData>>(
          'hero-sections',
          { data }
        );
        return this.mapToDomainEntity(response.data);
      } else {
        const response = await this.apiClient.put<StrapiResponse<StrapiHeroSectionData>>(
          `hero-sections/${heroSection.id}`,
          { data }
        );
        return this.mapToDomainEntity(response.data);
      }
    } catch (error) {
      throw new Error(
        `Failed to save hero section: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const heroSection = await this.findById(id);
      return heroSection !== null;
    } catch (error) {
      return false;
    }
  }

  private mapToDomainEntity(strapiData: StrapiHeroSectionData): HeroSection {
    const navigator: NavigationItemProps[] =
      strapiData.attributes.navigator?.map(item => ({
        id: item.id,
        text: item.text,
        link: new Url(item.link),
        isExternal: item.isExternal,
        target: item.target,
      })) || [];

    const buttons: ButtonItemProps[] =
      strapiData.attributes.button?.map(button => ({
        id: button.id,
        text: button.text,
        link: new Url(button.link),
        variant: button.variant,
        size: button.size,
        disabled: button.disabled,
      })) || [];

    const props: HeroSectionProps = {
      id: strapiData.id,
      title: strapiData.attributes.title,
      subtitle: strapiData.attributes.subtitle,
      paragraph: strapiData.attributes.paragraph,
      navigator,
      buttons,
      coverMobile:
        strapiData.attributes.cover_mobile?.data?.map(cover => cover.attributes.url) || [],
      coverDesktop: strapiData.attributes.cover_desktop?.data?.attributes?.url || '',
      createdAt: new Date(strapiData.attributes.createdAt),
      updatedAt: new Date(strapiData.attributes.updatedAt),
    };

    return new HeroSection(props);
  }

  private mapToStrapiData(heroSection: HeroSection): any {
    return {
      title: heroSection.title,
      subtitle: heroSection.subtitle,
      paragraph: heroSection.paragraph,
      navigator: heroSection.navigator.map(item => ({
        text: item.text,
        link: item.link.value,
        isExternal: item.isExternal,
        target: item.target,
      })),
      button: heroSection.buttons.map(button => ({
        text: button.text,
        link: button.link.value,
        variant: button.variant,
        size: button.size,
        disabled: button.disabled,
      })),
    };
  }
}
