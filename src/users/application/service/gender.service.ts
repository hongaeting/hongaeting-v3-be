import { Injectable } from '@nestjs/common';

import { Loggable } from '../../../commons/util/loggable';
import { Gender } from '../../domain/model/gender.entity';
import { GenderDto } from '../dto/gender.dto';
import { GenderRepository } from '../../domain/repository/gender.repository';

@Injectable()
export class GenderService extends Loggable {
  //
  constructor(private readonly genderRepository: GenderRepository) {
    super();
  }

  public async create(genderDto: GenderDto): Promise<GenderDto> {
    const gender = new Gender(genderDto.value);
    const saved = await this.genderRepository.save(gender);
    return { id: saved.getId(), value: saved.getValue() };
  }

  public async findAll(): Promise<GenderDto[]> {
    const genders = await this.genderRepository.find();
    return genders.map((gender) => ({
      id: gender.getId(),
      value: gender.getValue(),
    }));
  }
}
