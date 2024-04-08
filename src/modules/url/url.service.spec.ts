import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { ConfigService } from '@nestjs/config';
import { UidService } from '../../services/uid/uid.service';
import { DatabaseService } from '../../database/database.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import {
  generateUrlArray,
  generateUrlPayload,
  uid,
  host,
} from '../../../test/__test__/test-utils';

describe('UrlService', () => {
  let service: UrlService;
  let databaseService: DeepMockProxy<DatabaseService>;
  let uidService: DeepMocked<UidService>;
  let configService: DeepMocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: DatabaseService, useValue: mockDeep<DatabaseService>() },
        { provide: UidService, useValue: createMock<UidService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
      ],
    }).compile();

    databaseService = module.get(DatabaseService);
    uidService = module.get(UidService);
    configService = module.get(ConfigService);

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(databaseService).toBeDefined();
    expect(uidService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new short url', async () => {
      // arrange
      const payload = generateUrlPayload({});
      uidService.generateUid.mockReturnValueOnce(uid);
      databaseService.url.create.mockResolvedValueOnce(payload);

      // Act
      const url = await service.create({
        redirect: payload.redirect,
        title: payload.title,
        ...(payload.description && { description: payload.description }),
      });

      // Assert
      expect(url).toEqual(payload);
    });

    it('should create new short url without description', async () => {
      const payload = generateUrlPayload({ description: null });
      uidService.generateUid.mockReturnValueOnce(uid);
      databaseService.url.create.mockResolvedValueOnce(payload);

      const url = await service.create({
        redirect: payload.redirect,
        title: payload.title,
      });

      expect(url).toEqual(payload);
    });
  });

  describe('findAll', () => {
    it('should return all urls', async () => {
      const response = [generateUrlPayload({})];
      databaseService.url.findMany.mockResolvedValueOnce(response);
      databaseService.url.count.mockResolvedValueOnce(response.length);

      const url = await service.findAll({});

      expect(url.data).toEqual(response);
    });

    it('should return empty array when no url exits in database', async () => {
      databaseService.url.findMany.mockResolvedValueOnce([]);
      databaseService.url.count.mockResolvedValueOnce(0);

      const url = await service.findAll({});

      expect(url.data).toEqual([]);
    });

    // should return correct meta data for first page
    it('should correctly indicated first page', async () => {
      databaseService.url.findMany.mockResolvedValueOnce(generateUrlArray());
      databaseService.url.count.mockResolvedValueOnce(9);

      const getUrlDto = {
        page: 3,
        limit: 3,
      };

      const result = await service.findAll(getUrlDto);
      expect(result.meta).toEqual({
        totalCount: 9,
        currentPage: 3,
        perPage: 3,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return respective url record', async () => {
      // arange
      const uidLookup = uid;
      const payload = generateUrlPayload({});
      databaseService.url.findUnique.mockResolvedValueOnce(
        payload.url === `${host}/${uidLookup}` ? payload : null,
      );

      // act
      const url = await service.findOne(uidLookup);

      // assert
      expect(url).toEqual(payload);
    });

    it('shoudl return null when url record not found', async () => {
      // arange
      const uidLookup = 'random uid';
      const payload = generateUrlPayload({});
      databaseService.url.findUnique.mockResolvedValueOnce(
        payload.url === `${host}/${uidLookup}` ? payload : null,
      );

      // act
      const url = await service.findOne(uidLookup);

      // assert
      expect(url).toEqual(null);
    });
  });

  describe('update', () => {
    it(' should update the url record', async () => {
      // arange
      const original = generateUrlPayload({});
      const updatePayload = {
        description: 'New description',
      };

      const payload = { ...original, ...updatePayload };
      const id = payload.id;
      databaseService.url.update.mockResolvedValueOnce(payload);

      // act
      const url = await service.update(id, updatePayload);

      // asserts
      expect(url).toEqual(payload);
    });
  });

  describe('delete', () => {
    it('should delete the url record', async () => {
      const payload = generateUrlPayload({});
      const id = payload.id;
      databaseService.url.delete.mockResolvedValueOnce(payload);

      const url = await service.remove(id);

      expect(url).toEqual(payload);
    });
  });
});
