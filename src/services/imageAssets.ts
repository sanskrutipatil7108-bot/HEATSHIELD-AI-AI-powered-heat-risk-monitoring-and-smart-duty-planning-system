import heroBundled from '../assets/images/hero_traffic_heat_junction_1792600965103.jpg';
import coolingBundled from '../assets/images/cooling_shelter_station_1792600963830.jpg';
import avatarBundled from '../assets/images/avatar_supervisor_officer_1792600965722.jpg';

export interface ImageAssetConfig {
  primary: string;
  fallback: string;
  legacy: string;
  bundled: string;
  alt: string;
}

export const IMAGE_ASSETS = {
  heroJunction: {
    primary: '/images/hero_traffic_heat_junction_1792600965103.jpg',
    fallback: '/images/hero_traffic_heat_junction.jpg',
    legacy: '/assets/images/hero_traffic_heat_junction_1792600965103.jpg',
    bundled: heroBundled,
    alt: 'Traffic police officer monitoring extreme midday heat junction with active thermal safety protocols'
  },
  coolingShelter: {
    primary: '/images/cooling_shelter_station_1792600963830.jpg',
    fallback: '/images/cooling_shelter_station.jpg',
    legacy: '/assets/images/cooling_shelter_station_1792600963830.jpg',
    bundled: coolingBundled,
    alt: 'Outdoor roadside misting cooling shelter and hydration relief station for traffic officers'
  },
  supervisorAvatar: {
    primary: '/images/avatar_supervisor_officer_1792600965722.jpg',
    fallback: '/images/avatar_supervisor_officer.jpg',
    legacy: '/assets/images/avatar_supervisor_officer_1792600965722.jpg',
    bundled: avatarBundled,
    alt: 'Senior Traffic Police Command Supervisor'
  }
} as const;
