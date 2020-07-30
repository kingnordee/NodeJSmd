const fs = require('fs')
const chalk = require('chalk')

const listNotes = () => {
    const notes = loadNotes()
    console.log(chalk.yellow("Your notes: "))
    notes.forEach(note => {
        console.log(chalk.blue(note.title))
    })
}

const readNote = (title) => {
    const notes = loadNotes()
    const found = notes.find(note => {
        return note.title === title
    })
    if(!found){
        console.log(chalk.red(`There's no note titled "${title}"`))
    }else{
        console.log(chalk.magenta(`${found.title}:`))
        console.log(chalk.cyan(found.body))
    }
}

const addNote = (title, body) => {
    const notes = loadNotes()
    const duplicateNote = notes.find((note) => {
        return note.title === title//find => stops once a duplicate is found
    })

    debugger

    if(!duplicateNote){//if find didn't find a duplicate
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes);
        console.log(chalk.rgb(0,255,0)("New note added!"))
    }else{
        console.log(chalk.rgb('Note title already exists!'))
    }
}//********************END OF ADD NOTE*******************

const saveNotes = (notes) => {
    const dataJson = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJson)
}//********************END OF SAVE NOTE*******************

const loadNotes = () => {
    try{
        const dataBuffer = fs.readFileSync('notes.json')//comes in byte codes
        const dataJson = dataBuffer.toString()//convert from byte code
        return JSON.parse(dataJson)
    }catch (e){
        return [];
    }
}

const removeNote = (title) => {
    const notes = loadNotes()
    const nonTarget = notes.filter(note => {
        return note.title !== title
    })
    if(nonTarget.length !== notes.length){
        saveNotes(nonTarget)
        console.log(chalk.green(`Note titled "${title}" has been successfully removed!`))
    }else console.log(chalk.rgb(255, 0, 0)(`There's no note titled "${title}"`))
}

module.exports = {
    listNotes: listNotes,
    readNote: readNote,
    addNotes: addNote,
    removeNote: removeNote
}
