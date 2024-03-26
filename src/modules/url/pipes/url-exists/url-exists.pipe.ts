import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UrlService } from '../../url.service';

@Injectable()
export class UrlExistsPipe implements PipeTransform {
  constructor(private readonly urlService: UrlService) {}
  transform(value: string) {
    // find the uid (with come from url params) in the database
    const url = this.urlService.findOne(value);
    if (!url) {
      throw new NotFoundException(`Url with uid ${value} not found`);
    }
    return url;
  }
}
