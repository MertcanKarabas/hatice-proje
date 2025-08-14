import type { Transaction } from "../../../types";

export const localizeTransactionType = (type: Transaction['type']): string => {
    switch (type) {
        case 'SALE':
            return 'Satış';
        case 'PURCHASE':
            return 'Alış';
        case 'PAYMENT':
            return 'Tediye';
        case 'COLLECTION':
            return 'Tahsilat';
        default:
            return type;
    }
};
