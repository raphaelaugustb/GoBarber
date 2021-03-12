import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createAppointmentRepository = container.resolve(
      CreateAppointmentService,
    );

    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const appointment = await createAppointmentRepository.execute({
      user_id,
      provider_id,
      date,
    });

    return response.json(appointment);
  }
}
