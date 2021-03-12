import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 0, 1, 13),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
    expect(appointment.user_id).toBe('user_id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 12).getTime();
    });

    const appointmentDate = new Date(2020, 0, 1, 13);
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a paste date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 1, 10),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with yourself', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 1, 13),
        provider_id: 'user_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am or after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 1, 18),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 1, 7),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
