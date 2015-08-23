/**
 * Created by Fanaen on 23/08/2015.
 */

function stateToString(state) {
  switch (state) {
    case "calm":
      return "Normal";
    case "fear":
      return "Afraid";
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
  var prefix = '<span class="badge fear">'+ number +'</span>';
  if(number < 1) {
    return prefix + "Afraid of her shadow";
  }
  else if(number >= 1 && number < 3 ) {
    return prefix + "Normal";
  }
  else {
    return prefix + "Fearless"
  }
}

function resLoveToString(number) {
  var prefix = '<span class="badge love">'+ number +'</span>';

  if(number < 1) {
    return prefix + "You have no idea";
  }
  else if(number >= 1 && number < 3 ) {
    return prefix + "Normal";
  }
  else {
    return prefix + "Heartless"
  }
}

function attLoveToString(number) {
  var prefix = '<span class="badge love">'+ number +'</span>';

  if(number < 0) {
    return prefix + "Repulsive";
  }
  else if(number >= 0 && number < 3 ) {
    return prefix + "Attractive";
  }
  else {
    return prefix + "Sexy as hell"
  }
}

function attFearToString(number) {
  var prefix = '<span class="badge fear">'+ number +'</span>';

  if(number < 0) {
    return prefix + "Hilarious";
  }
  else if(number >= 0 && number < 3 ) {
    return prefix + "Scary";
  }
  else {
    return prefix + "Horifying";
  }
}


function levelToString(number) {
  var prefix = '<span class="badge level">'+ number +'</span>';

  if(number <= 1) {
    return prefix + "Boss. Control or kill it.";
  }
  else {
    return prefix + "Minion";
  }
}
