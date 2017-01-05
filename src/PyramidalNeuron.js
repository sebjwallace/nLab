
function PyramidalNeuron(){

  this.id = 'pya-' + randomString(8)

  this.targets = []
  this.sources = []
  this.sourcesIndeces = {}
  this.activeSources = []

  this.neighbors = []
  this.neighborsIndeces = {}

  this.potential = 0
  this.influenceFactor = 0.5
  this.lastUpdated = -1
  this.lastActivated = -1
  this.onActivation = null

}

PyramidalNeuron.prototype.feedforward = function(source){

  if(this.lastUpdated < SYNC.step){
    this.activeSources = []
    this.potential = 0
  }

  this.activeSources.push(source)
  this.potential += source.outputDepolization

  if(this.potential >= 1)
    this.activate()

  this.lastUpdated = SYNC.step

}

PyramidalNeuron.prototype.activate = function(){

  if(this.lastActivated == SYNC.step)
    return false

  this.growDendrites()

  this.propagate()
  this.backpropagate()

  if(this.onActivation)
    this.onActivation(this)

  this.lastActivated = SYNC.step

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

PyramidalNeuron.prototype.inhibit = function(){

  for(var i = 0; i < this.neighbors.length; i++)
    this.neighbors[i].influence(-(this.potential * this.influenceFactor))

}

PyramidalNeuron.prototype.growDendrites = function(){

  var sources = []
  var max = randomInt(this.neighbors.length/4,this.neighbors.length)
  max = this.neighbors.length ? 0 : max

  for(var i = 0; i < max; i++){
    var cell = this.neighbors[randomInt(0,this.neighbors.length-1)]
    sources.push(cell)
  }

  var dendrite = new Dendrite(sources,this)

}

PyramidalNeuron.prototype.appendNeighbor = function(cell){

  if(!cell) return false
  if(!cell.id || cell.id == this.id) return false

  this.neighbors.push(cell)
  this.neighborsIndeces[cell.id] = cell

}

PyramidalNeuron.prototype.appendNeighbors = function(cells){

  for(var i = 0; i < cells.length; i++)
    this.appendNeighbor(cells[i])

}

PyramidalNeuron.prototype.appendSource = function(cell){

  this.sources.push(cell)
  this.sourcesIndeces[cell.id] = cell

}

PyramidalNeuron.prototype.appendTarget = function(dendrite){

  this.targets.push(dendrite)

}

PyramidalNeuron.prototype.isActive = function(){

  return this.lastActivated == SYNC.step

}
