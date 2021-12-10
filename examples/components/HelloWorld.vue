<template>
  <div class="hello">
    <VueFinalTable
      ref="finalTableRef"
      :datas="dataset"
      @tableEventHandler="tableEventHandler"
    />
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      dataset: {
        paginationConfig: {
          need: true,
        },
        filterLine: {
          show: true,
        },
        selection: {
          need: true,
          prop: "productId",
          width: "18",
        },
        header: [
          { prop: "productName", label: "产品名称", width: "" },
          { prop: "productKey", label: "产品标识码", width: "" },
          { prop: "nodeType", label: "节点类型", width: "180" },
          { prop: "dynamicRegistration", label: "设备动态注册", width: "180" },
          { prop: "creationDate", label: "创建时间", width: "220" },
          { prop: "operation", label: "操作", width: "115" },
        ],
        tableData: [],
        // 搜索行配置
        searchLineConfig: {
          productName: {
            type: "input",
            label: "产品名称",
            value: "",
            actionType: "goSearch",
            placeholder: "请输入产品名称",
            prefixIcon: "el-icon-search",
          },
          productKey: {
            type: "input",
            label: "产品标识码",
            value: "",
            actionType: "goSearch",
            placeholder: "请输入产品标识码",
            prefixIcon: "el-icon-search",
          },
          nodeType: {
            type: "selector",
            label: "节点类型",
            value: "",
            placeholder: "请选择节点类型",
            actionType: "goSearch",
            optionList: [
              {
                label: "直连设备",
                value: "DIRECTDEVICE",
              },
              {
                label: "网关设备",
                value: "GATEWAY",
              },
              {
                label: "网关子设备",
                value: "SUBDEVICE",
              },
            ],
          },
          dynamicRegistration: {
            type: "selector",
            label: "设备动态注册",
            actionType: "goSearch",
            value: "",
            placeholder: "请选择设备动态注册",
            optionList: [
              {
                label: "激活",
                value: "ENABLE",
              },
              {
                label: "未激活",
                value: "DISABLED",
              },
            ],
          },
          operation: {
            type: "button",
            filterCount: "",
            actionType: "clickEvent",
            eventName: "showMoreFilters",
            label: "更多筛选",
          },
        },
        // 表格内容配置
        detailConfig: {
          productName: {
            type: "aLink",
            actionType: "aLinkClick",
            targetType: "product",
          },
          nodeType: {
            type: "enumerationColumn",
            emuList: {
              DIRECTDEVICE: "直连设备",
              GATEWAY: "网关设备",
              SUBDEVICE: "网关子设备",
            },
          },
          dynamicRegistration: {
            type: "switch",
            actionType: "switchEvent",
          },
          creationDate: {
            type: "dateFormat",
          },
          operation: {
            type: "icon",
            iconList: [
              {
                actionType: "iconClick",
                eventName: "copy",
                fontSize: "20px",
                color: "#5A9CF8",
                cursorPointer: "pointer",
                iconName: "el-icon-document-copy",
                tooltips: "复制",
              },
              {
                actionType: "iconClick",
                eventName: "view",
                fontSize: "20px",
                color: "#5A9CF8",
                cursorPointer: "pointer",
                iconName: "el-icon-view",
                tooltips: "查看详情",
              },
              {
                actionType: "iconClick",
                eventName: "delete",
                fontSize: "20px",
                color: "#E47470",
                cursorPointer: "pointer",
                iconName: "el-icon-delete",
                tooltips: "删除",
              },
            ],
          },
        },
        // 高级搜索配置
        advanceFilterConfig: {
          productName: {
            inline: true,
            value: "",
          },
          productKey: {
            inline: true,
            value: "",
          },
          nodeType: {
            inline: true,
            value: "",
          },
          dynamicRegistration: {
            inline: true,
            value: "",
          },
          tagList: {
            type: "tagList",
            label: "标签",
            tagType: "product",
            value: [],
          },
          creationDate: {
            type: "dateRange",
            label: "创建时间",
            value: [],
          },
        },
        pageVO: {
          current: 1,
          rowCount: 10,
          total: 0,
        },
      },
    };
  },
  mounted() {
    this.dataset.tableData.push({
      productName: "xxx1",
    });
  },
  methods: {
    tableEventHandler() {},
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
