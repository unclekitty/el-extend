<template>
  <transition name="el-zoom-in-top" @after-enter="handleEnter" @after-leave="handleLeave">
    <div
      v-show="visible"
      class="el-picker-panel el-date-picker el-popper">
      <div class="el-picker-panel__header">
        <label class="label">自定义</label>
        <div class="display">{{displayValue}}</div>
        <div class="week">
          <table
            cellspacing="0"
            cellpadding="0"
            class="el-date-table">
            <tbody>
              <tr>
                <th v-for="(week, key) in WEEKS" :key="key">{{ t('el.datepicker.weeks.' + week) }}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="el-picker-panel__body-wrapper">
        <div class="el-picker-panel__body">
          <!-- picker header -->
          <div class="el-date-picker__header"
            :class="{ 'el-date-picker__header--bordered': currentView === 'year' || currentView === 'month' }"
            v-show="false && currentView !== 'time'">
            <button
              type="button"
              @click="prevYear"
              :aria-label="t(`el.datepicker.prevYear`)"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left">
            </button>
            <button
              type="button"
              @click="prevMonth"
              v-show="currentView === 'date'"
              :aria-label="t(`el.datepicker.prevMonth`)"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left">
            </button>
            <span
              @click="showYearPicker"
              role="button"
              class="el-date-picker__header-label">{{ yearLabel }}</span>
            <span
              @click="showMonthPicker"
              v-show="currentView === 'date'"
              role="button"
              class="el-date-picker__header-label"
              :class="{ active: currentView === 'month' }">{{t(`el.datepicker.month${ month + 1 }`)}}</span>
            <button
              type="button"
              @click="nextYear"
              :aria-label="t(`el.datepicker.nextYear`)"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right">
            </button>
            <button
              type="button"
              @click="nextMonth"
              v-show="currentView === 'date'"
              :aria-label="t(`el.datepicker.nextMonth`)"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right">
            </button>
          </div>
          <!-- content -->
          <div class="el-picker-panel__content">
            <div v-show="currentView === 'date'">
              <el-scrollbar ref="scrollbar">
                <div class="el-scrollbar-innner">
                  <!-- date table list -->
                  <div class="month-item" v-for="(date, key) in list" :key="key">
                    <label class="pointer month-label" @click="handleMonthLabelClick(date)">
                      {{date.getFullYear() + t('el.datepicker.year')}}{{t(`el.datepicker.month${ date.getMonth() + 1 }`)}}
                    </label>
                    <date-table
                      ref="datetable"
                      :selection-mode="'range'"
                      :value="new Date(value)"
                      :default-value="defaultValue ? new Date(defaultValue) : null"
                      :date="date"
                      :disabled-date="disabledDate"
                      :min-date="minDate"
                      :max-date="maxDate"
                      :range-state="rangeState"
                      :first-day-of-week="firstDayOfWeek"
                      :max-range="maxRange"
                      @pick="handleRangePick"
                      @changerange="handleChangeRange">
                    </date-table>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <year-table
              v-show="currentView === 'year'"
              @pick="handleYearPick"
              :value="new Date(value)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :disabled-date="disabledDate">
            </year-table>
            <month-table
              v-show="currentView === 'month'"
              @pick="handleMonthPick"
              :value="new Date(value)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :disabled-date="disabledDate">
            </month-table>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="el-picker-panel__footer">
        <el-button
          size="mini"
          type="text"
          class="el-picker-panel__link-btn cancel"
          @click="cancel">
          {{ t('el.datepicker.cancel') }}
        </el-button>
        <el-button
          size="mini"
          type="text"
          class="el-picker-panel__link-btn"
          @click="confirm">
          {{ t('el.datepicker.confirm') }}
        </el-button>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import {
  formatDate,
  parseDate,
  getWeekNumber,
  isDate,
  modifyDate,
  modifyTime,
  clearMilliseconds,
  clearTime,
  prevYear,
  nextYear,
  prevMonth,
  nextMonth
} from 'element-ui/packages/date-picker/src/util';
import Locale from 'element-ui/src/mixins/locale';
import TimePicker from 'element-ui/packages/date-picker/src/panel/time';
import YearTable from 'element-ui/packages/date-picker/src/basic/year-table';
import MonthTable from 'element-ui/packages/date-picker/src/basic/month-table';
import ElScrollbar from 'element-ui/lib/scrollbar';
import ElInput from 'element-ui/lib/input';
import ElButton from 'element-ui/lib/button';
import DateTable from './DateTable';

