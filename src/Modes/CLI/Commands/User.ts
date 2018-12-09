export default async bunqCLI => {
    if (!bunqCLI.user) await bunqCLI.getUser();

    bunqCLI.outputHandler(bunqCLI.user);
};
