/**
 * Created by user2 on 6/24/15.
 */


var dragHelper = {}
dragHelper.outsideOfBox = function outsideOfBox(
  bound, fx ) {

}

dragHelper.quantize = function (val, distance, offset) {
  var divide = val/distance;
  var remainder = val % distance;
  var fraction = remainder/distance;
  var rangeLowBound = val - remainder;
  var fractionRounded = Math.round(fraction);
  var result;
  if ( fractionRounded == 0 ) {
    result = rangeLowBound;
  } else {
    var signOfFractionRounted = fractionRounded;
    result = rangeLowBound + distance * signOfFractionRounted;
  }

  result -= offset;

  return result;
}

//dragHelper.quantize(5, 10)==10
//dragHelper.quantize(1, 10)==0
//dragHelper.quantize(9, 10)==10
//dragHelper.quantize(99, 10)==100
console.log(dragHelper.quantize(-16, 10, 1)==-20)


var testRunner  = {};
testRunner.run = function run(fx, data, results ) {

}
