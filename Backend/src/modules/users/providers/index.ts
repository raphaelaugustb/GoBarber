import { container } from 'tsyringe';
import BCryptHashProvider from './HashProvider/implementations/BCrypyHashProvider';
import IHashProvider from './HashProvider/models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
