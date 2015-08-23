/**
 * Created by Fanaen on 23/08/2015.
 */

function stateToString(state) {
  switch (state) {
    case "calm":
      return "Normal";
    case "fear":
      return "Afraid of everything";
    case "love":
      return "In love";
    default:
      return "Unknown";
  }
}

function dominatedToString(dominated) {
  if(dominated < 0) {
    return "Nope";
  }
  else if(dominated == 0) {
    return "Under your control";
  }
  else {
    return "Rival ghost's minion";
  }
}

function resFearToString(number) {
  if(number < 1) {
    return "Afraid of her shadow";
  }
  else if(number >= 1 && number < 3 ) {
    return "Normal";
  }
  else {
    return "Fearless"
  }
}

function resLoveToString(number) {
  if(number < 1) {
    return "You have no idea";
  }
  else if(number >= 1 && number < 3 ) {
    return "Normal";
  }
  else {
    return "Heartless"
  }
}
