import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'jão',
      email: 'jao@rocketseat.com.br',
    });

    expect(updatedUser.name).toBe('jão');
    expect(updatedUser.email).toBe('jao@rocketseat.com.br');
    expect(updatedUser.password).toBe('password');
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'jão',
        email: 'jao@rocketseat.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email used by another user', async () => {
    await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    const user = await fakeUsersRepository.create({
      name: 'jão',
      email: 'jao@rocketseat.com.br',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'jão',
        email: 'diego@rocketseat.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      old_password: 'password',
      password: 'newPassword',
    });

    expect(updatedUser.password).toBe('newPassword');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'jão',
        email: 'jao@rocketseat.com.br',
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'jão',
        email: 'jao@rocketseat.com.br',
        old_password: 'not the old password',
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
