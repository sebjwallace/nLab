
function nLab(){

  function construct(fn,args){
    var obj = Object.create(fn.prototype)
    fn.apply(obj,args)
    return obj
  }

  return {

    step: 1,

    next: function(){
      nLab.step++
    },

    create: {

      Dendrite: function(){
        return construct(Dendrite,arguments)
      },

      PyramidalNeuron: function(){
        return construct(PyramidalNeuron,arguments)
      },

      PyramidalNeurons: function(nCells){
        var cells = []
        for(var i = 0; i < nCells; i++)
          cells[i] = new PyramidalNeuron()
        return cells
      }

    }

  }

}

var nLab = nLab()
