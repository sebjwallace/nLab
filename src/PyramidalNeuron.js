
function PyramidalNeuron(){

  this.id = 'pya-' + randomString(8)

  this.targets = []
  this.sources = []
  this.sourcesIndeces = {}
  this.activeSources = []

  this.lateralNeighbors = []
  this.lateralNeighborsIndeces = {}
  this.proximalNeighbors = []
  this.proximalNeighborsIndeces = {}

  this.potential = 0
  this.influenceFactor = 0.5
  this.lastUpdated = -1
  this.lastActivated = -1
  this.onActivation = null

}

PyramidalNeuron.prototype.feedforward = function(source){

  if(this.lastUpdated < nLab.step){
    this.activeSources = []
    this.potential = 0
  }

  this.activeSources.push(source)
  this.potential += source.outputDepolization

  if(this.potential >= 1 && this.lastActivated != nLab.step)
    this.inhibitLateralNeighbors()
  nLab.registerDepolarizedCell(this)

  this.lastUpdated = nLab.step

}

PyramidalNeuron.prototype.activate = function(){

  if(this.lastActivated == nLab.step)
    return false

  this.growDendrites()

  this.propagate()
  this.backpropagate()

  if(this.onActivation)
    this.onActivation(this)

  this.lastActivated = nLab.step

}

PyramidalNeuron.prototype.deactivate = function(){

  if(this.potential >= 1)
    this.backpropagate(false)

}

PyramidalNeuron.prototype.propagate = function(){

  for(var i = 0; i < this.targets.length; i++)
    this.targets[i].feedforward(this)

}

PyramidalNeuron.prototype.backpropagate = function(){

  for(var i = 0; i < this.activeSources.length; i++)
    if(this.activeSources[i])
      this.activeSources[i].backpropagate()

}

PyramidalNeuron.prototype.inhibit = function(factor){

  this.potential -= factor

}

PyramidalNeuron.prototype.inhibitLateralNeighbors = function(){

  for(var i = 0; i < this.lateralNeighbors.length; i++)
    this.lateralNeighbors[i].inhibit(this.potential * this.influenceFactor)

}

PyramidalNeuron.prototype.growDendrites = function(){

  var sources = []
  var max = randomInt(this.proximalNeighbors.length/4,this.proximalNeighbors.length)
  max = this.proximalNeighbors.length ? 0 : max

  for(var i = 0; i < max; i++){
    var cell = this.proximalNeighbors[randomInt(0,this.proximalNeighbors.length-1)]
    sources.push(cell)
  }

  var dendrite = new Dendrite(sources,this)

}

PyramidalNeuron.prototype.appendNeighbor = function(type,cell){

  if(!cell) return false
  if(!cell.id || cell.id == this.id) return false

  this[type+'Neighbors'].push(cell)
  this[type+'NeighborsIndeces'][cell.id] = cell

}

PyramidalNeuron.prototype.appendNeighbors = function(type,cells){

  for(var i = 0; i < cells.length; i++)
    this.appendNeighbor(type,cells[i])

}

PyramidalNeuron.prototype.appendSource = function(cell){

  this.sources.push(cell)
  this.sourcesIndeces[cell.id] = cell

}

PyramidalNeuron.prototype.appendTarget = function(dendrite){

  this.targets.push(dendrite)

}

PyramidalNeuron.prototype.isActive = function(){

  return this.lastActivated == nLab.step

}

PyramidalNeuron.prototype.getInhibitionTargets = function(){

  return this.lateralNeighbors

}
