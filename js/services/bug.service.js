const gBugs = require('../../data/bug.json')
const fs = require('fs')
module.exports = {
    query,
    getById,
    remove,
    save,
    getBugs
}
const PAGE_SIZE = 3
console.log('gBugs',gBugs[0]);
console.log('gBugs',gBugs[1]);
console.log('gBugs',gBugs[2]);

function getBugs(){
    return Promise.resolve(gBugs)
}
function query(filterBy = { title: '', page: 0, createdAt: null, severity: null }, sortBy) {
    sortBy.by === 'title'
    ? gBugs.sort((bug1, bug2) => (bug1[sortBy.by].localeCompare(bug2[sortBy.by])) * sortBy.desc)
    : gBugs.sort((bug1, bug2) => (bug1[sortBy.by] - bug2[sortBy.by]) * sortBy.desc)
    
    const regex = new RegExp(filterBy.title, 'i')
    let bugs = gBugs.filter(bug => (regex.test(bug.title)) )
                     
    if (filterBy.severity) {
        bugs = bugs.filter(bug => +bug.severity === +filterBy.severity)
    }

    if (filterBy.labels) {
        bugs = bugs.filter(bug => {
            return filterBy.labels.some(label => bug.labels.includes(label))
        })
    }

        const totalPages = Math.ceil(gBugs.length / PAGE_SIZE)
        const startIdx = filterBy.page * PAGE_SIZE
        bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
        console.log('bugs',bugs);

    return Promise.resolve(bugs)

}
function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)

}
function remove(bugId) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Unknow bug')
    if (gBugs[idx].owner._id !== loggedinUser._id) return Promise.reject('Not your bug')
    gBugs.splice(idx, 1)
    return _saveCarsToFile()

}
function save(bug,loggedinUser) {
    var savedBug
    if (bug._id) {
        savedBug = gBugs.find(currBug => currBug._id === bug._id)
        if (!savedBug) return Promise.reject('Unknow bug')
        if (savedBug.owner._id !== loggedinUser._id) return Promise.reject('Not your bug')
        savedBug.title = bug.title
        savedBug.severity = bug.severity
        return Promise.resolve(savedBug)
    } else {
        savedBug = {
            _id: _makeId(),
            owner : loggedinUser,
            title: bug.title,
            severity: bug.severity
        }
        gBugs.push(savedBug)
    }
    return _saveCarsToFile().then(() => {
        return savedBug
    })
}
function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveCarsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}