
nViz.settings({
  canvas: document.getElementById('canvas'),
  cellSize: 20,
  activeCellColor: 'orange',
  activeDendriteColor: 'rgba(0,0,0,0.8)',
  inactiveDendriteColor: 'rgba(0,0,0,0.2)'
})

var layer = nLab.create.PyramidalNeurons(10)

var neuronA = nLab.create.PyramidalNeuron()
var dendriteA = nLab.create.Dendrite(layer,neuronA)
dendriteA.threshold = 0.4
dendriteA.synapseDecay = 0.008

var neuronB = nLab.create.PyramidalNeuron()
var dendriteB = nLab.create.Dendrite(layer,neuronB)
dendriteB.threshold = 0.4
dendriteB.synapseDecay = 0.008

neuronA.appendNeighbor('lateral',neuronB)
neuronB.appendNeighbor('lateral',neuronA)

nViz.animate({
  keyboardControl: true,
  render: function(){

    if(probable(50)){
      layer[5].activate()
      layer[6].activate()
      layer[7].activate()
      layer[8].activate()
      layer[9].activate()
    } else {
      layer[0].activate()
      layer[1].activate()
      layer[2].activate()
      layer[3].activate()
      layer[4].activate()
    }

    nLab.applyActivations()

    nViz.render.cell({
      cell: neuronA,
      activated: neuronA.isActive(),
      x: 20,
      y: 150
    })

    nViz.render.cell({
      cell: neuronB,
      activated: neuronB.isActive(),
      x: 180,
      y: 150
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
      source: neuronA,
      targets: dendriteA.getPermanances(),
      showTargetDendriteActivity: true,
      showPermananceValues: true
    })

    nViz.render.distalDendrite({
      source: neuronB,
      targets: dendriteB.getPermanances(),
      showTargetDendriteActivity: true,
      showPermananceValues: true
    })

    nViz.render.inhibitionDendrite({
      source: neuronA,
      targets: neuronA.getInhibitionTargets(),
      showSourceActivity: true
    })

    nViz.render.inhibitionDendrite({
      source: neuronB,
      targets: neuronB.getInhibitionTargets(),
      showSourceActivity: true
    })

    nLab.next()

  }
})
