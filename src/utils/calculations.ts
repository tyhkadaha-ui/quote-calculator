import { QuotationItem, CalculationResult, Incoterm } from '../types';

export const INCOTERMS: Incoterm[] = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP'];

export function calculateQuotation(item: QuotationItem, taxRefundRate: number): CalculationResult {
  const { quantity, factoryUnitPrice, billingTaxRate, freightToNingbo, moldFeeTotal,
    packagingFee, printingFee, localPortFee, freightToClient, freightMarkup,
    insuranceFee, profitRate } = item;

  // 基础计算
  const totalNakedPrice = factoryUnitPrice * quantity;
  const unitPriceWithTax = factoryUnitPrice * (1 + billingTaxRate / 100);
  const unitPriceWithFreight = unitPriceWithTax + freightToNingbo;

  // 退税相关
  const unitTaxRefund = unitPriceWithTax * taxRefundRate;
  const totalTaxRefund = unitTaxRefund * quantity;

  // 成本
  const actualUnitCost = unitPriceWithTax - unitTaxRefund;

  // 分摊费用
  const unitMoldFee = moldFeeTotal / quantity;
  const unitPackagingFee = packagingFee / quantity;
  const unitPrintingFee = printingFee / quantity;
  const unitPortFee = localPortFee / quantity;

  // 运费保险
  const unitFreight = freightToClient * freightMarkup;
  const unitInsurance = insuranceFee / quantity;

  // 最终成本 + 利润
  const unitCostWithAllFees = actualUnitCost + unitMoldFee + unitPackagingFee + unitPrintingFee + unitPortFee + unitFreight + unitInsurance;
  const unitTargetProfit = unitCostWithAllFees * profitRate / (1 - profitRate);

  // 各贸易术语单价（所有术语都是成本 + 利润，因为这些术语都由买方承担运费保险）
  const baseUnitPrice = unitCostWithAllFees + unitTargetProfit;

  const prices = {
    EXW: { unit: baseUnitPrice, total: baseUnitPrice * quantity },
    FCA: { unit: baseUnitPrice, total: baseUnitPrice * quantity },
    FOB: { unit: baseUnitPrice, total: baseUnitPrice * quantity },
    CFR: { unit: baseUnitPrice, total: baseUnitPrice * quantity },
    CIF: { unit: baseUnitPrice, total: baseUnitPrice * quantity },
    CPT: { unit: baseUnitPrice, total: baseUnitPrice * quantity },
    CIP: { unit: baseUnitPrice, total: baseUnitPrice * quantity },
  };

  return {
    totalNakedPrice,
    unitPriceWithTax,
    unitPriceWithFreight,
    totalTaxRefund,
    unitTaxRefund,
    actualUnitCost,
    unitMoldFee,
    unitPackagingFee,
    unitPrintingFee,
    unitPortFee,
    unitFreight,
    unitInsurance,
    unitCostWithAllFees,
    unitTargetProfit,
    prices,
  };
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}