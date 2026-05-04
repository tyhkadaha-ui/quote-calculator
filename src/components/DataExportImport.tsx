import { Product, GlobalParams } from '../types';

interface DataExportImportProps {
  products: Product[];
  savedParams: GlobalParams;
  onImport: (products: Product[], params: GlobalParams) => void;
  onClearAll: () => void;
}

export function DataExportImport({ products, savedParams, onImport, onClearAll }: DataExportImportProps) {
  function handleExport() {
    const data = {
      products,
      params: savedParams,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.products && data.params) {
          onImport(data.products, data.params);
          alert('导入成功！');
        } else {
          alert('文件格式错误');
        }
      } catch {
        alert('文件解析失败');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function handleClearAll() {
    if (confirm('确认清除所有数据？此操作不可恢复。')) {
      if (confirm('再次确认：所有产品数据和计算参数将被清空！')) {
        onClearAll();
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-3">数据管理</h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
        >
          导出数据 (JSON)
        </button>
        <label className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 cursor-pointer">
          导入数据 (JSON)
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
        <button
          onClick={handleClearAll}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
        >
          清除所有数据
        </button>
      </div>
    </div>
  );
}