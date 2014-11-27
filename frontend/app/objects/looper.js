import Ember from 'ember';

export default Ember.Object.extend({
  seconds : 1,
  interval: function() {
    return this.get('seconds')*1000;
  }.property('seconds').readOnly(),
  schedule: function(f) {
    return Ember.run.later(this, function() {
      f.apply(this);
      this.set('timer', this.schedule(f));
    }, this.get('interval'));
  },
  stop: function() {
    Ember.run.cancel(this.get('timer'));
  },
  start: function() {
    this.set('timer', this.schedule(this.get('onTick')));
  },
  onTick: function(){
  }
});
