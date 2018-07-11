import DatePicker from '@components/DatePicker'

const install = function (Vue) {
  console.log(`==========${DatePicker.name}=====`, DatePicker)
  Vue.components(DatePicker.name, DatePicker)
}

export default {
  version: '1.0.6',
  install
}