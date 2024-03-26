import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class UidService {
  generateUid(length?: number) {
    return nanoid(length);
  }
}
