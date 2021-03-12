import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    const response = await authenticateUser.execute({
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toMatchObject(user);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    await expect(
      authenticateUser.execute({
        email: 'diego@rocketseat.com.br',
        password: 'passwrod',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'diego@rocketseat.com.br',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
