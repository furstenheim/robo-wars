g.Input = {
  init: function () {
    return {
      time: new Date(),
      actions:[]
    }
  },
  size:{
    w: 800,
    h: 100
  },
  max: 4,
  render: function (input, fraction) {
    var h = g.Input.size.h, w = g.Input.size.w, c = g.ic, d =~~ (h / 30), imgLoaded = 0, cx= h * g.Input.max + h/2, cy = h/2
    c.clearRect(0,0, w, h)
    for (let i = 0; i < g.Input.max; i++) {
      c.strokeStyle = 'black'
      c.strokeRect( h * i + d, d, h - 2 * d, h - 2 * d)
      let action = input.actions[i]
      if (action) {
        c.save()
        let image = new Image()
        c.translate(h*i + h / 2, h /2)
        c.rotate(-g.Input.subtypeToTheta(action.subtype))
        image.src = g.Tiles['arrow']
        c.drawImage(image, -(h - 2*d) / 2, -(h -2 * d) / 2, h-2 * d, h-2 * d)
        c.restore()
      }
    }
    fraction = Math.max(Math.min(fraction, 1), 0)
    c.save()
    c.fillStyle = 'red'
    c.beginPath()
    c.moveTo(cx, cy)
    c.arc(cx, cy, cy - 2 * d, 0,  fraction * 4 * P)
    c.lineTo(cx, cy)
    c.closePath()
    c.fill()
    c.restore()
    c.stroke()
  },
  clear: function () {
    var h = g.Input.size.h, w = g.Input.size.w, c = g.ic
    c.clearRect(0,0, w, h)
  },
  subtypeToTheta(subtype) {
    var subtypes = movements, i = subtypes.indexOf(subtype)
    if (i > -1) {
      return P * i
    }
  },
  // health goes from 0 to 1 1 is healthy
  acceptAction(input, code, health) {
    var right = Math.random() < health, newInput = clone(input)
    if (input.actions.length >= g.Input.max) {
      return input
    }
    if (right) {
      newInput.actions.push({type: g.Actions.types.player, subtype: code})
    } else {
      newInput.actions.push({type: g.Actions.types.player, subtype: movements[~~ (Math.random() * 4)]})
    }
    return newInput
  }
}
