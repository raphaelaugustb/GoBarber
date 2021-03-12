import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRespository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: 'user2',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: 'user2',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: 'user2',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 9, 59, 59).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: true },
        { hour: 11, available: false },
        { hour: 14, available: true },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: false },
      ]),
    );
  });
});
