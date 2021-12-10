<template>
  <span class="detail-line-item">
    <span v-if="curObj.type === 'aLink'">
      <a class="row-a-link" :href="hrefRender(row, curObj.targetType)">
        {{ row[prop] }}
      </a>
    </span>
    <span v-else-if="curObj.type === 'icon'">
      <span
        :class="
          curObj.iconList.length < 3
            ? 'icons-container-small'
            : 'icons-container-normal'
        "
      >
        <template v-for="(icons, index) in curObj.iconList">
          <span
            :key="index"
            class="sing-icons"
            v-if="!(icons.hideProp && row[icons.hideProp] === icons.hideValue)"
          >
            <el-tooltip
              :content="icons.tooltips"
              placement="bottom"
              :open-delay="openDelay"
            >
              <i
                @click="
                  (!icons.disableProp ||
                    row[icons.disableProp] != icons.disableValue) &&
                    eventHandler(icons.actionType, row, icons.eventName)
                "
                :class="
                  icons.disableProp &&
                  row[icons.disableProp] == icons.disableValue
                    ? `disable-button ${icons.iconName}`
                    : `${icons.iconName}`
                "
                :style="{
                  color: icons.color,
                  cursor: icons.cursorPointer,
                  fontSize: icons.fontSize,
                }"
              ></i>
            </el-tooltip>
          </span>
        </template>
      </span>
    </span>
    <span v-else-if="curObj.type === 'enumerationColumn'">
      {{ curObj.emuList[row[prop]] }}
    </span>
    <span v-else-if="curObj.type === 'joinList'">
      {{ joinListRender(curObj, row) }}
    </span>
    <span v-else-if="curObj.type === 'joinSymbolList'">
      {{ joinSymbolListRender(curObj, row) }}
    </span>
    <span v-else-if="curObj.type === 'deepListJoin'">
      {{ deepListJoinRender(curObj, row) }}
    </span>
    <span v-else-if="curObj.type === 'tags'">
      <span v-if="JSON.stringify(row) !== '{}'">
        <el-tag :type="curObj[row[prop]] && curObj[row[prop]].type">{{
          curObj[row[prop]] && curObj[row[prop]].label
        }}</el-tag>
      </span>
    </span>
    <span v-else-if="curObj.type === 'switch'">
      <el-switch
        @change="eventHandler(curObj.actionType, row)"
        v-model="row[prop]"
        active-value="ENABLE"
        inactive-value="DISABLE"
        active-color="#13ce66"
      >
      </el-switch>
    </span>
    <span v-else-if="curObj.type === 'otherParam'">
      <span>{{ row[curObj["paramName"]] }}</span>
    </span>
    <span v-else-if="curObj.type === 'dateFormat'">
      {{ row[prop] | dateFormat("YYYY-MM-DD HH:mm:ss") }}
      <span v-if="curObj.addSpan && row[curObj.minus] && row[curObj.minuend]">
        <el-tag>{{ renderTimeMinus(curObj, row) }}</el-tag>
      </span>
    </span>
    <span v-else-if="curObj.type === 'dateFormatSpaciel'">
      {{ row[prop] | dateFormatSpaciel("YYYY-MM-DD HH:mm:ss") }}
      <span v-if="curObj.addSpan && row[curObj.minus] && row[curObj.minuend]">
        <el-tag>{{ renderTimeMinus(curObj, row) }}</el-tag>
      </span>
    </span>
  </span>
</template>

<script>
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
    row: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      openDelay: 200,
    };
  },
  computed: {
    curObj() {
      return this.datas.detailConfig[this.prop];
    },
  },
  methods: {
    renderTimeMinus(curObj, row) {
      if (!row[curObj.minus] || !row[curObj.minuend]) return "";
      const Difference =
        (new Date(row[curObj.minus]).getTime() -
          new Date(row[curObj.minuend]).getTime()) /
        1000;
      return Number.parseInt(Difference);
    },
    joinListRender(curObj, row) {
      const { joinSymbol, joinList } = curObj;
      if (!joinList.length || !row[joinList[0]]) return "-";
      let resultList = [];
      joinList.forEach((element) => {
        resultList.push(row[element] ? row[element] : "");
      });
      return resultList.join(` ${joinSymbol} `);
    },
    joinSymbolListRender(curObj, row) {
      const { joinSymbol, joinList, symbolList } = curObj;
      if (!joinList.length || !row[joinList[0]]) return "-";
      let resultList = [];
      joinList.forEach((element, index) => {
        resultList.push(row[element] ? row[element] + symbolList[index] : "");
      });
      return resultList.join(` ${joinSymbol} `);
    },
    deepListJoinRender(curObj, row) {
      const { first, second, joinSymbol } = curObj;
      if (!row[first] || row[first].length === 0) return "-";
      let resultList = [];
      row[first].forEach((item) => {
        resultList.push(item[second]);
      });
      return resultList.join(joinSymbol);
    },
    hrefRender(row, targetType) {
      switch (targetType) {
        case "device":
          return `#/iot/device/detail?productKey=${row.productKey}&deviceName=${row.deviceName}`;
        case "product":
          return `#/iot/product/detail?productKey=${row.productKey}`;
        case "ruleList":
          return `#/iot/rule/detail?ruleKey=${row.ruleKey}&type=view`;
        case "alarm":
          return `#/iot/alarm/detail?alarmId=${row.alarmUUID}`;
      }
    },
    eventHandler(type, row, eventName) {
      const params = {
        type,
        row,
        eventName,
      };
      this.$emit("eventEmit", params);
    },
  },
};
</script>
<style scoped lang="less">
.detail-line-item {
  .icons-container-normal {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .icons-container-small {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .sing-icons {
      margin-right: 20px;
    }
  }
  .row-a-link {
    color: #409eff;
  }
  .disable-button {
    cursor: not-allowed !important;
    color: #a8a9ab !important;
  }
}
</style>