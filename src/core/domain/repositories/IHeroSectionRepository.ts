import { HeroSection } from '../entities/HeroSection';

export interface IHeroSectionRepository {
  findCurrent(): Promise<HeroSection | null>;
  findById(id: number): Promise<HeroSection | null>;
  save(heroSection: HeroSection): Promise<HeroSection>;
  exists(id: number): Promise<boolean>;
}