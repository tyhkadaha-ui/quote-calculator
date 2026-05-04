export interface Product {
  id: string;
  name: string;
  description: string;
  taxRefundRate: number; // 退税率
}

export interface QuotationItem {
  productId: string;
  quantity: number;
  factoryUnitPrice: number; // 工厂单件裸价 (RMB)
  billingTaxRate: number; // 开票税点 (%)
  freightToNingbo: number; // 到宁波单件运费
  moldFeeTotal: number; // 模具费/版费总额
  packagingFee: number; // 定制包装及辅料费
  printingFee: number; // 印刷费
  localPortFee: number; // 整票港杂本地费
  freightToClient: number; // 海空卡联运费（货代报价）
  freightMarkup: number; // 运费加价系数
  insuranceFee: number; // 保险费
  profitRate: number; // 整票利润率
  exchangeRate: number; // 当前汇率
}

export interface CalculationResult {
  // 基础计算
  totalNakedPrice: number; // 整票裸价
  unitPriceWithTax: number; // 含税单价
  unitPriceWithFreight: number; // 含税运宁波单价

  // 退税相关
  totalTaxRefund: number; // 整票退税额
  unitTaxRefund: number; // 单件退税额

  // 成本
  actualUnitCost: number; // 实际单件成本

  // 分摊费用
  unitMoldFee: number; // 单件分摊模具费
  unitPackagingFee: number; // 单件分摊包装辅料费
  unitPrintingFee: number; // 单件Logo印刷费
  unitPortFee: number; // 单件分摊港杂费

  // 运费保险
  unitFreight: number; // 单件运费
  unitInsurance: number; // 单件保险费

  // 最终成本
  unitCostWithAllFees: number; // 加上杂费后的单件成本
  unitTargetProfit: number; // 单件目标利润

  // 各贸易术语价格
  prices: {
    EXW: { unit: number; total: number };
    FCA: { unit: number; total: number };
    FOB: { unit: number; total: number };
    CFR: { unit: number; total: number };
    CIF: { unit: number; total: number };
    CPT: { unit: number; total: number };
    CIP: { unit: number; total: number };
  };
}

export type Incoterm = 'EXW' | 'FCA' | 'FOB' | 'CFR' | 'CIF' | 'CPT' | 'CIP';