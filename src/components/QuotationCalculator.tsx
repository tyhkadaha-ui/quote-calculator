import { useState, useMemo } from 'react';
import { Product, QuotationItem } from '../types';
import { calculateQuotation, INCOTERMS } from '../utils/calculations';

interface QuotationCalculatorProps {
  products: Product[];
  savedParams: QuotationItem;
  onParamsChange: (params: QuotationItem) => void;
}

export function QuotationCalculator({ products, savedParams, onParamsChange }: QuotationCalculatorProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [params, setParams] = useState<QuotationItem>(savedParams);

  function updateParam<K extends keyof QuotationItem>(key: K, value: QuotationItem[K]) {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange(newParams);
  }

  function toggleProduct(productId: string) {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }

  const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));

  const results = useMemo(() => {
    return selectedProducts.map(product => {
      const taxRefundRate = product.taxRefundRate;
      const result = calculateQuotation(params, taxRefundRate);
      return { product, result };
    });
  }, [selectedProducts, params]);

  const inputGroups = [
    { label: '基础信息', fields: [
      { key: 'quantity' as const, label: '订单数量 (PCS)', type: 'number' },
      { key: 'factoryUnitPrice' as const, label: '工厂单件裸价 (RMB)', type: 'number' },
      { key: 'billingTaxRate' as const, label: '开票税点 (%)', type: 'number' },
      { key: 'freightToNingbo' as const, label: '到宁波单件运费', type: 'number' },
    ]},
    { label: '分摊费用', fields: [
      { key: 'moldFeeTotal' as const, label: '模具费/版费总额', type: 'number' },
      { key: 'packagingFee' as const, label: '定制包装及辅料费', type: 'number' },
      { key: 'printingFee' as const, label: '印刷费', type: 'number' },
      { key: 'localPortFee' as const, label: '整票港杂本地费', type: 'number' },
    ]},
    { label: '运费与保险', fields: [
      { key: 'freightToClient' as const, label: '海空卡联运费（货代报价）', type: 'number' },
      { key: 'freightMarkup' as const, label: '运费加价系数', type: 'number' },
      { key: 'insuranceFee' as const, label: '保险费', type: 'number' },
    ]},
    { label: '利润与汇率', fields: [
      { key: 'profitRate' as const, label: '整票利润率', type: 'number' },
      { key: 'exchangeRate' as const, label: '当前汇率', type: 'number' },
    ]},
  ];

  return (
    <div className="space-y-4">
      {/* 产品选择 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold mb-3">选择产品（支持多选）</h2>
        <div className="flex flex-wrap gap-2">
          {products.map(product => (
            <label
              key={product.id}
              className={`cursor-pointer px-3 py-2 rounded border text-sm ${
                selectedProductIds.includes(product.id)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedProductIds.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="hidden"
              />
              {product.name}
            </label>
          ))}
        </div>
      </div>

      {/* 参数输入 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold mb-3">成本参数</h2>
        {inputGroups.map(group => (
          <div key={group.label} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{group.label}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {group.fields.map(field => (
                <div key={field.key}>
                  <label className="text-xs text-gray-500 block mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={params[field.key]}
                    onChange={e => updateParam(field.key, parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded text-sm"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 计算结果 */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <h2 className="text-lg font-bold mb-3">报价结果</h2>
          {results.map(({ product, result }) => (
            <div key={product.id} className="mb-6">
              <h3 className="font-semibold text-blue-600 mb-2">{product.name}</h3>

              {/* 成本明细 */}
              <div className="text-sm text-gray-600 mb-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>含税单价: <span className="text-black">¥{result.unitPriceWithTax.toFixed(2)}</span></div>
                <div>单件退税: <span className="text-black">¥{result.unitTaxRefund.toFixed(2)}</span></div>
                <div>实际成本: <span className="text-black">¥{result.actualUnitCost.toFixed(2)}</span></div>
                <div>含税运宁波: <span className="text-black">¥{result.unitPriceWithFreight.toFixed(2)}</span></div>
                <div>分摊模具: <span className="text-black">¥{result.unitMoldFee.toFixed(4)}</span></div>
                <div>分摊包装: <span className="text-black">¥{result.unitPackagingFee.toFixed(4)}</span></div>
                <div>分摊印刷: <span className="text-black">¥{result.unitPrintingFee.toFixed(4)}</span></div>
                <div>分摊港杂: <span className="text-black">¥{result.unitPortFee.toFixed(4)}</span></div>
                <div>单件运费: <span className="text-black">¥{result.unitFreight.toFixed(4)}</span></div>
                <div>单件保险: <span className="text-black">¥{result.unitInsurance.toFixed(4)}</span></div>
                <div>总成本: <span className="text-black font-semibold">¥{result.unitCostWithAllFees.toFixed(4)}</span></div>
                <div>目标利润: <span className="text-black">¥{result.unitTargetProfit.toFixed(4)}</span></div>
              </div>

              {/* 贸易术语价格表 */}
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">术语</th>
                    <th className="border p-2 text-right">单价 (RMB)</th>
                    <th className="border p-2 text-right">总价 (RMB)</th>
                  </tr>
                </thead>
                <tbody>
                  {INCOTERMS.map(term => (
                    <tr key={term} className="border-t">
                      <td className="border p-2 font-medium">{term}</td>
                      <td className="border p-2 text-right">¥{result.prices[term].unit.toFixed(4)}</td>
                      <td className="border p-2 text-right">¥{result.prices[term].total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}