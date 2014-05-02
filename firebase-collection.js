if (Meteor.isServer) {
  this.Firebase = Npm.require('firebase');
}

FirebaseCollection = function (url) {
  var self = this;
  LocalCollection.apply(self, arguments);

  self.ref = new Firebase(url);
  self.ref.on('child_added', function (snapshot) {
    self._insert(_.extend(snapshot.val(), {
      _id: snapshot.name()
    }));
  });
  self.ref.on('child_changed', function (snapshot) {
    self._update({ _id: snapshot.name() }, snapshot.val());
  });
  self.ref.on('child_removed', function (snapshot) {
    self._remove({ _id: snapshot.name() });
  });
};

FirebaseCollection.prototype = new LocalCollection();

FirebaseCollection.prototype._insert = LocalCollection.prototype.insert;
FirebaseCollection.prototype._update = LocalCollection.prototype.update;
FirebaseCollection.prototype._remove = LocalCollection.prototype.remove;

FirebaseCollection.prototype.insert = function (document, callback) {
  var id = this.ref.push(_.omit(document, '_id')).name();

  if (callback) {
    Meteor.defer(function () {
      callback(null, id);
    });
  }
  return id;
};

FirebaseCollection.prototype.update = function (selector, modifier, options, callback) {
  var self = this;

  if (!callback && options instanceof Function) {
    callback = options;
    options = null;
  }
  if (!options) options = {};

  if (options.upsert) {
    console.warn('FirebaseCollection.update with the \'upsert\' option is not supported!');
  }

  var documents;
  if (options.multi) {
    documents = self.find(selector).fetch();
  } else {
    documents = [self.findOne(selector)];
  }
  documents.forEach(function (document) {
    var id = document._id;
    LocalCollection._modify(document, modifier);
    self.ref.child(id).set(_.omit(document, '_id'))
  });

  if (callback) {
    Meteor.defer(function () {
      callback(null, documents.length);
    });
  }
  return documents.length;
};

FirebaseCollection.prototype.remove = function (selector, callback) {
  var self = this;

  var documents = self.find(selector).fetch();

  console.log('remove');
  documents.forEach(function (document) {
    self.ref.child(document._id).remove();
  });

  if (callback) {
    Meteor.defer(function () {
      callback(null);
    });
  }
};

FirebaseCollection.prototype.upsert = function () {
  console.warn('FirebaseCollection.upsert is not supported!');
};

FirebaseCollection.prototype.allow = function () {
  console.warn('FirebaseCollection.allow is not supported!');
};

FirebaseCollection.prototype.deny = function () {
  console.warn('FirebaseCollection.deny is not supported!');
};

FirebaseCollection.prototype.stop = function () {
  this.ref.off();
};

