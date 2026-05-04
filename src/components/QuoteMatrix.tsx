import { QuoteMatrixData } from '../types';

interface QuoteMatrixProps {
  data: QuoteMatrixData;
}

export function QuoteMatrix({ data }: QuoteMatrixProps) {

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">报价矩阵 (USD)</h2>

      {data.products.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          添加产品后显示报价
        </div>
      ) : (
        <>
          {/* 产品明细表 */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">产品</th>
                <th className="text-right p-2">数量</th>
                <th className="text-right p-2">EXW</th>
                <th className="text-right p-2">FOB</th>
                <th className="text-right p-2">CFR</th>
                <th className="text-right p-2">CIF</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((calc) => (
                <tr key={calc.product.id} className="border-t">
                  <td className="p-2 font-medium">{calc.product.name || '未命名'}</td>
                  <td className="p-2 text-right">{calc.product.quantity.toLocaleString()}</td>
                  <td className="p-2 text-right">${calc.pricesUSD.EXW.toFixed(4)}</td>
                  <td className="p-2 text-right">${calc.pricesUSD.FOB.toFixed(4)}</td>
                  <td className="p-2 text-right">${calc.pricesUSD.CFR.toFixed(4)}</td>
                  <td className="p-2 text-right">${calc.pricesUSD.CIF.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 汇总行 */}
          <div className="border-t-2 border-gray-300 pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left p-2 font-bold">总计</th>
                  <th className="text-right p-2 font-bold">{data.products.reduce((s, p) => s + p.product.quantity, 0).toLocaleString()}</th>
                  <th className="text-right p-2 font-bold text-blue-600">
                    ${data.products.reduce((s, p) => s + p.pricesUSD.EXW * p.product.quantity, 0).toFixed(2)}
                  </th>
                  <th className="text-right p-2 font-bold text-blue-600">
                    ${data.products.reduce((s, p) => s + p.pricesUSD.FOB * p.product.quantity, 0).toFixed(2)}
                  </th>
                  <th className="text-right p-2 font-bold text-blue-600">
                    ${data.products.reduce((s, p) => s + p.pricesUSD.CFR * p.product.quantity, 0).toFixed(2)}
                  </th>
                  <th className="text-right p-2 font-bold text-blue-600">
                    ${data.products.reduce((s, p) => s + p.pricesUSD.CIF * p.product.quantity, 0).toFixed(2)}
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* RMB 汇总 */}
          <div className="mt-4 bg-gray-50 rounded p-3">
            <div className="text-sm text-gray-600">
              <span>总报价 (RMB): </span>
              <span className="font-bold text-gray-800">¥{data.grandTotalRMB.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}