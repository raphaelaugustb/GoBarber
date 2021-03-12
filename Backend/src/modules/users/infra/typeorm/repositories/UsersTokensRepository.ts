import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { getRepository, Repository } from 'typeorm';

import UserToken from '../entities/UserToken';

export default class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const data = this.ormRepository.create({ user_id });
    const userToken = await this.ormRepository.save(data);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }
}
