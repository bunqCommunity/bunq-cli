export const accountTypeFormatter = accountType => {
    switch (accountType) {
        case "MonetaryAccountBank":
            return "Regular account";
        case "MonetaryAccountJoint":
            return "Joint account";
        case "MonetaryAccountSavings":
            return "Savings account";
    }
    return accountType;
};
