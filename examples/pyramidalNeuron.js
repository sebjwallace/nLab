
var SYNC = {
  step: 1
}

var feedforwardNeurons = []
for(var i = 0; i < 8; i++)
feedforwardNeurons[i] = new PyramidalNeuron()

var feedbackNeurons = []
for(var i = 0; i < 8; i++)
  feedbackNeurons[i] = new PyramidalNeuron()

var contextNeurons = []
for(var i = 0; i < 8; i++)
  contextNeurons[i] = new PyramidalNeuron()

var modelNeuron = new PyramidalNeuron()
var feedforwardDendrite = new Dendrite(feedforwardNeurons,modelNeuron,0.8)
var feedbackDendrite = new Dendrite(feedbackNeurons,modelNeuron,0.2)
var contextDendrite = new Dendrite(contextNeurons,modelNeuron,0.2)

nViz.settings({
  canvas: document.getElementById('canvas'),
  cellSize: 16,
  activeCellColor: 'blue',
  activeDendriteColor: 'rgba(0,0,0,0.8)',
  inactiveDendriteColor: 'rgba(0,0,0,0.2)'
})

nViz.animate({
  keyboardControl: true,
  render: function(){

    SYNC.step++

    for(var i = 0; i < feedforwardNeurons.length; i++)
      if(probable(80))
        feedforwardNeurons[i].activate()

    for(var i = 0; i < feedbackNeurons.length; i++)
      if(probable(50))
        feedbackNeurons[i].activate()

    for(var i = 0; i < contextNeurons.length; i++)
      if(probable(50))
        contextNeurons[i].activate()

    nViz.render.cell({
      id: modelNeuron.id,
      x: 100,
      y: 80,
      activated: modelNeuron.isActive()
    })

    nViz.render.layer({
      cells: feedforwardNeurons.map(function(cell){
        return {
          id: cell.id,
          activated: cell.isActive()
        }
      }),
      cellMargin: 1,
      offsetX: 40,
      offsetY: 220
    })

    nViz.render.column({
      cells: feedbackNeurons.map(function(cell){
        return {
          id: cell.id,
          activated: cell.isActive()
        }
      }),
      cellMargin: 1
    })

    nViz.render.column({
      cells: contextNeurons.map(function(cell){
        return {
          id: cell.id,
          activated: cell.isActive()
        }
      }),
      cellMargin: 1,
      offsetX: 200
    })

    nViz.render.proximalDendrite({
      source: modelNeuron,
      targets: feedforwardNeurons,
      activeColumn: modelNeuron.isActive()
    })

    nViz.render.distalDendrite({
      source: modelNeuron,
      targets: feedbackNeurons
    })

    nViz.render.distalDendrite({
      source: modelNeuron,
      targets: contextNeurons
    })

  }
})
