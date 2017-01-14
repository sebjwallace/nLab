
nViz.settings({
  canvas: document.getElementById('canvas'),
  cellSize: 10,
  cellMargin: 50,
  randomSegmentOffsetRadiusX: 40,
  randomSegmentOffsetRadiusY: 40,
  activeCellColor: 'orange',
  activeDendriteColor: 'rgba(0,0,0,0.8)',
  inactiveDendriteColor: 'rgba(0,0,0,0.2)'
})

var layers = []
for(var i = 0; i < 2; i++){
  layers[i] = nLab.create.PyramidalNeurons(12)
  if(layers[i-1])
    for(var n in layers[i])
      nLab.create.Dendrite(layers[i-1],layers[i][n],null,0.15)
}
var allNeurons = nLab.get.allNeurons()
for(var i = 0; i < allNeurons.length; i++)
  allNeurons[i].appendNeighbors('lateral',allNeurons)

// var allDendrites = nLab.get.allDendrites()
//   for(var i = 0; i < allDendrites.length; i++)
//     allDendrites[i].randomizePermanances()

nViz.animate({
  keyboardControl: true,
  render: function(){

    var i = Math.random() * 10

    if(i >= 8){
      layers[0][8].activate()
      layers[0][9].activate()
    } else if(i >= 6){
      layers[0][7].activate()
      layers[0][8].activate()
    } else if(i >= 4){
      layers[0][6].activate()
      layers[0][5].activate()
    } else if(i >= 2){
      layers[0][4].activate()
      layers[0][3].activate()
    } else if(i > 0){
      layers[0][2].activate()
      layers[0][1].activate()
    }

    nLab.applyActivations()

    for(var i = 0; i < layers.length; i++){
      nViz.render.layer({
        offsetY: i * 120,
        cells: layers[i].map(function(cell){
          return {
            id: cell.id,
            activated: cell.isActive()
          }
        })
      })
    }

    var allDendrites = nLab.get.allDendrites()
    for(var n = 0; n < allDendrites.length; n++){
      nViz.render.distalDendrite({
        source: allDendrites[n].getTarget(),
        targets: allDendrites[n].getPermanances(),
        showTargetDendriteActivity: true,
        showPermananceValues: true
      })
    }

    nLab.next()

  }
})
