"use strict"

module.exports = orderSegments

var orient = require("robust-orientation")

function horizontalOrder(a, b) {
  var bl, br
  if(b[0][0] < b[1][0]) {
    bl = b[0]
    br = b[1]
  } else if(b[0][0] > b[1][0]) {
    bl = b[1]
    br = b[0]
  } else {
    var alo = Math.min(a[0][1], a[1][1])
    var ahi = Math.max(a[0][1], a[1][1])
    var blo = Math.min(b[0][1], b[1][1])
    var bhi = Math.max(b[0][1], b[1][1])
    if(ahi < blo) {
      return ahi - blo
    }
    if(alo > bhi) {
      return alo - bhi
    }
    return ahi - bhi
  }
  var al, ar
  if(a[0][1] < a[1][1]) {
    al = a[0]
    ar = a[1]
  } else {
    al = a[1]
    ar = a[0]
  }
  var d = orient(br, bl, al)
  if(d) {
    return d
  }
  d = orient(br, bl, ar)
  if(d) {
    return d
  }
  return ar - br
}

function orderSegments(b, a) {
  var al, ar
  if(a[0][0] < a[1][0]) {
    al = a[0]
    ar = a[1]
  } else if(a[0][0] > a[1][0]) {
    al = a[1]
    ar = a[0]
  } else {
    return horizontalOrder(a, b)
  }
  var bl, br
  if(b[0][0] < b[1][0]) {
    bl = b[0]
    br = b[1]
  } else if(b[0][0] > b[1][0]) {
    bl = b[1]
    br = b[0]
  } else {
    return -horizontalOrder(b, a)
  }
  var d = orient(al, ar, bl)
  if(d) {
    return d
  }
  d = orient(al, ar, br)
  if(d) {
    return d
  }
  return ar[0] - br[0]
}