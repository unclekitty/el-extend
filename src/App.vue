<template>
  <div id="app">
    <date-picker
      class="m-b-24"
      placeholder="选择日期"
      ref="datePicker"
      align="right"
      v-model="actValue"
      range-separator=" 至 "
      :type="'daterange'"
      :picker-options="pickerOptions"
      :editable="false"></date-picker>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
export default {
  name: 'app',
  components: {
    DatePicker
  },
  data () {
    return {
      actValue: '',
      pickerOptions: {
        disabledDate (time) {
          const start = new Date('2017/1/1')
          const end = new Date()
          end.setTime(new Date().getTime() - 3600 * 1000 * 24 * 2)
          return time.getTime() < start.getTime() || time.getTime() > end.getTime()
        },
        maxRange: 30,
        rangeSeparator: ' 至 '
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
