interface AsaasClientReturn {
    object: string;
    id: string;
    dateCreated: string;
    name: string;
    email: string;
    phone: string;
    mobilePhone: string;
    address: string;
    addressNumber: string;
    complement: string;
    province: string;
    postalCode: string;
    cpfCnpj: string;
    personType: "FISICA" | "JURIDICA"; // Assuming it can only be one of these two values
    deleted: boolean;
    additionalEmails: string;
    externalReference: string;
    notificationDisabled: boolean;
    city: number;
    cityName: string;
    state: string;
    country: string;
    observations: string;
}

export default AsaasClientReturn;