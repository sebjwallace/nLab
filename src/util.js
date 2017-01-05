
function randomFloat(min, max){
  return Math.random() * (max - min) + min
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function probable(max){
  return (randomFloat(0,100) < max)
}

function randomString(length){
  return Math.random().toString(36).substring(length || 8)
}

function arrayToObj(arr){
  var obj = {}
  for(var i = 0; i < arr.length; i++)
    obj[arr[i]] = true
  return obj
}
