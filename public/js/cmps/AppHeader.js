'use strict'
import {userService} from '../../../js/services/user.service.js'
import LoginSignup from './LoginSignup.js'
export default {
  template: `
        <header>
            <h1>Miss Bug</h1>    
        
            <hr />
            <section v-if="loggedinUser">
                <RouterLink :to="'/user/' + loggedinUser._id">
                    {{ loggedinUser.fullname }}
                </RouterLink>
                <button @click="logout">Logout</button>
            </section>
            <section v-else>
                <LoginSignup @onChangeLoginStatus="changeLoginStatus" />
            </section>
        </header>
    `, data() {
        return {
            loggedinUser: userService.getLoggedInUser()
        }
    },
    created(){
        console.log('loggedinUser',this.loggedinUser);
        
    },
    methods: {
        changeLoginStatus() {
            this.loggedinUser = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    
                    this.$router.push('/bug')
                    this.loggedinUser = null
                    console.log('appHeader hi');
                })
        },
    },
    components: {
        LoginSignup
    }
}