const nextDate = date => {
  date.setTime(date.getTime() + 3600 * 1000 * 24 * 1);
};

const prevDate = date => {
  date.setTime(date.getTime() - 3600 * 1000 * 24 * 1);
};

export default {
  mixins: [Locale],
  watch: {
    value(val) {
      if (isDate(val)) {
        this.date = new Date(val);
      } else {
        this.date = this.defaultValue
          ? new Date(this.defaultValue)
          : new Date();
      }
    },
    defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date();
      }
    },
    timePickerVisible(val) {
      if (val) this.$nextTick(() => this.$refs.timepicker.adjustSpinners());
    },
    selectionMode(newVal) {
      if (newVal === 'month') {
        /* istanbul ignore next */
        if (this.currentView !== 'year' || this.currentView !== 'month') {
          this.currentView = 'month';
        }
      }
    },
    visible(val) {
      val ? this.$emit('show') : this.$emit('hide');
    }
  },
  methods: {
    proxyTimePickerDataProperties() {
      const format = timeFormat => {
        this.$refs.timepicker.format = timeFormat;
      };
      const value = value => {
        this.$refs.timepicker.value = value;
      };
      const date = date => {
        this.$refs.timepicker.date = date;
      };
      this.$watch('format', format);
      this.$watch('value', value);
      this.$watch('date', date);
      format(this.timeFormat);
      value(this.value);
      date(this.date);
    },
    handleClear() {
      this.date = this.defaultValue ? new Date(this.defaultValue) : new Date();
      this.$emit('pick', null);
    },
    emit(value, ...args) {
      if (!value) {
        this.$emit('pick', value, ...args);
        return;
      }
      if (this.showTime) {
        this.$emit('pick', clearMilliseconds(value), ...args);
      } else {
        this.$emit('pick', clearTime(value), ...args);
      }
    },
    showMonthPicker() {
      this.currentView = 'month';
    },
    showYearPicker() {
      this.currentView = 'year';
    },
    prevMonth() {
      let date = prevMonth(this.date);
      if (!this.disabledDate(date)) {
        this.date = date;
      }
    },
    nextMonth() {
      let date = nextMonth(this.date);
      if (!this.disabledDate(date)) {
        this.date = date;
      }
    },
    prevYear() {
      let date;
      if (this.currentView === 'year') {
        date = prevYear(this.date, 10);
      } else {
        date = prevYear(this.date);
      }
      if (!this.disabledDate(date)) {
        this.date = date;
      }
    },
    nextYear() {
      let date;
      if (this.currentView === 'year') {
        date = nextYear(this.date, 10);
      } else {
        date = nextYear(this.date);
      }
      if (!this.disabledDate(date)) {
        this.date = date;
      }
    },
    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },
    handleTimePick(value, visible, first) {
      if (isDate(value)) {
        const newDate = modifyTime(
          this.date,
          value.getHours(),
          value.getMinutes(),
          value.getSeconds()
        );
        this.date = newDate;
        this.emit(this.date, true);
      } else {
        this.emit(value, true);
      }
      if (!first) {
        this.timePickerVisible = visible;
      }
    },
    handleMonthPick(month) {
      if (this.selectionMode === 'month') {
        this.date = modifyDate(this.date, this.year, month, 1);
        this.emit(this.date);
      } else {
        this.date = modifyDate(this.date, this.year, month, this.monthDate);
        // TODO: should emit intermediate value ??
        // this.emit(this.date)
        this.currentView = 'date';
      }
    },
    handleDatePick(value) {
      console.log(value);
      if (this.selectionMode === 'day') {
        this.date = modifyDate(
          this.date,
          value.getFullYear(),
          value.getMonth(),
          value.getDate()
        );
        this.emit(this.date, this.showTime);
      } else if (this.selectionMode === 'week') {
        this.emit(value.date);
      }
    },
    handleRangePick(val, close = true) {
      if (this.maxDate === val.maxDate && this.minDate === val.minDate) {
        return;
      }
      this.onPick && this.onPick(val);
      this.maxDate = val.maxDate;
      this.minDate = val.minDate;
      // workaround for https://github.com/ElemeFE/element/issues/7539, should remove this block when we don't have to care about Chromium 55 - 57
      setTimeout(() => {
        this.maxDate = val.maxDate;
        this.minDate = val.minDate;
      }, 10);
      if (!close || this.showTime) return;
      this.handleConfirm();
    },
    handleYearPick(year) {
      if (this.selectionMode === 'year') {
        this.date = modifyDate(this.date, year, 0, 1);
        this.emit(this.date);
      } else {
        this.date = modifyDate(this.date, year, this.month, this.monthDate);
        // TODO: should emit intermediate value ??
        // this.emit(this.date, true)
        this.currentView = 'month';
      }
    },
    cancel() {
      this.emit(null);
    },
    confirm() {
      // this.emit(this.date)
      this.handleConfirm();
    },
    handleConfirm(visible = false) {
      if (this.minDate && this.maxDate) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      } else {
        this.emit(null);
      }
    },
    resetView() {
      if (this.selectionMode === 'month') {
        this.currentView = 'month';
      } else if (this.selectionMode === 'year') {
        this.currentView = 'year';
      } else {
        this.currentView = 'date';
      }
    },
    handleEnter() {
      document.body.addEventListener('keydown', this.handleKeydown);
    },
    handleLeave() {
      this.$emit('dodestroy');
      document.body.removeEventListener('keydown', this.handleKeydown);
    },
    handleKeydown(e) {
      const keyCode = e.keyCode;
      const list = [38, 40, 37, 39];
      if (this.visible && !this.timePickerVisible) {
        if (list.indexOf(keyCode) !== -1) {
          this.handleKeyControl(keyCode);
          event.stopPropagation();
          event.preventDefault();
        }
        if (keyCode === 13) {
          // Enter
          this.$emit('pick', this.date, false);
        }
      }
    },
    handleKeyControl(keyCode) {
      const mapping = {
        year: {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setFullYear(date.getFullYear() + step)
        },
        month: {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setMonth(date.getMonth() + step)
        },
        week: {
          38: -1,
          40: 1,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step * 7)
        },
        day: {
          38: -7,
          40: 7,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step)
        }
      };
      const mode = this.selectionMode;
      const year = 3.1536e10;
      const now = this.date.getTime();
      const newDate = new Date(this.date.getTime());
      while (Math.abs(now - newDate.getTime()) <= year) {
        const map = mapping[mode];
        map.offset(newDate, map[keyCode]);
        if (
          typeof this.disabledDate === 'function' &&
          this.disabledDate(newDate)
        ) {
          continue;
        }
        this.date = newDate;
        this.$emit('pick', newDate, true);
        break;
      }
    },
    handleVisibleTimeChange(event) {
      const time = parseDate(event.target.value, this.timeFormat);
      if (time) {
        this.date = modifyDate(time, this.year, this.month, this.monthDate);
        this.$refs.timepicker.value = this.date;
        this.timePickerVisible = false;
        this.$emit('pick', this.date, true);
      }
    },
    handleVisibleDateChange(event) {
      const date = parseDate(event.target.value, this.dateFormat);
      if (date) {
        if (
          typeof this.disabledDate === 'function' &&
          this.disabledDate(date)
        ) {
          return;
        }
        this.date = modifyTime(
          date,
          this.date.getHours(),
          this.date.getMinutes(),
          this.date.getSeconds()
        );
        this.resetView();
        this.$emit('pick', this.date, true);
      }
    },
    isValidValue(value) {
      return (
        value &&
        !isNaN(value) &&
        (typeof this.disabledDate === 'function'
          ? !this.disabledDate(value)
          : true)
      );
    },
    handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },
    handleMonthLabelClick(val) {
      let start = val;
      let end = nextMonth(val);
      start.setDate(1);
      end.setDate(0);
      while (this.disabledDate(start)) {
        nextDate(start);
      }
      while (this.disabledDate(end)) {
        prevDate(end);
      }
      this.minDate = start;
      this.maxDate = end;
      this.$emit('pick', [this.minDate, this.maxDate], false);
    }
  },
  components: {
    TimePicker,
    YearTable,
    MonthTable,
    DateTable,
    ElInput,
    ElButton,
    ElScrollbar
  },
  data() {
    return {
      popperClass: '',
      date: new Date(),
      value: '',
      defaultValue: null,
      minDate: '',
      maxDate: '',
      // showTime: true,
      selectionMode: 'range',
      rangeState: {
        endDate: null,
        selecting: false,
        row: null,
        column: null
      },
      // shortcuts: '',
      visible: false,
      currentView: 'date',
      disabledDate: '',
      firstDayOfWeek: 7,
      showWeekNumber: false,
      timePickerVisible: false,
      format: '',
      arrowControl: false,
      maxRange: 31,
      rangeSeparator: '~',
      WEEKS: []
    };
  },
  computed: {
    list() {
      let start = new Date('2017/1/1');
      let end = new Date();
      let list = [];
      let temp = start;
      // end = nextMonth(end)
      do {
        list.push(temp);
        temp = nextMonth(temp);
      } while (temp < end);
      return list;
    },
    year() {
      return this.date.getFullYear();
    },
    month() {
      return this.date.getMonth();
    },
    week() {
      return getWeekNumber(this.date);
    },
    monthDate() {
      return this.date.getDate();
    },
    visibleTime() {
      const date = this.value || this.defaultValue;
      return date ? formatDate(date, this.timeFormat) : '';
    },
    visibleDate() {
      const date = this.value || this.defaultValue;
      return date ? formatDate(date, this.dateFormat) : '';
    },
    yearLabel() {
      const yearTranslation = this.t('el.datepicker.year');
      if (this.currentView === 'year') {
        const startYear = Math.floor(this.year / 10) * 10;
        if (yearTranslation) {
          return (
            startYear +
            ' ' +
            yearTranslation +
            ' - ' +
            (startYear + 9) +
            ' ' +
            yearTranslation
          );
        }
        return startYear + ' - ' + (startYear + 9);
      }
      return this.year + ' ' + yearTranslation;
    },
    timeFormat() {
      if (this.format && this.format.indexOf('ss') === -1) {
        return 'HH:mm';
      } else {
        return 'HH:mm:ss';
      }
    },
    dateFormat() {
      if (this.format) {
        return this.format
          .replace('HH', '')
          .replace(/[^a-zA-Z]*mm/, '')
          .replace(/[^a-zA-Z]*ss/, '')
          .trim();
      } else {
        return 'yyyy-MM-dd';
      }
    },
    displayValue() {
      if (this.currentView === 'date') {
        if (this.minDate && !this.maxDate) {
          return formatDate(this.minDate, this.dateFormat);
        } else if (this.minDate && this.maxDate) {
          return (
            formatDate(this.minDate, this.dateFormat) +
            this.rangeSeparator +
            formatDate(this.maxDate, this.dateFormat)
          );
        } else {
          return '';
        }
      } else if (this.currentView === 'month') {
        return formatDate(this.value, 'yyyy-MM');
      }
    }
  },
  mounted() {
    this.WEEKS = this.$refs.datetable[0].WEEKS;
  }
};
</script>
