// {Sample Model}{}#3{X1,X2,X3,C4,A,NC,S,A1,S7,X5}
// {X1,7X2,C4,2X3 + X2,A + NC + 7S,A1 + S7,0,X5}{1,2,R3,4,N5,6,N7,8,N}

function CRNTOOLBOX_generate(reactionNetwork) {
  var buffer = "";
  buffer += "{" + reactionNetwork.modelName + "}";
  buffer += "{}";
  buffer += "#3";
  buffer += CRNTOOLBOX_encodeList(getVariables(reactionNetwork));
  var complexList = [];
  var complexNums = {};
  var numComplexes = 0;
  function getComplexNum(complex) {
    var complexString = complexToStringList(complex).join(" + ");
    if (complexString in complexNums) {
      return complexNums[complexString];
    }
    
    numComplexes++;
    complexList.push(complexString);
    complexNums[complexString] = numComplexes;
    return numComplexes;
  }
  
  var reactionsOutput = [];
  var reactions = reactionNetwork.reactions;
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    var left = getComplexNum(reaction.left);
    var right = getComplexNum(reaction.right);
    var reversible = isReversible(reaction); 
    reactionsOutput.push([left, right, reversible ? 'R' : 'N'].join(","));
  }
  
  buffer += CRNTOOLBOX_encodeList(complexList);
  buffer += CRNTOOLBOX_encodeList(reactionsOutput, "");
  return buffer;
}

function CRNTOOLBOX_encodeList(array, separator) {
  separator = (separator === undefined) ? "," : separator;
  return "{" + array.join(separator) + "}";
}