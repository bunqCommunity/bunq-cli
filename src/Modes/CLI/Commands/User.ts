export default async bunqCLI => {
    if (!bunqCLI.user) await bunqCLI.getUser(true);

    bunqCLI.outputHandler(bunqCLI.user);
};
