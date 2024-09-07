type AsaasWebHookPayment = {
    object: string;
    id: string;
    dateCreated: Date;
    customer: string;
    paymentLink?: string;
    value: number;
    netValue: number;
    originalValue?: number;
    interestValue?: number;
    description: string;
    billingType: string;
    canBePaidAfterDueDate: boolean;
    pixTransaction?: any; // Pode ser substituído por uma interface correspondente se for um objeto complexo
    status: string;
    dueDate: Date;
    originalDueDate: Date;
    paymentDate?: Date;
    clientPaymentDate?: Date;
    installmentNumber?: number;
    invoiceUrl: string;
    invoiceNumber: string;
    externalReference?: string;
    deleted: boolean;
    anticipated: boolean;
    anticipable: boolean;
    creditDate?: Date;
    estimatedCreditDate?: Date;
    transactionReceiptUrl?: string;
    nossoNumero?: string;
    bankSlipUrl?: string;
    lastInvoiceViewedDate?: Date;
    lastBankSlipViewedDate?: Date;
    discount: Discount;
    fine: Fine;
    interest: Interest;
    postalService: boolean;
    custody?: any; // Pode ser substituído por uma interface correspondente se for um objeto complexo
    refunds?: any[]; // Pode ser substituído por uma interface correspondente se for um objeto complexo
  }
  
  interface Discount {
    value: number;
    dueDateLimitDays: number;
    type: string;
  }
  
  interface Fine {
    value: number;
  }
  
  interface Interest {
    value: number;
  }
  
  export default AsaasWebHookPayment;