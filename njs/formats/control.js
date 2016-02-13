function CONTROL_generate(reactionNetwork) {
  var reactions = reactionNetwork.reactions;
  return reactions.map(CONTROL_convertReaction).join("\n");
}

function CONTROL_convertReaction(reaction) {
  var left = complexToStringList(reaction.left).join(" + ");
  var right = complexToStringList(reaction.right).join(" + ");
  var arrow = CONTROL_convertArrow(reaction.arrow);
  return left + " " + arrow + " " + right;
}

function CONTROL_convertArrow(arrow) {
  var mapping = {};
  mapping[Arrow.right] = "-->";
  mapping[Arrow.both] = "<-->";
  return mapping[arrow];
}