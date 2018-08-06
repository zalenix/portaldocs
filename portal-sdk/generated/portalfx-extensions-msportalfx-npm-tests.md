
<a name="running-npm-tests"></a>
## Running npm tests

Your development environment may have two versions of **mocha** installed: one globally and one locally. The global version can be installed with the command `npm install -g mocha`. The local version can be installed with the following commands.

```
  rm -rf node_modules/mocha
  npm install --save-dev mocha
```
  
**NOTE**: The first command removes any local versions of **mocha** from your development computer.

The local installation provides a working local copy of mocha with all its dependencies, including **commander**.  It calls the command specified in the `scripts.test` property of `package.json`, and it also sets up certain environment variables, such as PATH so you can refer to commands that only exist within your `node_modules` directory, but are not installed globally.

After **mocha** is installed, you can open a command prompt in the `node_modules` directory and run the following command.

```
  npm install --no-optional
  npm test
```

When you run a script through npm, either as `npm run-script <name>` or with a defined shortcut like  `npm test` or `npm start`, the command will locate the test script in your file system. The test script should be located in the current package directory's `bin` directory. The npm commands will prepend the current package directory's `bin` directory to the front of the PATH variable. For your package, the string is probably `./node_modules/.bin/`, which contains the link to your package's **mocha** executable script.

**NOTE**: Remember to add **commander** to your `package.json`. If it is not in `package.json`,  the `npm test` may fail with an error that specifies that it cannot find module 'commander', although everything runs when the command  `mocha tests/spec.js` is used instead. Incorrect installs
of **commmander** may result in errors that specify `Cannot find module 'glob'`. After installing **glob**, the error changes to `Error: Cannot find module '../'`.