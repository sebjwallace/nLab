
nViz.settings({
  canvas: document.getElementById('canvas'),
  cellSize: 20,
  randomSegmentOffsetRadiusX: 10,
  randomSegmentOffsetRadiusY: 40,
  activeCellColor: 'orange',
  activeDendriteColor: 'rgba(0,0,0,0.8)',
  inactiveDendriteColor: 'rgba(0,0,0,0.2)'
})

var layer = nLab.create.PyramidalNeurons(12)

var neurons = []
var dendrites = []
for(var i = 0; i < 4; i++){
  var neuron = nLab.create.PyramidalNeuron()
  neurons.push(neuron)
  var dendrite = nLab.create.Dendrite(layer,neuron)
  dendrite.threshold = 0.2
  dendrite.synapseDecay = 0.008
  dendrites.push(dendrite)
}

for(var i = 0; i < neurons.length; i++)
  neurons[i].appendNeighbors('lateral',neurons)

nViz.animate({
  keyboardControl: true,
  render: function(){

    [
      function(){
        for(var i = 0; i < 3; i++)
          layer[i].activate()
      },
      function(){
        for(var i = 3; i < 6; i++)
          layer[i].activate()
      },
      function(){
        for(var i = 6; i < 9; i++)
          layer[i].activate()
      },
      function(){
        for(var i = 9; i < 12; i++)
          layer[i].activate()
      }
    ][randomInt(0,3)]()

    nLab.applyActivations()

    for(var i = 0; i < neurons.length; i++){
      nViz.render.cell({
        cell: neurons[i],
        activated: neurons[i].isActive(),
        potential: neurons[i].potential,
        x: 50 * i,
        y: 150
      })
    }

    nViz.render.layer({
      cells: layer.map(function(cell){
        return {
          id: cell.id,
          activated: cell.isActive()
        }
      })
    })

    for(var i = 0; i < neurons.length; i++){
      nViz.render.distalDendrite({
        source: neurons[i],
        targets: dendrites[i].getPermanances(),
        showTargetDendriteActivity: true,
        showPermananceValues: true
      })
      nViz.render.inhibitionDendrite({
        source: neurons[i],
        targets: neurons[i].getInhibitionTargets(),
        showSourceActivity: true
      })
    }

    nLab.next()

  }
})
