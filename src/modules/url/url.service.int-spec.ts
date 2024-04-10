import { app } from '../../../test/setup';
import { DatabaseService } from '../../database/database.service';
import { UrlService } from './url.service';
import { createManyUrls } from '../../../test/__test__/test-utils';
import { ConfigService } from '@nestjs/config';

describe('UrlService intergration test', () => {
  let urlService: UrlService;
  let databaseService: DatabaseService;
  let configService: ConfigService;
  let host: string;

  beforeAll(async () => {
    databaseService = app.get(DatabaseService);
    urlService = app.get(UrlService);
    configService = app.get(ConfigService);
    host = configService.getOrThrow('host');
  });

  describe('create', () => {
    it('should persist and return the url', async () => {
      const payload = {
        title: 'My new link',
        redirect: 'https://www.google.com',
      };

      const url = await urlService.create(payload);
      const persistedUrl = await databaseService.url.findUnique({
        where: {
          url: url.url,
        },
      });

      expect(url).toEqual(persistedUrl);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no urls are persisted', async () => {
      const response = await urlService.findAll({});

      expect(response.data).toEqual([]);
    });

    it('should return array of persisted urls', async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });

      const url = await databaseService.url.findMany({});

      const response = await urlService.findAll({});

      expect(response.data).toEqual(url);
    });

    it('should return array of persisted urls on the first page', async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });

      const totalCount = await databaseService.url.count();
      const limit = 1;
      const page = 1;

      const response = await urlService.findAll({ limit, page });

      expect(response.meta).toEqual({
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('should paginate results and show middle page', async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });

      const totalCount = await databaseService.url.count();
      const limit = 1;
      const page = 2;

      const response = await urlService.findAll({ limit, page });

      expect(response.meta).toEqual({
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it('should paginate results and show last page', async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });

      const totalCount = await databaseService.url.count();
      const limit = 1;
      const page = 3;

      const response = await urlService.findAll({ limit, page });

      expect(response.meta).toEqual({
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return null when url does not exist', async () => {
      const url = await urlService.findOne('invalid-random-uid');

      expect(url).toBeNull();
    });

    it('should return the url when it exists', async () => {
      const uid = '123456';
      const persistedUrl = await databaseService.url.create({
        data: {
          title: 'Google',
          redirect: 'https://google.com',
          url: `${host}/${uid}`,
        },
      });

      const url = await urlService.findOne(uid);
      expect(url).toEqual(persistedUrl);
    });
  });

  describe('update', () => {
    it('shouuld update the url', async () => {
      await databaseService.url.create({
        data: {
          id: 1,
          title: 'Google',
          redirect: 'https://google.com',
          url: `${host}/123456`,
        },
      });

      const updatedUrl = await urlService.update(1, {
        title: 'updated title',
      });

      const persistedUrl = await databaseService.url.findUnique({
        where: {
          id: 1,
        },
      });

      expect(updatedUrl).toEqual(persistedUrl);
    });

    it('should throw error when url does not exist', async () => {
      const updatedUrl = urlService.update(1, {
        title: 'yahoo',
      });

      expect(updatedUrl).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove and return respective url', async () => {
      const persistedUrl = await databaseService.url.create({
        data: {
          id: 1,
          title: 'Search engine',
          redirect: 'https://www.google.com',
          url: `${host}/123456`,
        },
      });
      const url = await urlService.remove(1);
      const removedPersistedUrl = await databaseService.url.findUnique({
        where: { id: 1 },
      });

      expect(url).toEqual(persistedUrl);
      expect(removedPersistedUrl).toBeNull();
    });

    it('should throw error when url does not exist', async () => {
      const removeUrl = urlService.remove(1);

      await expect(removeUrl).rejects.toThrow();
    });
  });
});
