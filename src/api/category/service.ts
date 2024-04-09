import { CategoryCreate } from './model';
import { categoryRepository } from './repository';
import { categoryTransformer } from './transformer';

export const categoryService = {
  category: async (id: string, slug: string) => {
    const repositoryResponse = await categoryRepository.findById(id, slug);
    return categoryTransformer.category(repositoryResponse as any);
  },
  categories: async (slug: string) => {
    const repositoryResponse = await categoryRepository.findManyByStoreSlug(slug);
    return categoryTransformer.categories(repositoryResponse);
  },
  create: async (slug: string, data: CategoryCreate) => {
    const repositoryResponse = await categoryRepository.create(slug, data);
    return categoryTransformer.category(repositoryResponse);
  },
  update: async (slug: string, id: string, data: CategoryCreate) => {
    const repositoryResponse = await categoryRepository.update(slug, id, data);
    return categoryTransformer.category(repositoryResponse);
  },
  delete: async (slug: string, id: string) => {
    const repositoryResponse = await categoryRepository.deleteById(slug, id);
    return repositoryResponse;
  },
};
