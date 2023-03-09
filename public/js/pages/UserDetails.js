import { userService } from "../../js/services/user.service.js"
import { bugService } from "../services/bug.service.js"
import BugList from "../cmps/BugList.js"
export default {
    template: `
        <section v-if="isMyProfile" class="user-details" v-if="user">
            <h5 >My Profile</h5>
            <pre>{{user}}</pre> 
            <h4>user bugs</h4>   
          <BugList v-if="bugs" :bugs="bugs"/>
        </section>
    `,
    data() {
        return {
            bugs:null,
            loggedinUser: userService.getLoggedInUser(),
            user: null
        }
    },
    created() {
        this.loadUser()
        this.loadBugs()
    },
    computed: {
        userId() {
            return this.$route.params.userId
        },
        isMyProfile() {
            if (!this.loggedinUser) return false
            return this.loggedinUser._id === this.user._id
        }
    },
    watch: {
        bugs(){
        
            
        },
        userId() {
            this.loadUser()
        }
    },
    methods: {
        loadUser() {
            userService.get(this.userId)
                .then(user => this.user = user)
        },
      loadBugs(){
            bugService.getBugs()
                .then(bugs => {bugs=bugs.filter(bug=>bug.owner?._id===this.loggedinUser._id)
                    console.log('bugs',bugs);
                    this.bugs=bugs
                })
              
        }
       
    },components:{
        BugList,

    }
}