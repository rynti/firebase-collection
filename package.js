Package.describe({
  summary: "A reactive solution to use Firebase with Meteor."
});

Npm.depends({ firebase: "1.0.13" });

Package.on_use(function (api) {
  api.export(['FirebaseCollection'], ['client', 'server']);
  api.use(['underscore', 'deps', 'minimongo']);
  api.add_files('firebase-bower/firebase.js', 'client');
  api.add_files('firebase-collection.js', ['client', 'server']);
});
