import { Product } from '../types';
import { ProductRow } from './ProductRow';
import { generateId } from '../utils/calculations';

interface ProductListProps {
  products: Product[];
  onChange: (products: Product[]) => void;
}

export function ProductList({ products, onChange }: ProductListProps) {
  function addProduct() {
    const newProduct: Product = {
      id: generateId(),
      name: '',
      quantity: 5000,
      factoryUnitPrice: 0,
      billingTaxRate: 0,
      taxRefundRate: 0.13,
      freightToNingbo: 0,
    };
    onChange([...products, newProduct]);
  }

  function updateProduct(index: number, updated: Product) {
    const newProducts = [...products];
    newProducts[index] = updated;
    onChange(newProducts);
  }

  function deleteProduct(index: number) {
    onChange(products.filter((_, i) => i !== index));
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">产品列表</h2>
        <button
          onClick={addProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          + 添加产品
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <ProductRow
            key={product.id}
            product={product}
            index={index}
            onChange={(p) => updateProduct(index, p)}
            onDelete={() => deleteProduct(index)}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          点击"添加产品"开始报价
        </div>
      )}
    </div>
  );
}