
const express = require('express')
const app = express()
const port = 3030
const bugService = require('./js/services/bug.service')
const userService= require('./js/services/user.service')
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

app.get('/api/bugs', (req, res) => {
bugService.getBugs()
.then(bugs=>{
    console.log(bugs)
  
  res.send(bugs)
}
)
})
app.get('/api/loggedinUser', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add car')
  return loggedinUser
})
app.get('/api/bug', (req, res) => {
 
  const filterBy = {
          title: req.query.title || '' ,  
      severity: req.query.severity || null,
      page:+req.query.page || 0,
      createdAt: req.query.createdAt || 1,
      labels: req.query.labels || null,
     }
     const sortBy = {
      by: req.query.by || 'title',
      desc: +req.query.desc || 1
  }
  console.log('filterBy', filterBy);

  bugService.query(filterBy,sortBy)
    .then(bugs =>
      res.send(bugs))
    .catch((err) => {
      res.status(400).send('cant load bug', err)
    })
})
app.put('/api/bug/:bugId', (req, res) => {
  const  { page,severity,title,_id }=req.body
  const bug={page,
            severity,
            title,
            _id,
           }
 
  bugService.save(bug)
    .then(savedBug =>
      res.send(savedBug))
    .catch((err) => {
      res.status(400).send('cant save bug', err)
    })
})
app.post('/api/bug', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add car')
  const  { page,severity,title }=req.body
  const bug={page,
            severity,
            title,
           }
 
  bugService.save(bug,loggedinUser)
    .then(savedBug =>
      res.send(savedBug))
    .catch((err) => {
      res.status(400).send('cant save bug', err)
    })
})

app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  const visitedBugs = req.cookies.visitedBugs || []
  console.log(bugId)
  console.log(visitedBugs)

  if (visitedBugs.length > 3) {
    console.log(`User visited the following bugs: ${visitedBugs}`)
    return res.status(401).send('Wait for a bit')
  }
  if (!visitedBugs.includes(bugId)) {
    visitedBugs.push(bugId)
  }
  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

  bugService.getById(bugId).then(bug =>
    res.send(bug))

    .catch((err) => {
      res.status(400).send('cant load bug', err)
    })
})

app.delete('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  bugService.remove(bugId)
    .then(() => res.send('ok=deleted'))

    .catch((err) => {
      res.status(400).send('cant remove bug', err)
    })
})

app.listen(port, () => {
  console.log(`missBug app listening on http://localhost:${port}`)
})

// generic users api
// Users

// Users

app.get('/api/user', (req, res) => {

  userService.query()
      .then(users => {
          res.send(users)
      })
      .catch((err) => {
          console.log('Error:', err)
          res.status(400).send('Cannot load users')
      })

})

app.put('/api/user/:userId', (req, res) => {
  const { _id, username, fullname, password } = req.body
  const user = { _id, username, fullname, password }

  userService.save(user)
      .then(savedUser => {
          res.send(savedUser)
      })
      .catch(err => {
          console.log('Cannot save user, Error:', err)
          res.status(400).send('Cannot save user')
      })
})

app.post('/api/user', (req, res) => {
  const { username, fullname, password } = req.body
  const user = { username, fullname, password }

  userService.save(user)
      .then(savedUser => {
          res.send(savedUser)
      })
      .catch(err => {
          console.log('Cannot save user, Error:', err)
          res.status(400).send('Cannot save user')
      })
})

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  userService.getById(userId)
      .then(user => {
          res.send(user)
      })
      .catch((err) => {
          console.log('Error:', err)
          res.status(400).send('Cannot load user')
      })
})

app.delete('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  userService.remove(userId)
      .then(() => {
          res.send('OK, deleted')
      })
      .catch((err) => {
          console.log('Error:', err)
          res.status(400).send('Cannot remove user')
      })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
  const credentials = req.body
  userService.checkLogin(credentials)
      .then(user => {
          if (user) {
              const loginToken = userService.getLoginToken(user)
              res.cookie('loginToken', loginToken)
              res.send(user)
          } else {
              res.status(401).send('Invalid Credentials')
          }
      })
})
app.post('/api/auth/signup', (req, res) => {
  const credentials = req.body
  userService.save(credentials)
      .then(user => {
          if (user) {
              const loginToken = userService.getLoginToken(user)
              res.cookie('loginToken', loginToken)
              res.send(user)
          } else {
              res.status(401).send('Invalid Credentials')
          }
      })
})
