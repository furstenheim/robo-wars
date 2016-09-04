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
    var h = g.Input.size.h, w = g.Input.size.w, c = g.ic, d =~~ (h / 30), imgLoaded = 0
    c.clearRect(0,0, w, h)
    for (let i = 0; i < g.Input.max; i++) {
      c.rect( h * i + d, d, h - 2 * d, h - 2 * d)
      let action = input.actions[i]
      if (action) {
        let image = new Image()
        c.save()
        c.translate(h*i + h / 2, h /2)
        c.rotate(-g.Input.subtypeToTheta(action.subtype))
        image.src = g.Tiles['arrow']
        c.drawImage(image, -(h - 2*d) / 2, -(h -2 * d) / 2, h-2 * d, h-2 * d)
        c.restore()
      }
    }
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
