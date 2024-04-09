import { ProductCreate, ProductUpdate } from './model';
import { productRepository } from './repository';
import { productTransformer } from './transformer';

export const productService = {
  product: async (id: string, slug: string) => {
    const repositoryResponse = await productRepository.findById(id, slug);
    return productTransformer.product(repositoryResponse as any);
  },
  products: async (slug: string) => {
    const repositoryResponse = await productRepository.findManyByStoreSlug(slug);
    return productTransformer.products(repositoryResponse);
  },
  create: async (slug: string, data: ProductCreate) => {
    const repositoryResponse = await productRepository.create(slug, data);
    return productTransformer.product(repositoryResponse);
  },
  update: async (slug: string, id: string, data: ProductUpdate) => {
    const repositoryResponse = await productRepository.update(slug, id, data);
    return productTransformer.product(repositoryResponse);
  },
  delete: async (slug: string, id: string) => {
    const repositoryResponse = await productRepository.deleteById(slug, id);
    return repositoryResponse;
  },
};
