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
    var h = g.Input.size.h, w = g.Input.size.w, c = g.ic, d =~~ (h / 30), imgLoaded = 0
    c.clearRect(0,0, w, h)
    for (let i = 0; i < g.Input.max; i++) {
      c.rect( h * i + d, d, h - 2 * d, h - 2 * d)
      let action = input.actions[i]
      if (action) {
        let image = new Image()
        image.onload = function () {
          c.save()
          c.translate(h*i + h / 2, h /2)
          c.rotate(-g.Input.subtypeToTheta(action.subtype))
          c.drawImage(image, -(h - 2*d) / 2, -(h -2 * d) / 2, h-2 * d, h-2 * d)
          c.restore()
          loaded()
        }
        image.src = g.Tiles['arrow']
      }
    }
    function loaded () {
      if (++imgLoaded === g.Input.max) c.stroke()
    }
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
