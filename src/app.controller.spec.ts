import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get(AppController);
  });

  describe('root', () => {
    it('returns the API ping payload', () => {
      expect(appController.getStatus()).toEqual({
        status: 'ok',
        service: 'proyecto-integrador-extendido',
      });
    });
  });
});
