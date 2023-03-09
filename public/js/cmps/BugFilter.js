'use strict'

export default {
  template: `
        <section class="bug-filter">
            <span>Filter by title </span>
            <input @input="setFilterBy" type="text" v-model="filterBy.title">
            <span>level of severity </span>
            <input @input="setFilterBy" type="number" min="-1" max="3" v-model="filterBy.severity">
            <span>labels </span>

            <select  v-model="filterBy.labels" multiple>
              <option value="need-CR" >need-CR</option>
              <option value="dev-branch">dev-branch</option>
              <option value="critical">critical</option>
            </select>
            <button @click="setFilterBy">Submit</button>
          </section>


    `,
  data() {
    return {
      filterBy: {
        title: '',
        severity:1,
        page:0,
        labels:[],
       
      }, 
     
      
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    }
  },emits:['setFilterBy']
}
