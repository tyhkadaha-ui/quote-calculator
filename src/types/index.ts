export interface Product {
  id: string;
  name: string;
  quantity: number;
  factoryUnitPrice: number;
  billingTaxRate: number;
  taxRefundRate: number;
  freightToNingbo: number;
}

export interface GlobalParams {
  exchangeRate: number;
  totalPortFees: number;
  totalMainFreight: number;
  profitRate: number;
  serviceFee: number;
}

export interface ProductCalculation {
  product: Product;
  // 基础计算
  productTotal: number; // 整票产品金额
  unitPriceWithTax: number; // 含税单价
  unitTaxRefund: number; // 单件退税额

  // 分摊
  portFeeShare: number; // 分摊的港杂费
  freightShare: number; // 分摊的运费

  // 成本
  actualUnitCost: number; // 实际单件成本（含税 - 退税 + 分摊费用）
  unitProfit: number; // 单件利润
  unitServiceFee: number; // 单件手续费

  // 最终单价 (RMB)
  finalUnitPrice: number;

  // 贸易术语价格 (USD)
  pricesUSD: {
    EXW: number;
    FOB: number;
    CFR: number;
    CIF: number;
  };

  // 总价 (RMB / USD)
  totalRMB: number;
  totalUSD: number;
}

export interface QuoteMatrixData {
  products: ProductCalculation[];
  grandTotalRMB: number;
  grandTotalUSD: number;
}