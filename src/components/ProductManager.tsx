import { useState } from 'react';
import { Product } from '../types';
import { generateId } from '../utils/calculations';

interface ProductManagerProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

export function ProductManager({ products, onProductsChange }: ProductManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({ name: '', description: '', taxRefundRate: '' });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleAdd() {
    setIsAdding(true);
    setFormData({ name: '', description: '', taxRefundRate: '' });
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      taxRefundRate: (product.taxRefundRate * 100).toString(),
    });
  }

  function handleSave() {
    const taxRate = parseFloat(formData.taxRefundRate);
    if (!formData.name || isNaN(taxRate)) return;

    if (isAdding) {
      const newProduct: Product = {
        id: generateId(),
        name: formData.name,
        description: formData.description,
        taxRefundRate: taxRate / 100,
      };
      onProductsChange([...products, newProduct]);
      setIsAdding(false);
    } else if (editingId) {
      onProductsChange(
        products.map(p =>
          p.id === editingId
            ? { ...p, name: formData.name, description: formData.description, taxRefundRate: taxRate / 100 }
            : p
        )
      );
      setEditingId(null);
    }
    setFormData({ name: '', description: '', taxRefundRate: '' });
  }

  function handleDelete(id: string) {
    if (confirm('确认删除该产品？')) {
      onProductsChange(products.filter(p => p.id !== id));
    }
  }

  function handleCancel() {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', taxRefundRate: '' });
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">产品数据库</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          + 新增产品
        </button>
      </div>

      <input
        type="text"
        placeholder="搜索产品..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded text-sm"
      />

      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-3 rounded mb-4">
          <div className="grid gap-2">
            <input
              type="text"
              placeholder="产品型号/SKU"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="text"
              placeholder="规格描述"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="number"
              placeholder="退税率 (%)"
              value={formData.taxRefundRate}
              onChange={e => setFormData({ ...formData, taxRefundRate: e.target.value })}
              className="px-3 py-2 border rounded text-sm"
              step="0.01"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">产品型号</th>
            <th className="text-left p-2">退税率</th>
            <th className="text-right p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id} className="border-t">
              <td className="p-2">
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="px-2 py-1 border rounded w-full"
                  />
                ) : (
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-gray-500 text-xs">{product.description}</div>
                    )}
                  </div>
                )}
              </td>
              <td className="p-2">
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={formData.taxRefundRate}
                    onChange={e => setFormData({ ...formData, taxRefundRate: e.target.value })}
                    className="px-2 py-1 border rounded w-20"
                    step="0.01"
                  />
                ) : (
                  <span className="text-blue-600">{(product.taxRefundRate * 100).toFixed(0)}%</span>
                )}
              </td>
              <td className="p-2 text-right">
                {editingId === product.id ? (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSave}
                      className="text-green-600 text-xs"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 text-xs"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 text-xs"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 text-xs"
                    >
                      删除
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          {products.length === 0 ? '暂无产品，请点击"新增产品"添加' : '未找到匹配产品'}
        </div>
      )}
    </div>
  );
}