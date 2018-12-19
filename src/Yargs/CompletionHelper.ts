export default yargs => {
    yargs.completion("completion").command("zsh-completion", "generate zsh completion script", yargs => {
        process.stdout.write(`###-begin-bunq-cli-completions-###
#
# yargs command completion script
#
# Installation: bunq-cli zsh-completion >> ~/.zshrc
#    or bunq-cli zsh-completion >> ~/.bash_profile on OSX.
#
_yargs_completions()
{
  local reply
  local si=$IFS

  # ask yargs to generate completions.
  IFS=$'\\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" bunq-cli --get-yargs-completions "\${words[@]}"))
  IFS=$si

  _describe 'values' reply
}
compdef _yargs_completions bunq-cli
###-end-bunq-cli-completions-###`);
        process.exit();
    });
};
