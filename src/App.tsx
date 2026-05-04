import { useMemo } from 'react';
import { Product, GlobalParams } from './types';
import { GlobalParamsPanel } from './components/GlobalParamsPanel';
import { ProductList } from './components/ProductList';
import { QuoteMatrix } from './components/QuoteMatrix';
import { calculateQuoteMatrix } from './utils/calculations';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DataExportImport } from './components/DataExportImport';

const defaultProducts: Product[] = [
  {
    id: 'default-1',
    name: '反光背心',
    quantity: 5000,
    factoryUnitPrice: 8,
    billingTaxRate: 0.13,
    taxRefundRate: 0.13,
    freightToNingbo: 0,
  },
];

const defaultParams: GlobalParams = {
  exchangeRate: 6.75,
  totalPortFees: 500,
  totalMainFreight: 5000,
  profitRate: 0.2,
  serviceFee: 0,
};

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>('quote-products-v2', defaultProducts);
  const [params, setParams] = useLocalStorage<GlobalParams>('quote-params-v2', defaultParams);

  const quoteMatrix = useMemo(() => {
    return calculateQuoteMatrix(products, params);
  }, [products, params]);

  function handleImport(newProducts: Product[], newParams: GlobalParams) {
    setProducts(newProducts);
    setParams(newParams);
  }

  function handleClearAll() {
    setProducts([]);
    setParams(defaultParams);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">外贸报价计算器</h1>
        </div>
      </header>

      {/* Main Content: 3 Column Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Global Params (2 cols) */}
          <div className="lg:col-span-3">
            <GlobalParamsPanel params={params} onChange={setParams} />
          </div>

          {/* Middle Column: Product List (5 cols) */}
          <div className="lg:col-span-5">
            <ProductList products={products} onChange={setProducts} />
          </div>

          {/* Right Column: Quote Matrix (4 cols) */}
          <div className="lg:col-span-4">
            <QuoteMatrix data={quoteMatrix} />
          </div>
        </div>

        {/* Data Management */}
        <div className="mt-6">
          <DataExportImport
            products={products}
            savedParams={params as any}
            onImport={handleImport as any}
            onClearAll={handleClearAll}
          />
        </div>
      </main>
    </div>
  );
}

export default App;