import ICreateUserDTO from '../dtos/ICreaterUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  create(data: ICreateUserDTO): Promise<User>;
  save(data: User): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
}
