import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UrlService } from '../../url.service';

@Injectable()
export class UrlExistsPipe implements PipeTransform {
  constructor(private readonly urlService: UrlService) {}
  async transform(value: string) {
    // find the uid (with come from url params) in the database
    const url = await this.urlService.findOne(value);
    console.log(url);
    if (!url) {
      throw new NotFoundException(`URL with uid ${value} not found`);
    }
    console.log(`Url found: ${value}`);
    return url;
  }
}
