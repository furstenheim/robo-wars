// Use complex to rotate, move on the plane
function Complex (x, y) {
  if (Array.isArray(x)) {
    return Complex(x[0], x[1])
  }
  return {x:x, y:y}
}

// No method overloadin :(
Complex.add = function(c1, c2) {
  return  new Complex(c1.x + c2.x, c1.y + c2.y)
}

Complex.multiply = function (c1, c2) {
  return new Complex(c1.x * c2.x - c1.y * c2.y, c1.x * c2.y + c1.y * c2.x)
}

//This only works 1, -1, i -i we should not need more than that
Complex.getTheta = function (complex) {
  if (complex.x === 0) {
    if (complex.y === 1) {
      return 1 * P
    }
    return 3 * P
  }
  if (complex.x === 1) {
    return 0
  }
  return 2 * P
}