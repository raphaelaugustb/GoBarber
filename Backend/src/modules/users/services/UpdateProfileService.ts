import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id)
      throw new AppError('E-mail already in use');

    if (password && !old_password)
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );

    if (password && old_password) {
      const passwordMatch = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!passwordMatch)
        throw new AppError('The old password does not match.');
    }

    Object.assign(user, {
      name,
      email,
      password: password
        ? await this.hashProvider.generateHash(password)
        : user.password,
    });

    await this.usersRepository.save(user);

    return user;
  }
}
