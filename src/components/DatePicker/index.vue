<template>
  <div class="dropdown" ref="reference" v-clickoutside="close">
    <el-dropdown ref="dropdown" trigger="click" @command="handleCommand">
      <el-button :size="'small'" class="el-dropdown-link">
        {{displayValue || '选择日期'}}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in shortcuts"
          :key="index"
          :command="{item, index}"
          :class="{'active': selectedIndex == index}">{{item.text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <ex-date-picker v-show="false"
      class="m-b-24"
      placeholder="选择日期"
      ref="datePicker"
      align="right"
      v-model="actValue"
      range-separator=" 至 "
      :type="dateType"
      :picker-options="pickerOptions"
      :editable="false"
      :shortcuts="shortcuts"></ex-date-picker>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Popper from 'element-ui/src/utils/vue-popper'
import merge from 'element-ui/src/utils/merge'
import ElButton from 'element-ui/packages/button'
import ElDropdown from 'element-ui/packages/dropdown'
import ElDropdownMenu from 'element-ui/packages/dropdown-menu'
import ElDropdownItem from 'element-ui/packages/dropdown-item'
import ExDatePicker from './DatePicker'


const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding
  },
  methods: Popper.methods,
  data () {
    return merge({ visibleArrow: false }, Popper.data)
  },
  beforeDestroy: Popper.beforeDestroy
}

export default {
  mixins: [NewPopper],
  name: 'DatePicker',
  components: {
    ElButton,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ExDatePicker,
  },
  directives: {
    Clickoutside
  },
  computed: {
    displayValue () {
      let val = ''
      if (this.selectType === 0 || this.selectType === 1) {
        val = this.dispalyName
      }
      if (this.selectType === 2 || this.selectType === 3) {
        val = this.$refs.datePicker.displayValue
      }
      return val
    }
  },
  props: {
    date: {
      type: [Array, Date, Number, String, Object],
      default: null
    }
  },
  data () {
    let self = this
    return {
      actValue: '',
      dispalyName: '',
      selected: null,
      selectType: 1,
      selectedIndex: 1,
      dateType: 'daterange',
      shortcuts: [{
        text: '最近7天',
        type: 0,
        onClick (picker) {
          self.dateType = 'daterange'
          self.selectType = this.type
          const start = new Date()
          const end = new Date()
          start.setTime(new Date().getTime() - 3600 * 1000 * 24 * 8)
          end.setTime(new Date().getTime() - 3600 * 1000 * 24 * 2)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近30天',
        type: 1,
        onClick (picker) {
          self.dateType = 'daterange'
          self.selectType = this.type
          const start = new Date()
          const end = new Date()
          start.setTime(new Date().getTime() - 3600 * 1000 * 24 * 32)
          end.setTime(new Date().getTime() - 3600 * 1000 * 24 * 2)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '自选日期段',
        type: 3,
        onClick (picker) {
          self.dateType = 'daterange'
          self.selectType = this.type
          self.show(picker)
        }
      }],
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
  },
  mounted () {
    let datePicker = this.$refs.datePicker
    let defaultShortcut = this.shortcuts[this.selectedIndex]
    // set default
    if (this.date) {
      let start = new Date(this.date.range[0])
      let end = new Date(this.date.range[1])
      // 设置选中vuex中日期
      datePicker.picker.$emit('pick', [start, end])
      this.selectType = this.date.selectType
      this.shortcuts.forEach((item, index) => {
        if (item.type === this.selectType) {
          this.dispalyName = item.text
          this.selectedIndex = index
        }
      })
    } else {
      // 设置选择第一个快捷方式
      this.dispalyName = defaultShortcut.text
      defaultShortcut.onClick(datePicker.picker)
    }
    //
    this.popperElm = datePicker.picker.$el
    this.placement = datePicker.placement
    this.popperOptions = datePicker.popperOptions
    //
  },
  watch: {
    actValue (val) {
      if (val) {
        if (val.constructor === Date) {
          val = [val]
        }
        this.$emit('date-change', val, this.selectType)
        this.$emit('getDate', val) // old
      }
      this.close()
    }
  },
  methods: {
    handleCommand ({item, index}) {
      this.dispalyName = item.text
      this.selectedIndex = index
      item.onClick(this.$refs.datePicker.picker)
    },
    show (picker) {
      setTimeout(() => {
        picker.visible = true
        this.updatePopper ? this.updatePopper() : this.$refs.datePicker.showPicker()
      }, 200)
    },
    close () {
      let picker = this.$refs.datePicker.picker
      picker.resetView && picker.resetView()
      picker.visible = false
      this.destroyPopper()
      this.popperJS = null
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel {
    padding: 25px;
    min-height: 400px;;
  }
  .filter-item {
    padding: 15px 0;
  }
</style>
