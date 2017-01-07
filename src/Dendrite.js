
function Dendrite(sources,target,outputDepolization){

  this.id = 'den-' + randomString(8)

  this.target = target
  this.sources = {}
  this.sourcesArray = []
  this.activeSources = []

  this.threshold = 0.7
  this.permananceThreshold = 0.4
  this.outputDepolization = outputDepolization || 1
  this.synapseDecay = 0.001

  this.lastUpdated = -1
  this.lastActivated = -1
  this.onActivation = null

  for(var i = 0; i < sources.length; i++){
    if(sources[i]){
      this.sourcesArray.push(sources[i])
      this.sources[sources[i].id] = this.permananceThreshold + 0.02
      sources[i].appendTarget(this)
    }
  }

  target.appendSource(this)

}

Dendrite.prototype.feedforward = function(source){

  if(this.lastUpdated < nLab.step)
    this.activeSources = []

  if(this.sources[source.id] >= this.permananceThreshold)
    this.activeSources.push(source)

  if(this.activeSources.length >= (this.sourcesArray.length * this.threshold))
    this.activate()

  this.lastUpdated = nLab.step

}

Dendrite.prototype.activate = function(){

  if(this.lastActivated == nLab.step)
    return false

  this.target.feedforward(this)

  if(this.onActivation)
    this.onActivation(this)

  this.lastActivated = nLab.step

}

Dendrite.prototype.backpropagate = function(){

  for(var i in this.sources){
    this.sources[i] -= this.synapseDecay
    if(this.sources[i] <= -(this.synapseDecay * 10))
      delete this.sources[i]
  }

  for(var i = 0; i < this.activeSources.length; i++)
    this.sources[this.activeSources[i].id] += (this.synapseDecay * 2)

}

Dendrite.prototype.resetPermanances = function(){

  for(var i in this.sources)
    this.sources[i] = this.permananceThreshold + 0.02

}

Dendrite.prototype.randomizePermanances = function(){

  for(var i in this.sources)
    this.sources[i] = Math.random()

}

Dendrite.prototype.getPermanances = function(){

  var permanances = []

  for(var i = 0; i < this.sourcesArray.length; i++){
    permanances.push({
      id: this.sourcesArray[i].id,
      cell: this.sourcesArray[i],
      permanance: this.sources[this.sourcesArray[i].id],
      permananceThreshold: this.permananceThreshold
    })
  }

  return permanances

}
