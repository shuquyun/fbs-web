Array.prototype.move = function(oldIndex, newIndex) {
  if (newIndex < this.length && newIndex >= 0) {
    this.splice(newIndex, 0, this.splice(oldIndex, 1)[0])
  }

  return this
}
