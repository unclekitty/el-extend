const DatePicker = require('@components/DatePicker')

const install = function (Vue) {
  console.log(`==========${DatePicker.name}=====`, DatePicker)
  Vue.components(DatePicker.name, DatePicker)
}

module.exports = {
  version: '1.0.4',
  install
}

module.exports.default = module.exports;