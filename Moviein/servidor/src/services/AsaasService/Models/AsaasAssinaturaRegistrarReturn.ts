interface AsaasAssinaturaRegistrarReturn {
    object: string;
    id: string;
    dateCreated: string;
    customer: string;
    paymentLink: string | null;
    billingType: "BOLETO" | "CREDIT_CARD" | "PIX" | "UNDEFINED";
    cycle: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "SEMIANNUALLY" | "YEARLY";
    value: number;
    nextDueDate: string;
    description: string;
    status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "CANCELED";
}

export default AsaasAssinaturaRegistrarReturn;