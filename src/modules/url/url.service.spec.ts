import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { ConfigService } from '@nestjs/config';
import { UidService } from '../../services/uid/uid.service';
import { DatabaseService } from '../../database/database.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

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

  describe('get', () => {
    it('should create a new short url', async () => {
      // arrange
      const host = 'https://localhost:3000';
      const uid = 'abc123';
      const payload = {
        id: 1,
        redirect: 'https://google.com',
        description: 'Google',
        title: 'Google',
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `${host}/${uid}`,
      };
      uidService.generateUid.mockReturnValueOnce(uid);
      databaseService.url.create.mockResolvedValueOnce(payload);

      // Act
      const url = await service.create({
        redirect: payload.redirect,
        description: payload.description,
        title: payload.title,
      });

      // Assert
      expect(url).toEqual(payload);
    });
  });
});
