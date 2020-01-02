/**
 * Parses the raw arguments to the command into options and arguments
 * @param {Array} commandArgs array of strings
 */
export function parseArguments(commandArgs) {
  const args = [];
  const options = [];

  var seenOptions = false;
  for (const arg of commandArgs) {
    if (arg.startsWith("--")) {
      seenOptions = true;
    }

    if (!seenOptions) {
      args.push(arg);
    } else {
      options.push(arg);
    }
  }

  // build a dynamic dictionary based on the -- pieces
  const optionsMap = {};
  var currOptionName;
  var currOptionArgs = [];
  for (var i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.startsWith("--")) {
      // close previous option, start new one
      if (currOptionName) {
        optionsMap[currOptionName] = currOptionArgs;
        currOptionArgs = [];
      }
      currOptionName = option.substring(2);
    } else {
      currOptionArgs.push(option);
    }
  }

  // add the last set
  optionsMap[currOptionName] = currOptionArgs;

  return {
    args: args,
    options: optionsMap
  };
}
