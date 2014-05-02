# Firebase Collection

## Description

Firebase Collection is a simple library that wraps the Firebase API in reactive LocalCollections. This allows developers to use the familiar Minimongo API with a Firebase backend, on the server as well as the client.

**This package is still in early development, use with caution in production environments!**


## Data structure

In order to make the transition between MongoDB and Firebase as easy as possible, I decided to only support a particular subset of Firebase: Lists of objects. This means that a FirebaseCollection always has to be a reference to a [list of data](https://www.firebase.com/docs/managing-lists.html). FirebaseCollection will transparently add an `_id` attribute to every child, containing the index of the child. This allows for matching behaviour with MongoDB collections.

Your Firebase list therefore corresponds to a MongoDB collection, whereas every child of the Firebase list corresponds to a MongoDB document. Here's an example of a list of users:

![FirebaseCollection representation example](https://github.com/rynti/firebase-collection/raw/master/example.png)


## Example

```javascript
// You can create a new Firebase Collection very similar to the original Firebase API:
Users = new FirebaseCollection(YOUR_FIREBASE_REFERENCE_URL);

// FirebaseCollections support most of the regular LocalCollection API:
var allFoobars = Users.find({ name: 'Foo Bar' }).fetch();
var oneFoobar = Users.findOne({ name: 'Foo Bar' });
var newFoobarId = Users.insert({ name: 'Foo Bar' });
var foobarChanged = Users.update({ name: 'Foo Bar' }, { name: 'Mr. Foo Bar' }, { multi: true });

// These methods however are not supported:
// - Users.allow(...)
// - Users.deny(...)
// - Users.upsert(...)
// - Users.update(selector, modifier, { upsert: true })

// FirebaseCollections are reactive:
Deps.autorun(function () {
  // This will re-run everytime the Users-collection changes:
  console.log('User count: ' + Users.find({}).count());
});
```

## About livedata

This package does not depend on livedata or any related packages, thus it can be used without persistent connections to the server. Be aware, though, that the default *webapp* package does depend on livedata, so an alternative has to be used in order to completely avoid any DDP-connection.


## License information

Firebase Collection is released under the terms of the MIT License:

```
The MIT License (MIT)

Copyright (c) 2014 Robert Böhm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

