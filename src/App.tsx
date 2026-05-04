import { Product, QuotationItem } from './types';
import { ProductManager } from './components/ProductManager';
import { QuotationCalculator } from './components/QuotationCalculator';
import { DataExportImport } from './components/DataExportImport';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId } from './utils/calculations';

const defaultParams: QuotationItem = {
  productId: '',
  quantity: 5000,
  factoryUnitPrice: 0,
  billingTaxRate: 0,
  freightToNingbo: 0,
  moldFeeTotal: 0,
  packagingFee: 0,
  printingFee: 0,
  localPortFee: 0,
  freightToClient: 0,
  freightMarkup: 1.2,
  insuranceFee: 0,
  profitRate: 0.2,
  exchangeRate: 6.75,
};

const defaultProducts: Product[] = [
  { id: generateId(), name: '反光背心', description: '', taxRefundRate: 0.13 },
  { id: generateId(), name: '反光啪啪圈', description: '', taxRefundRate: 0.13 },
  { id: generateId(), name: '反光玩具', description: '', taxRefundRate: 0.09 },
  { id: generateId(), name: '反光钥匙链', description: '', taxRefundRate: 0.13 },
];

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>('quote-products', defaultProducts);
  const [savedParams, setSavedParams] = useLocalStorage<QuotationItem>('quote-params', defaultParams);

  function handleImport(newProducts: Product[], newParams: QuotationItem) {
    setProducts(newProducts);
    setSavedParams(newParams);
  }

  function handleClearAll() {
    setProducts([]);
    setSavedParams(defaultParams);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">外贸报价计算器</h1>

        <ProductManager products={products} onProductsChange={setProducts} />

        <DataExportImport
          products={products}
          savedParams={savedParams}
          onImport={handleImport}
          onClearAll={handleClearAll}
        />

        <QuotationCalculator
          products={products}
          savedParams={savedParams}
          onParamsChange={setSavedParams}
        />
      </div>
    </div>
  );
}

export default App;