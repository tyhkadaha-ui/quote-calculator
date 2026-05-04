import { Product, GlobalParams, ProductCalculation, QuoteMatrixData } from '../types';

export function calculateQuoteMatrix(products: Product[], params: GlobalParams): QuoteMatrixData {
  if (products.length === 0) {
    return { products: [], grandTotalRMB: 0, grandTotalUSD: 0 };
  }

  // 计算各产品金额占比
  const productTotals = products.map(p => p.factoryUnitPrice * p.quantity);
  const grandProductTotal = productTotals.reduce((sum, t) => sum + t, 0);

  const calculatedProducts: ProductCalculation[] = products.map((product) => {
    const { quantity, factoryUnitPrice, billingTaxRate, taxRefundRate, freightToNingbo } = product;

    // 基础计算
    const productTotal = factoryUnitPrice * quantity;
    const unitPriceWithTax = factoryUnitPrice * (1 + billingTaxRate / 100);
    const unitTaxRefund = unitPriceWithTax * taxRefundRate;

    // 按金额占比分摊港杂和运费
    const shareRatio = productTotal / grandProductTotal;
    const portFeeShare = params.totalPortFees * shareRatio / quantity;
    const freightShare = params.totalMainFreight * shareRatio / quantity;

    // 成本 = 含税单价 - 退税 + 分摊费用
    const actualUnitCost = unitPriceWithTax - unitTaxRefund + portFeeShare + freightShare + freightToNingbo;

    // 利润 = 成本 × 利润率 / (1 - 利润率)
    const unitProfit = actualUnitCost * params.profitRate / (1 - params.profitRate);

    // 手续费
    const unitServiceFee = params.serviceFee;

    // 最终单价 (RMB)
    const finalUnitPrice = actualUnitCost + unitProfit + unitServiceFee;

    // 换算 USD
    const priceUSD = finalUnitPrice / params.exchangeRate;

    // 贸易术语价格 (USD)
    const pricesUSD = {
      EXW: priceUSD,
      FOB: priceUSD,  // FOB = EXW + 国内运费 (暂不单独计算)
      CFR: priceUSD,  // CFR = FOB + 远洋运费 (暂不单独计算)
      CIF: priceUSD,  // CIF = CFR + 保险费 (暂不单独计算)
    };

    return {
      product,
      productTotal,
      unitPriceWithTax,
      unitTaxRefund,
      portFeeShare,
      freightShare,
      actualUnitCost,
      unitProfit,
      unitServiceFee,
      finalUnitPrice,
      pricesUSD,
      totalRMB: finalUnitPrice * quantity,
      totalUSD: priceUSD * quantity,
    };
  });

  const grandTotalRMB = calculatedProducts.reduce((sum, p) => sum + p.totalRMB, 0);
  const grandTotalUSD = calculatedProducts.reduce((sum, p) => sum + p.totalUSD, 0);

  return { products: calculatedProducts, grandTotalRMB, grandTotalUSD };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}