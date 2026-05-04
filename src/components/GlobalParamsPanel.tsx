import { GlobalParams } from '../types';

interface GlobalParamsPanelProps {
  params: GlobalParams;
  onChange: (params: GlobalParams) => void;
}

export function GlobalParamsPanel({ params, onChange }: GlobalParamsPanelProps) {
  function update(key: keyof GlobalParams, value: number) {
    onChange({ ...params, [key]: value });
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">全局参数</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">汇率 (USD/RMB)</label>
          <input
            type="number"
            value={params.exchangeRate}
            onChange={e => update('exchangeRate', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">整票港杂费 (RMB)</label>
          <input
            type="number"
            value={params.totalPortFees}
            onChange={e => update('totalPortFees', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">整票主干线运费 (RMB)</label>
          <input
            type="number"
            value={params.totalMainFreight}
            onChange={e => update('totalMainFreight', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">利润率 (%)</label>
          <input
            type="number"
            value={(params.profitRate * 100).toFixed(1)}
            onChange={e => update('profitRate', (parseFloat(e.target.value) || 0) / 100)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">手续费 (RMB/件)</label>
          <input
            type="number"
            value={params.serviceFee}
            onChange={e => update('serviceFee', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}