import Amount from "@bunq-community/bunq-js-client/dist/Types/Amount";
import CounterpartyAlias from "@bunq-community/bunq-js-client/dist/Types/CounterpartyAlias";

export type AccountType = "MonetaryAccountBank" | "MonetaryAccountJoint" | "MonetaryAccountSavings";


interface MonetaryAccount {
    [key: string]: any;
    id: number;
    accountType: AccountType;
    description: string;
    balance: Amount;
    alias: CounterpartyAlias[];
}

export default MonetaryAccount;
