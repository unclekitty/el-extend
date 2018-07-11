import ExDatePicker from '@components/DatePicker/DatePicker'
import DatePicker from '@components/DatePicker'

const install = function (Vue) {
  Vue.component(ExDatePicker.name, ExDatePicker)
  Vue.component(DatePicker.name, DatePicker)
}

export default {
  version: '1.0.17',
  install
}