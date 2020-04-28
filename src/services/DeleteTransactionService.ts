import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new AppError('Not find transaction');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
