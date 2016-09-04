g.Input = {
  init: function () {
    return {
      time: new Date(),
      actions:[
        {type:g.Actions.types.player, player: 0, subtype: 'ArrowUp'},
        {type:g.Actions.types.player, player: 0, subtype: 'ArrowRight'},
        {type:g.Actions.types.player, player: 0, subtype: 'ArrowLeft'},
        {type:g.Actions.types.player, player: 0, subtype: 'ArrowUp'}]
    }
  },
  size:{
    w: 800,
    h: 100
  },
  max: 4,
  render: function (input, fraction) {
    var h = g.Input.size.h, w = g.Input.size.w, i, c = g.ic, d =~~ (h / 30), action, image
    c.clearRect(0,0, w, h)
    for (i = 0; i < g.Input.max; i++) {
      c.rect( h * i + d, d, h - 2 * d, h - 2 * d)
      action = input.actions[i]
      if (action) {
        c.save()
        c.translate(h*i + h / 2, h /2)
        c.rotate(-g.Input.subtypeToTheta(action.subtype))
        image = new Image()
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
    var subtypes = ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'], i = subtypes.indexOf(subtype)
    if (i > -1) {
      return P * i
    }
  }
}
