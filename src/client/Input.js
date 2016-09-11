g.Input = {
  init: function () {
    return {
      time: new Date(),
      actions:[]
    }
  },
  size:{
    w: 800,
    h: 40
  },
  max: 4,
  renderRobot: function (state) {
    var h = g.Input.size.h, w = g.Input.size.w, c = g.ic, position = state.position, img = g.images['player' + position]
    c.clearRect(0, h, w, w)
    c.drawImage(img, 0, h, h * g.Input.max,h * g.Input.max)
  },
  render: function (input, fraction) {
    var h = g.Input.size.h, w = g.Input.size.w, c = g.ic, d =~~ (h / 30), imgLoaded = 0, cx= h * g.Input.max + h/2, cy = h/2
    // For some reason circle does not disappear without c.beginPath?¿
    c.beginPath()
    c.clearRect(0,0, w, h)
    for (let i = 0; i < g.Input.max; i++) {
      c.strokeStyle = 'black'
      c.strokeRect( h * i + d, d, h - 2 * d, h - 2 * d)
      let action = input.actions[i]
      if (action) {
        c.save()
        let image = g.images['arrow']
        c.translate(h*i + h / 2, h /2)
        c.rotate(-g.Input.subtypeToTheta(action.subtype))
        c.drawImage(image, -(h - 2*d) / 2, -(h -2 * d) / 2, h-2 * d, h-2 * d)
        c.restore()
      }
    }
    fraction = Math.max(Math.min(fraction, 1), 0)

    if (fraction > 0) {
      c.beginPath()
      c.fillStyle = 'red'
      c.moveTo(cx, cy)
      c.arc(cx, cy, cy - 2 * d, 0,  fraction * 4 * P)
      c.lineTo(cx, cy)
      c.closePath()
      c.fill()
    }
    c.stroke()
  },
  clear: function () {
    var h = g.Input.size.h, w = g.Input.size.w, c = g.ic
    c.clearRect(0,0, w, h)
  },
  subtypeToTheta(subtype) {
    var subtypes = MOVEMENTS, i = subtypes.indexOf(subtype)
    if (i > -1) {
      return P * i
    }
  },
  // health goes from 0 to 1 1 is healthy, remainingTime so we can prioritize
  acceptAction(input, code, health, remainingTime) {
    var right = Math.random() < health, newInput = clone(input)
    if (input.actions.length >= g.Input.max) {
      return input
    }
    if (right) {
      g.Sounds.play('right')
      newInput.actions.push({type: g.Actions.types.player, subtype: code, remainingTime: remainingTime})
    } else {
      if (health > 0.1) g.Sounds.play('failed')
      newInput.actions.push({type: g.Actions.types.player, subtype: MOVEMENTS[~~ (Math.random() * 4)], remainingTime: remainingTime})
    }
    return newInput
  },
  // Fill input to the total
  fillInput (input) {
    var newInput = clone(input), i
    for (i = input.actions.length; i<g.Input.max; i++) {
      newInput.actions.push({type: g.Actions.types.player, subtype: MOVEMENTS[~~ (Math.random() * 4)], remainingTime: 0})
    }
    return newInput
  }
}
