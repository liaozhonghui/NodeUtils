/**
 * eventEmitter 使用方式
 * api: 
 * 1. on(event, listener)
 * 2. once(event, listener)
 * 3. emit(event, [arg1], ...)
 * 4. removeListener(event, listener);
 */

const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

function findPattern (files, regex) {
    const emitter = new EventEmitter();
    files.forEach(function (file) {
        fs.readFile(file, 'utf8', (err, content) => {
            if (err) {
                return emitter.emit('error', err);
            }
            emitter.emit('fileread', file)
            let match;
            if (match = content.match(regex)) {
                match.forEach(elem => emitter.emit('found', file, elem));
            }
        })
    });
    return emitter;
}

findPattern(
    ['./resources/urls.txt'],
    /baidu/g
)
 .on('found', (file, elem) => console.log('Matched ' + elem + ' was found in ' + file))
 .on('fileread', (file) => console.log('file ' + file + ' was read'))
 .on('error', (err) => console.log('Error emitted: ' + err.message));

 /**
  * class 方式, extends EventEmitter
  * api: 
  * 1. addFile
  * 2. find
  * 3. return this实现链式调用
  */

class FindPattern extends EventEmitter {
    constructor(regex) {
        super();
        this.regex = regex;
        this.files = [];
    }

    addFile (file) {
        this.files.push(file);
        return this;
    }

    find () {
        this.files.forEach(file => {
            fs.readFile(file, 'utf8', (err, content) => {
                if (err) return this.emit('error', err);

                this.emit('fileread', file);
                let match;
                if (match = content.match(this.regex)) {
                    match.forEach(elem => this.emit('found', file, elem))
                }
            })
        })
        return this;
    }
}
let findPatternObj = new FindPattern (/baidu/g);
findPatternObj
  .addFile('./resources/urls.txt')
  .find()
  .on('found', (file, elem) => console.log('Matched ' + elem + ' was found in ' + file))
  .on('fileread', (file) => console.log('file ' + file + ' was read'))
  .on('error', (err) => console.log('Error emitted: ' + err.message));