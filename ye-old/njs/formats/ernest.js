function ERNEST_quote(string) {
  return "'" + string + "'";
}

function ERNEST_convertReaction(reaction) {
  var id = ERNEST_reactionID(reaction);
  var reactant = ERNEST_convertComplex(reaction.left);
  var product = ERNEST_convertComplex(reaction.right);
  var reversible = isReversible(reaction).toString();
  return fillBlanks(
    "struct('id', __, 'reactant', __, 'product', __, 'reversible', __)",
      ERNEST_quote(id), reactant, product, reversible
  );
}

function ERNEST_reactionID(reaction) { // ID or Id?
  var left = complexToStringList(reaction.left).join('+');
  var right =complexToStringList(reaction.right).join('+');
  var arrow = ERNEST_convertArrow(reaction.arrow);
  return left + arrow + right;
}

function ERNEST_convertArrow(arrow) {
  var mapping = {};
  mapping[Arrow.right] = "->";
  mapping[Arrow.both] = "<->";
  return mapping[arrow];
}

function ERNEST_convertComplex(complex) {
  if (complex.length === 0)
    return "struct([])";
  var species = complex.map(function(x) { return ERNEST_quote(x.variable); });
  species = ERNEST_encodeList(species);
  var stoich = complex.map(function(x) { return x.coefficient; });
  stoich = ERNEST_encodeList(stoich);
  return fillBlanks("struct('species', __, 'stoichiometry', __)", species, stoich);
}

function ERNEST_encodeList(array) { // encodeArray?
  switch (array.length) {
    case 0: 
      return "?"; // TODO: figure this out!
    case 1: 
      return array[0];
    default: 
      return "{" + array.join(", ") + "}";
  }
}

function ERNEST_generate(reactionNetwork) {
  var outputLines = [];
  function addLine() {
    outputLines.push(fillBlanks.apply(null, arguments));
  }

  addLine("clear model");
  addLine("");
  
  var name = reactionNetwork.modelName;
  addLine("model.id = '__';", name.replace(/\s+/g, '_'));
  addLine("model.name = '__';", name);
  
  var speciesList = ERNEST_encodeList(getVariables(reactionNetwork).sort().map(ERNEST_quote));
  addLine("model.species = struct('id', __);", speciesList);
  var reactions = reactionNetwork.reactions;
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    addLine("model.reaction(__) = __;", (i+1), ERNEST_convertReaction(reaction));
  }
  
  addLine("");
  addLine("disp(['Model: ' model.name]);");
  addLine("model_analysis(model);");
  
  return outputLines.join("\n");
}
