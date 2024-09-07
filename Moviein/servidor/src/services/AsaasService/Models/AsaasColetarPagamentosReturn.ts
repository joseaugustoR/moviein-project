interface Payment {
    object: "payment";
    id: string;
    dateCreated: string;
    customer: string;
    paymentLink: string | null;
    value: number;
    netValue: number;
    originalValue: number | null;
    interestValue: number | null;
    description: string | null;
    billingType: "BOLETO" | "CREDIT_CARD" | "PIX";
    confirmedDate?: string;
    pixTransaction?: string | null;
    pixQrCodeId?: string | null;
    status: "PENDING" | "RECEIVED";
    dueDate: string;
    originalDueDate: string;
    paymentDate: string | null;
    clientPaymentDate: string | null;
    installmentNumber: number | null;
    transactionReceiptUrl: string | null;
    nossoNumero: string | null;
    invoiceUrl: string;
    invoiceNumber: string;
    externalReference: string | null;
    deleted: boolean;
    bankSlipUrl: string | null;
    postalService: boolean;
    anticipated: boolean;
    anticipable: boolean;
    creditDate?: string;
    estimatedCreditDate?: string | null;
    lastInvoiceViewedDate?: string;
    lastBankSlipViewedDate?: string | null;
    duplicatedPayment?: string;
    discount?: Discount;
    fine?: Fine;
    interest?: Interest;
    refunds: Refund[] | null;
  }
  
  interface Discount {
    value: number;
    limitDate: string | null;
    dueDateLimitDays: number;
    type: "PERCENTAGE" | string;
  }
  
  interface Fine {
    value: number;
    type: "PERCENTAGE" | string;
  }
  
  interface Interest {
    value: number;
    type: "PERCENTAGE" | string;
  }
  
  interface Refund {
    dateCreated: string;
    status: "DONE" | string;
    value: number;
    description: string;
    transactionReceiptUrl: string;
  }
  
  interface AsaasColetarPagamentosReturn {
    object: "list";
    hasMore: boolean;
    totalCount: number;
    limit: number;
    offset: number;
    data: Payment[];
  }

  export default AsaasColetarPagamentosReturn;
  