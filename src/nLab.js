
function nLab(){

  var index = {
    neuronsArray : [],
    neuronsObj : {},
    dendritesArray : [],
    dendritesObj : {},
    depolarizedCells : []
  }

  function construct(fn,args){
    var obj = Object.create(fn.prototype)
    fn.apply(obj,args)
    return obj
  }

  return {

    step: 1,

    next: function(){
      nLab.applyActivations()
      nLab.step++
    },

    registerNeuron: function(neuron){
      if(!index.neuronsObj[neuron.id]){
        index.neuronsObj[neuron.id] = neuron
        index.neuronsArray.push(neuron)
      }
    },

    registerDendrite: function(dendrite){
      if(!index.dendritesObj[dendrite.id]){
        index.dendritesObj[dendrite.id] = dendrite
        index.dendritesArray.push(dendrite)
      }
    },

    registerDepolarizedCell: function(cell){
      index.depolarizedCells.push(cell)
    },

    applyActivations: function(){
      var cells = index.depolarizedCells
      for(var i = 0; i < cells.length; i++)
        if(cells[i].potential >= 1)
          cells[i].activate()
      index.depolarizedCells = []
    },

    get: {

      allNeurons: function(asObj){
        return asObj ? index.neuronsObj : index.neuronsArray
      },

      allDendrites: function(asObj){
        return asObj ? index.dendritesObj : index.dendritesArray
      }

    },

    create: {

      Dendrite: function(){
        var dendrite = construct(Dendrite,arguments)
        nLab.registerDendrite(dendrite)
        return dendrite
      },

      PyramidalNeuron: function(){
        var neuron = construct(PyramidalNeuron,arguments)
        nLab.registerNeuron(neuron)
        return neuron
      },

      PyramidalNeurons: function(nCells){
        var cells = []
        for(var i = 0; i < nCells; i++)
          cells[i] = nLab.create.PyramidalNeuron()
        return cells
      }

    }

  }

}

var nLab = nLab()
