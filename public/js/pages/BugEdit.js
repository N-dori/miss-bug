'use strict'

import { bugService } from '../services/bug.service.js'
import { eventBus } from '../services/event-bus.service.js'

export default {
  template: `
    <section v-if="bug" class="bug-edit">
        <h1>{{(bug._id) ? 'Edit Bug': 'Add Bug'}}</h1>
        <form @submit.prevent="saveBug">
            <label> 
                <span>Title: </span>
                <input type="text" v-model="bug.title" placeholder="Enter title...">
            </label>
            <label>
                <span>Severity: </span>
                <input type="number" v-model="bug.severity" placeholder="Enter severity..." min="0" max="3">
            </label>
            <span >chose label: </span>
            <select v-model="bug.labels">
              <option>need-CR</option>
              <option>dev-branch</option>
              <option>critical</option>
            </select>

            <div class="actions">
              <button type="submit"> {{(bug._id) ? 'Save': 'Add'}}</button>

              <button @click.prevent="closeEdit">Close</button>
            </div>
        </form>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug
        console.log('with id fron edite',this.bug);
      })
    } else {this.bug = bugService.getEmptyBug()
    console.log('fron edite',this.bug);
    
    }
  },
  methods: {
    saveBug() {
    
      if (!this.bug.title || !this.bug.severity) eventBus.emit('show-msg', { txt: 'All fields must be filled out.', type: 'error' })
      else

        bugService.save( {...this.bug} ).then(() => {
          
          eventBus.emit('show-msg', { txt: 'Bug saved successfully', type: 'success' })
          this.$router.push('/bug')
        })
    },
    closeEdit() {
      this.$router.push('/bug')
    },
  },
}
