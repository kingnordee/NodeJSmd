const validator = require('validator');
const yargs = require('yargs');
const chalk = require('chalk');
const notes = require('./notes.js')




//create yargs add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {//arguments
        title:{
            describe: 'Note tile',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.addNotes(argv.title, argv.body)
    }
})//********************END OF ADD COMMAND*******************

//create yargs remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title:{
            describe: "target title",
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.removeNote(argv.title)
    }
})//********************END OF REMOVE COMMAND*******************

//create yargs list command
yargs.command({
    command: 'list',
    describe: 'list out all notes',
    handler() {
        notes.listNotes()
    }
})//********************END OF LIST COMMAND*******************

//create yargs read command
yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.readNote(argv.title)
    }
})//********************END OF READ COMMAND*******************

// console.log(yargs.argv);
yargs.parse();
