import { Controller } from '@nestjs/common';

import { SignsService } from './signs.service';

@Controller('signs')
export class SignsController {
  constructor(private readonly signsService: SignsService) {}
}
