import DatePicker from '@components/DatePicker'

const install = function (Vue) {
  Vue.components(DatePicker.name, DatePicker)
}

module.exports = {
  version: '1.0.2',
  install
}

module.exports.default = module.exports;