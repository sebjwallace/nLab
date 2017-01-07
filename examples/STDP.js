
nViz.settings({
  canvas: document.getElementById('canvas'),
  cellSize: 16,
  activeCellColor: 'orange',
  activeDendriteColor: 'rgba(0,0,0,0.8)',
  inactiveDendriteColor: 'rgba(0,0,0,0.2)'
})

var layer = nLab.create.PyramidalNeurons(8)
var modelNeuron = nLab.create.PyramidalNeuron()
var connections = nLab.create.Dendrite(layer,modelNeuron)
connections.threshold = 0.5
connections.synapseDecay = 0.008

nViz.animate({
  keyboardControl: true,
  render: function(){

    nLab.next()

    if(probable(40)){
      for(var i = 0; i < layer.length; i++)
        if(probable(50))
          layer[i].activate()
    } else {
      layer[4].activate()
      layer[5].activate()
      layer[6].activate()
      layer[7].activate()
    }

    nViz.render.cell({
      cell: modelNeuron,
      activated: modelNeuron.isActive(),
      x: 50,
      y: 100
    })

    nViz.render.layer({
      cells: layer.map(function(cell){
        return {
          id: cell.id,
          activated: cell.isActive()
        }
      })
    })

    nViz.render.distalDendrite({
      source: modelNeuron,
      targets: connections.getPermanances(),
      showTargetDendriteActivity: true,
      showPermananceValues: true
    })
  }
})
