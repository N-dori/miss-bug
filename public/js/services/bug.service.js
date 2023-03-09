import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  debounce,
  getBugs,
}

function query(filterBy = {}, sortBy={}) {
  // const queryParams=`title=${filterBy.title||''}`
  return axios.get(`/api/bug`,{ params: { ...filterBy, ...sortBy } })
    .then(res => {
      return res.data
    })

}
function getById(bugId) {
  
  return axios.get(`/api/bug/${bugId}`)
  .then(res => res.data)

  
}
function getBugs(){
  return axios.get(`/api/bugs`)
    .then(res => {
      console.log('res',res.data);
      
      return res.data
    })
}
function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}

function remove(bugId) {
  return axios.delete(`/api/bug/${bugId}`)
  .then(res => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(`/api/bug/${bug._id}`, bug)
    .then(res => res.data)
  } else {
    return axios.post(`/api/bug`, bug)
    .then(res => res.data)
  }
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
function setCookie(key, value, daysToLive) {
  const date = new Date();
  date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000))
  let expires = "expires=" + date.toUTCString()
  document.cookie = `${key}=${value};${expires}; path=/`

}