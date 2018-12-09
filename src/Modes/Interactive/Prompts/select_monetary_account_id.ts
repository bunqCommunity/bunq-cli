// @ts-ignore
const { Select } = require("enquirer");

export default async accounts => {
    const prompt = new Select({
        message: "Which monetary account would you like to use?",
        choices: accounts.map(account => {
            const accountType = Object.keys(account)[0];
            const accountInfo = account[accountType];

            return {
                message: `${accountInfo.id}: ${accountInfo.description} - ${accountInfo.balance.value}`,
                value: accountInfo.id
            };
        })
    });

    return prompt.run();
};
