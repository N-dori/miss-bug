import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  debounce,
}

function query() {

  
  return storageService.query(STORAGE_KEY)
}

function getById(bugId) {
  return storageService.get(STORAGE_KEY, bugId)
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}

function remove(bugId) {
  return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  if (bug._id) {
    return storageService.put(STORAGE_KEY, bug)
  }
  return storageService.post(STORAGE_KEY, bug)
}
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer); // clear any pre-existing timer
    }
    const context = this; // get the current context
    timer = setTimeout(() => {
      fn.apply(context, args); // call the function if time expires
    }, wait);
  }
}
