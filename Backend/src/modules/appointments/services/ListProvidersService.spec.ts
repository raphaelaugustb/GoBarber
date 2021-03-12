import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListAllProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listAllProviders: ListAllProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('listProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listAllProviders = new ListAllProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to show the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'diego',
      email: 'diego@rocketseat.com.br',
      password: 'password',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'diego3',
      email: 'diego3@rocketseat.com.br',
      password: 'password',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'diego4',
      email: 'diego4@rocketseat.com.br',
      password: 'password',
    });

    const providers = await listAllProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
