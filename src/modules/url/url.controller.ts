import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlExistsPipe } from './pipes/url-exists/url-exists.pipe';
import { Url } from '@prisma/client';
import { Response } from 'express';
import { UpdateUrlDto } from './dto/update-url.dto';
import { FilterUrlsDto } from './dto/filter.dto';
import { AuthGuard } from '../../auth/auth.guard';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('url')
  @UseGuards(AuthGuard)
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get('url')
  @UseGuards(AuthGuard)
  findAll(@Query() queryParams: FilterUrlsDto) {
    console.log(`Query params: ${queryParams}`);
    return this.urlService.findAll(queryParams);
  }

  @Get(':uid')
  findOne(@Param('uid', UrlExistsPipe) url: Url, @Res() res: Response) {
    res.redirect(url.redirect);
  }

  @Patch('url/:uid')
  @UseGuards(AuthGuard)
  update(
    @Param('uid', UrlExistsPipe) url: Url,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    return this.urlService.update(url.id, updateUrlDto);
  }

  @Delete('url/:uid')
  @UseGuards(AuthGuard)
  remove(@Param('uid', UrlExistsPipe) url: Url) {
    return this.urlService.remove(url.id);
  }
}
