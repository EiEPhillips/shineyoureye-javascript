import { existsSync } from 'fs';
import {
  getSlug, env,
} from 'api/helper';
import logger from 'api/logger';
import Mappings from 'api/infrastructure/mapit/mappings';

export default class Place {
  constructor(place) {
    this.place = place;
    this.baseurl = '/place/';
    // this.baseurl = (place.legislature) ? `/place/${(place.legislature).toLowerCase().trim()}/` : '/place/';
  }

  area() {
    const mappings = new Mappings(this.place).areaFromMapitId();
    return Object.freeze(mappings);
  }

  parentArea() {
    const area = this.area();
    if (area && Object.keys(area).length) {
      return new Mappings({
        legislature: this.place.legislature,
        id: area.parent_area,
      }).areaFromMapitParentId();
    }

    return null;
  }

  stateArea() {
    const mappings = new Mappings({
      legislature: 'Governors',
      name: this.place.name,
    }).areaFromMapitName();
    return mappings;
  }

  get slug() {
    const area = this.area();
    return area && Object.keys(area).length ? getSlug(area.name) : '';
  }

  thumbnailImage() {
    try {
      const placeholder = `${env.localImageThumbnailUrl}\\${this.slug}.jpg`;
      const placeholderAlt = `${env.localImageThumbnailUrl}\\${this.slug}-state.jpg`;
      if (existsSync(placeholder)) {
        return `${env.appUrl}/images/thumbnails/${this.slug}.jpg`;
      } if (existsSync(placeholderAlt)) {
        return `${env.appUrl}/images/thumbnails/${this.slug}-state.jpg`;
      }

      return `${env.appUrl}/images/place-250x250.png`;
    } catch (error) {
      logger(error);
    }
  }


  toJSON() {
    return {
      place: this.area(),
      place_url: this.slug,
      url: `${this.baseurl}${this.slug}`,
      image: {
        url: this.thumbnailImage(),
      },
      parent_place: this.parentArea(),
      state_place: this.stateArea(),
    };
  }
}