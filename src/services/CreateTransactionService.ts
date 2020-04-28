import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  category: string;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute({ title, value, category, type }: Request) {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepositories = getCustomRepository(CategoriesRepository);
    const balance = await transactionsRepository.getBalance();
    const categoryFind = await categoriesRepositories.findOne({
      where: { title: category },
    });

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Not enought money in your balance');
    }

    if (!categoryFind) {
      const cat = categoriesRepositories.create({
        title: category,
      });
      await categoriesRepositories.save(cat);
      const transaction = transactionsRepository.create({
        title,
        category_id: cat.id,
        value,
        type,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }
    if (categoryFind) {
      const categoryId = categoryFind.id;
      const transaction = transactionsRepository.create({
        title,
        category_id: categoryId,
        value,
        type,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }
  }
}

export default CreateTransactionService;
