const styles = {
  success: { open: "\u001b[32;1m", close: "\u001b[0m" },
  danger: { open: "\u001b[31;1m", close: "\u001b[0m" },
  info: { open: "\u001b[36;1m", close: "\u001b[0m" },
  subtitle: { open: "\u001b[2;1m", close: "\u001b[0m" },
};

const color = (modifier, string) => {
  return styles[modifier].open + string + styles[modifier].close;
};

const print = (modifier, message) => {
  console.log(color(modifier, message));
};

exports.print = print;
