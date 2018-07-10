<script>
import Picker from '@/components/DatePicker/Picker';
import DatePanel from '@/components/DatePicker/Panel';

const getPanel = function(type) {
  return DatePanel;
};

export default {
  mixins: [Picker],

  name: 'ElDatePicker',

  props: {
    type: {
      type: String,
      default: 'date'
    },
    timeArrowControl: Boolean
  },

  watch: {
    type(type) {
      if (this.picker) {
        this.mountPicker(this.picker);
      } else {
        this.panel = getPanel(type);
      }
    }
  },

  created() {
    this.panel = getPanel(this.type);
  },
  mounted() {
    this.mountPicker();
  }
};
</script>
