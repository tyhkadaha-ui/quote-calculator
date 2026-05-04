import { Product } from '../types';

interface ProductRowProps {
  product: Product;
  index: number;
  onChange: (product: Product) => void;
  onDelete: () => void;
}

export function ProductRow({ product, index, onChange, onDelete }: ProductRowProps) {
  function update(key: keyof Product, value: number | string) {
    onChange({ ...product, [key]: value });
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700">产品 {index + 1}</span>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          删除
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">产品名称</label>
          <input
            type="text"
            value={product.name}
            onChange={e => update('name', e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="产品名称"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">数量 (PCS)</label>
          <input
            type="number"
            value={product.quantity}
            onChange={e => update('quantity', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">工厂裸价 (RMB)</label>
          <input
            type="number"
            value={product.factoryUnitPrice}
            onChange={e => update('factoryUnitPrice', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">开票税点 (%)</label>
          <input
            type="number"
            value={(product.billingTaxRate * 100).toFixed(1)}
            onChange={e => update('billingTaxRate', (parseFloat(e.target.value) || 0) / 100)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">退税率 (%)</label>
          <input
            type="number"
            value={(product.taxRefundRate * 100).toFixed(1)}
            onChange={e => update('taxRefundRate', (parseFloat(e.target.value) || 0) / 100)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">到宁波运费</label>
          <input
            type="number"
            value={product.freightToNingbo}
            onChange={e => update('freightToNingbo', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}