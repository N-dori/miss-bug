'use strict'
import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import bugList from '../cmps/BugList.js'
import bugFilter from '../cmps/BugFilter.js'
import LoginSignup from '../cmps/LoginSignup.js'

export default {
	template: `
    <section class="bug-app">
		<router-link v-if="isAdmin" to="/user/admin">Admin-Zone</router-link> 
	<LoginSignup />
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
		 
		  <select class="sort-by" @change="loadBugs" v-model="sortBy.by">
                <option value="">Select Sorting</option>
                <option value="createdAt">CreatedAt</option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
            </select>
			<label>
				Descending
				<input  class="sort-desc" type="checkbox" @input="onSetDesc" />
			</label>
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>

   <button @click="getPage(-1)">Prev</button>
   <button @click="getPage(1)">Next</button>
	</section>
    `,
	data() {
		return {
			sortBy:{
				by:'',
				desc:1
			  },
			bugs: null,
			filterBy:{ title: '', page: 0, severity: null, labels: null },
			isUserAdmin:null
		}
	},
	created() {
	//this.isUserAdmin=userService.getLoggedInUser()?.isAdmin
		this.loadBUgsLater=bugService.debounce(this.loadBugs,500)
		this.loadBugs()
	},
	methods: {
		loadBugs() {
			console.log('this.filterBy',this.filterBy);
			bugService.query(this.filterBy, this.sortBy)
			.then((bugs) => {
				
				
				this.bugs = bugs
		
			})
		},
		onSetDesc() {
			//HERE
			this.sortBy.desc *= -1
			this.loadBugs()
		},
		setFilterBy(filterBy) {
			console.log('filterBy',filterBy);
			this.filterBy = filterBy
			this.loadBUgsLater()
		},
		removeBug(bugId) {
			bugService.remove(bugId).then(() => this.loadBugs())
		},
		onSort(sortBy){
			console.log('hi');
			
			this.bugs.sort((a,b)=>a.createdAt-b.createdAt)
			
		},
		getPage(diff){
			this.filterBy.page += diff
			if(+this.filterBy.page==0)this.filterBy.page=0
			
			this.loadBugs()
		},isAdmin(){
			this.isUserAdmin=userService.getLoggedInUser().isAdmin
			console.log('isUserAdmin',this.isUserAdmin);
			
			}
	},watch:{
		isUserAdmin(){
			this.isAdmin()
		}
	},
	computed: {
		bugsToDisplay() {
			if (!this.filterBy?.title) return this.bugs
			return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
		},
	},
	components: {
		bugList,
		bugFilter,
		LoginSignup,
	},
}
