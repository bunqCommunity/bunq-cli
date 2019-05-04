import chalk from "chalk";
import * as awaiting from "awaiting";
import BunqCLI from "../../BunqCLI";
import { InteractiveBunqCLIModule } from "../../Types/BunqCLIModule";

import selectMonetaryAccountIdPrompt from "../../Prompts/select_monetary_account_id";
import passwordFieldPrompt from "../../Prompts/password_field";
import genericStringPrompt from "../../Prompts/generic_string_prompt";
import genericChoicesPrompt from "../../Prompts/generic_choices_prompt";

import { write, writeLine, startTime, endTimeFormatted } from "../../Utils";

const handle = async (bunqCLI: BunqCLI) => {
    writeLine(chalk.blue(`Ordering a new card`));
    writeLine("");

    const accounts = await bunqCLI.getMonetaryAccounts(true);
    writeLine("");

    // get allowed names
    const allowedCardNameResponse = await bunqCLI.bunqJSClient.api.cardName.get(bunqCLI.user.id);
    const allowedCardNames = allowedCardNameResponse[0].CardUserNameArray.possible_card_name_array;

    const cardTypes = ["MAESTRO", "MASTERCARD", "MAESTRO_MOBILE_NFC"];
    const cardType = await genericChoicesPrompt("Pick a card type", cardTypes);
    if (!cardType) return;

    const description = await genericStringPrompt("card description");
    if (!description) return;

    const pincode = await passwordFieldPrompt("initial pincode (Numbers only!)");
    if (!pincode) return;

    const accountId = await selectMonetaryAccountIdPrompt(accounts);
    if (!accountId) return;

    const cardName = await genericChoicesPrompt("Pick the name you want displayed on the card", allowedCardNames);
    if (!cardName) return;

    let accountInfo = accounts.find(account => account.id === accountId);
    if (!accountInfo) accountInfo = accounts[0];
    const accountAlias = accountInfo.alias[0];

    writeLine("");
    write(chalk.yellow(`Attempting to order the ${cardType} card ... `));
    const startTime1 = startTime();

    await bunqCLI.bunqJSClient.api.cardDebit.post(
        bunqCLI.user.id,
        // personal name
        cardName,
        // the line on the card
        description,
        // initial alias for the card
        accountAlias,
        // card type
        cardType,
        [
            {
                type: "PRIMARY",
                pin_code: pincode,
                monetary_account_id: accountId
            }
        ]
    );

    const timePassedLabel1 = endTimeFormatted(startTime1);
    writeLine(chalk.green(`Ordered the card: (${timePassedLabel1})`));

    return await awaiting.delay(250);
};

const OrderCardAction = new InteractiveBunqCLIModule();
OrderCardAction.id = "order-card-action";
OrderCardAction.message = "Order a new card";
OrderCardAction.handle = handle;
OrderCardAction.visibility = "AUTHENTICATED";

export default OrderCardAction;
