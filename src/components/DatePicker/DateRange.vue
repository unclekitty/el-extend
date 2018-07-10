<template>
  <div class="filter-item" ref="reference" v-clickoutside="close">
    <el-dropdown ref="dropdown" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{displayValue || '选择日期'}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in shortcuts"
          :key="index"
          :command="{item, index}"
          :class="{'active': selectedIndex == index}">{{item.text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <date-picker v-show="false"
      class="m-b-24"
      placeholder="选择日期"
      ref="datePicker"
      align="right"
      v-model="actValue"
      range-separator="~"
      :type="dateType"
      :picker-options="pickerOptions"
      :editable="false"
      :shortcuts="shortcuts"></date-picker>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';
import Popper from 'element-ui/src/utils/vue-popper';
import merge from 'element-ui/src/utils/merge';
import DatePicker from '@/components/DatePicker';

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding
  },
  methods: Popper.methods,
  data() {
    return merge({ visibleArrow: false }, Popper.data);
  },
  beforeDestroy: Popper.beforeDestroy
};

export default {
  mixins: [NewPopper],
  name: 'DateRange',
  components: {
    DatePicker
  },
  directives: {
    Clickoutside
  },
  computed: {
    displayValue() {
      if (this.selectType === 0 || this.selectType === 1) {
        return this.dispalyName;
      }
      if (this.selectType === 2 || this.selectType === 3) {
        return this.$refs.datePicker.displayValue;
      }
    }
  },
  data() {
    let self = this;
    return {
      actValue: '',
      dispalyName: '',
      selectType: 1,
      selectedIndex: 0,
      dateType: 'daterange',
      shortcuts: [
        {
          text: '最近7天',
          onClick(picker) {
            // self.actValue = ''
            self.dateType = 'daterange';
            self.selectType = 0;
            const start = new Date();
            const end = new Date();
            start.setTime(new Date().getTime() - 3600 * 1000 * 24 * 7);
            end.setTime(new Date().getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '最近30天',
          onClick(picker) {
            // self.actValue = ''
            self.dateType = 'daterange';
            self.selectType = 1;
            const start = new Date();
            const end = new Date();
            start.setTime(new Date().getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(new Date().getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '自然月',
          onClick(picker) {
            // self.actValue = ''
            self.dateType = 'month';
            self.selectType = 2;
            self.show(picker);
          }
        },
        {
          text: '自选日期段',
          onClick(picker) {
            // self.actValue = ''
            self.dateType = 'daterange';
            self.selectType = 3;
            self.show(picker);
          }
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          let date = new Date('2017/1/1');
          return time.getTime() < date.getTime(); // || time.getTime() > new Date().getTime()
        },
        maxRange: 31,
        rangeSeparator: '至'
      }
    };
  },
  mounted() {
    // set default
    let defaultShortcut = this.shortcuts[this.selectedIndex];
    let datePicker = this.$refs.datePicker;
    this.dispalyName = defaultShortcut.text;
    defaultShortcut.onClick(datePicker.picker);
    //
    this.popperElm = datePicker.picker.$el;
    this.placement = datePicker.placement;
    this.popperOptions = datePicker.popperOptions;
    //
  },
  watch: {
    actValue(val) {
      if (val) {
        if (val.constructor === Date) {
          val = [val];
        }
        this.$emit('date-change', val, this.selectType);
        this.$emit('getDate', val); // old
      }
      this.close();
    }
  },
  methods: {
    handleCommand({ item, index }) {
      this.dispalyName = item.text;
      this.selectedIndex = index;
      item.onClick(this.$refs.datePicker.picker);
    },
    show(picker) {
      setTimeout(() => {
        picker.visible = true;
        this.updatePopper
          ? this.updatePopper()
          : this.$refs.datePicker.showPicker();
      }, 200);
    },
    close() {
      let picker = this.$refs.datePicker.picker;
      picker.resetView && picker.resetView();
      picker.visible = false;
      this.destroyPopper();
      this.popperJS = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.panel {
  padding: 25px;
  min-height: 400px;
}
.filter-item {
  padding: 15px 0;
}
</style>
