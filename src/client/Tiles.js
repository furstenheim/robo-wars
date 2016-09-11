g.Tiles = {}
g.Tiles = {
  floor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCTo0C01FEQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABQSURBVBjTpVBBDgAgCCr/Wr0pe0r1tw6txhJPcVNAHHGOHg6a1pRLMIgo8iAe0bS+IlxtYK7YlTWQOGsQ7w80COXI4/c+Lem7J8zlPeGYclkeyCQcEkGchAAAAABJRU5ErkJggg==',
  wall: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLChMusC+d2QAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABLSURBVBjTY7S1tWUgBJjQ+GqqqjgVweVu3b6NqY2RHOvQDIYwmLA6BW4phMEEUQEXRTMDYRKyY9HMQHcTXCtmKBDtO2TrsRpGlEkAsuEcUVru56YAAAAASUVORK5CYII=',
  player0: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wAAAAAzJ3zzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCykj6vVVKgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACrSURBVEjHY8yOD2WgJWBioDEY+hawwBhTF67+T6lh2fGhjMMviBjRk+mNj1v+MzAwMGio/GS4cYcdqyZkOQ1+H0ayfIBuuIbKT5xyZFmAbCA+35BtAbKB5BqOkkzx+QTZAhh/74bvDAwMDAx7GRDJm6xkiu56Un3DQqzL0YFzACflqQgW0RoqP1EinWoZDeaDG3fYMeKBpjmZlHiguLCjOBUNvcJutMqkuwUAklJFrPsWPH0AAAAASUVORK5CYII=',
  player1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QAawBfAFVrQDHVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCyYCIQRZuwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACwSURBVEjHY7S3tWGgJWBioDFgQWL/x6OOEYsYUerp6gOCQEdJEs6+cu85yRYwMjAwMHz69PE/ruA4duEjToP4+PgZCfrg06ePZAfFp08fGawMNDB8yEKqQciG4Il0+kUyVS2YsnA1w5SFqwcuo1EMcuJDR4OIuCBCzuWDzwfHLtzAlQEZaRpExy7cYODj4x/gCgebC6AFGSOW0vM/MWURUUGEy+JBVyczkqiXcVD4AAAU0DA4nLYhlQAAAABJRU5ErkJggg==',
  player2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLECYfUnF58wAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAADFSURBVEjHzVXRFcMgCARed8oiLpGJuoSLdJYMQX/SPo2HQmPa8p4/etwpILCqLkT0oIuMVdUHZH4DVZWnCJSklo3EoICH2CskM8h7ftULLFDOudlLKbleIqObIfLevhkidPsRCTo/8kj05ibuvi8rB6XykRzFu8FsO2at83A7UzmVrXWYXiJCF9s8ASMHEu0t0V8NkxypIlQEpYB4nT7FSa9ZjZzRebhVWCLeFzbt+syfQFGQ6ACJzoPfTLSvzeT/ahWGPQEEb4LKUITSfgAAAABJRU5ErkJggg==',
  player3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLEC0oCTgFNwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAADnSURBVEjH7ZUxEoIwEEX/RsYTeAUbr2KjlZWdx7KjogIKOQpNruAFLGQtIBgQFmLI2LgzzBaQ/2aX3R9iZoQMhcARHBD5HCaitr/MTN4AW7AX69Ez0k8+HvajL7O8UACqqQo+AJLoACQCQABWzPyYBLiIm0izG4ltNQBbPL1f39DNxQsyOKZGdEg8iXWdS90+UuXOe3A6b+u86+ZJgF2maZHdqkUXTep7Euu2CiermDtBRjwpdSfPXrSlR9Xb7LK8ICIKA2jsQrHgN8p1M3vfVQCeggnKZjfXTceMzhnwzX1A/zv554AXJGZ3EDgQafoAAAAASUVORK5CYII=',
  arrow: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkLCiA4sJBNuAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABXSURBVDjLxZNBDoBACAPb/f+fZw+6hsNqBBLl3iGlxYA6M9ScdwAb2dQB4AtUtnADqd0gQIxUjwHcA3wX46OFTBNjAmcqo7o5b2FtD+JclTfiowd/f+METjMlD4iLdKcAAAAASUVORK5CYII='
}
