<template>
  <div v-if="curObj" class="search-line-item">
    <!-- input类型 -->
    <span v-if="curObj.type === 'input'">
      <el-input
        :placeholder="curObj.placeholder"
        :prefix-icon="curObj.prefixIcon"
        clearable
        v-model="curObj.value"
        @keyup.native="eventHandlerDebounce"
        @clear="eventHandler"
      >
      </el-input>
    </span>
    <span v-else-if="curObj.type === 'selector'">
      <el-select
        v-model="curObj.value"
        placeholder=""
        style="width: 100%"
        @change="eventHandler"
        clearable
      >
        <el-option
          v-for="(item, index) in curObj.optionList"
          :value="item.value"
          :label="item.label"
          :key="index"
        ></el-option>
      </el-select>
    </span>
    <span v-else-if="curObj.type === 'dateRange'">
      <el-date-picker
        style="width: 192px"
        v-model="curObj.value[0]"
        type="datetime"
        placeholder="选择开始时间"
        @change="eventHandler"
      >
      </el-date-picker>
      <span class="date-range-span"> - </span>
      <el-date-picker
        style="width: 192px"
        v-model="curObj.value[1]"
        type="datetime"
        placeholder="选择结束时间"
        @change="eventHandler"
      >
      </el-date-picker>
    </span>
    <span v-else-if="curObj.type === 'button'">
      <el-badge :value="curObj.filterCount" class="item" type="primary">
        <el-button @click="eventHandler" style="width: 100%">
          {{ curObj.label }}</el-button
        >
      </el-badge>
    </span>
  </div>
</template>

<script>
import lodash from "lodash";
export default {
  props: {
    datas: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    prop: {
      type: String,
      required: true,
      default: "",
    },
  },
  data() {
    return {
      curVModel: "",
      eventHandlerDebounce: lodash.debounce(() => {
        this.eventHandler();
      }, 500),
    };
  },
  computed: {
    curObj() {
      return this.datas.searchLineConfig[this.prop];
    },
  },
  methods: {
    eventHandler() {
      let params = {};
      // 触发查询
      if (this.curObj.actionType === "goSearch") {
        params = {
          params: {
            [this.prop]: this.curObj.value,
          },
          type: this.curObj.actionType,
        };
      } else if (this.curObj.actionType === "clickEvent") {
        // 打开更多筛选
        params = {
          type: this.curObj.actionType,
          eventName: this.curObj.eventName,
        };
      }
      this.$emit("eventEmit", params);
    },
  },
};
</script>

<style scoped lang="less">
.search-line-item {
  /deep/ .el-badge {
    width: 100%;
  }
}
</style>