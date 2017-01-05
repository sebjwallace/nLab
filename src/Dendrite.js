
function Dendrite(sources,target,outputDepolization){

  this.id = 'den-' + randomString(8)

  this.target = target
  this.sources = {}
  this.sourcesArray = []
  this.activeSources = []

  this.threshold = 0.7
  this.outputDepolization = outputDepolization || 1
  this.synapseDecay = 0.01

  this.lastUpdated = -1
  this.lastActivated = -1
  this.onActivation = null

  for(var i = 0; i < sources.length; i++){
    if(sources[i]){
      this.sourcesArray.push(sources[i])
      this.sources[sources[i].id] = 0.42
      sources[i].appendTarget(this)
    }
  }

  target.appendSource(this)

}

Dendrite.prototype.feedforward = function(source){

  if(this.lastUpdated < SYNC.step)
    this.activeSources = []

  if(this.sources[source.id] >= 0.4)
    this.activeSources.push(source)

  if(this.activeSources.length >= (this.sourcesArray.length * this.threshold))
    this.activate()

  this.lastUpdated = SYNC.step

}

Dendrite.prototype.activate = function(){

  if(this.lastActivated == SYNC.step)
    return false
    
  this.target.feedforward(this)

  if(this.onActivation)
    this.onActivation(this)

  this.lastActivated = SYNC.step

}

Dendrite.prototype.backpropagate = function(){

  for(var i in this.sources){
    this.sources[i] -= this.synapseDecay
    if(this.sources[i] <= -(this.synapseDecay * 10))
      delete this.sources[i]
  }

  for(var i = 0; i < this.activeSources.length; i++)
    this.sources[this.activeSources[i].id] += 0.05

}
