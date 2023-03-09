'use strict'
import { userService } from "../services/user.service.js"
export default {
  props: ['bug'],
  template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link v-if="isOwner"  :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button v-if="isOwner" @click="onRemove(bug._id)">X</button>
              </article>`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
  },data(){
    return {
      logginUser:null
    }
  },created(){
    this.logginUser=userService.getLoggedInUser()
  },
  
  computed:{
    isOwner(){
      // if(!this.logginUser)return false
      return this.logginUser?._id===this.bug.owner?._id
    }
  }
}
