import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRespository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments of a specific day', async () => {
    const appointment1 = await fakeAppointmentsRespository.create({
      provider_id: 'provider',
      user_id: 'user2',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRespository.create({
      provider_id: 'provider',
      user_id: 'user2',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
