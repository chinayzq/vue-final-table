<template>
  <div class="finale-table-comp">
    <el-table
      ref="table"
      v-loading="tableLoading"
      :data="finalTableData"
      element-loading-text="loading"
      fit
      :row-class-name="tableRowClassName"
      @selection-change="selectedChange"
    >
      <!-- datas.selection.need 为 true, 则渲染selections -->
      <el-table-column
        v-if="datas.selection && datas.selection.need"
        type="selection"
        :prop="datas.selection.prop ? datas.selection.prop : null"
        :width="datas.selection.width ? datas.selection.width : null"
        align="center"
      >
      </el-table-column>
      <!-- 遍历header，渲染表格的clumns -->
      <template v-for="(item, index) in datas.header">
        <el-table-column
          :key="index"
          :prop="item.prop ? item.prop : null"
          :label="item.label ? item.label : null"
          :width="item.width ? item.width : null"
          align="left"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!-- 第一行渲染搜索行 -->
            <span v-if="scope.$index === 1">
              <searchLineItem
                :datas="datas"
                :prop="item.prop"
                @eventEmit="filterEventEmit"
              />
            </span>
            <!-- 表格内容 -->
            <span v-else>
              <!-- 通过prop在headerConfig中匹配 -->
              <span v-if="datas.detailConfig[item.prop]">
                <detailLineItem
                  :datas="datas"
                  :prop="item.prop"
                  :row="scope.row"
                  @eventEmit="detailEventEmit"
                />
              </span>
              <span v-else>
                {{ scope.row[item.prop] || "-" }}
              </span>
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <pagination
      v-if="datas.paginationConfig && datas.paginationConfig.need"
      layout="sizes,total , prev, pager, next, jumper"
      :background="false"
      :total="datas.pageVO.total"
      :page.sync="datas.pageVO.current"
      :limit.sync="datas.pageVO.rowCount"
      @pagination="paginationChange"
    />
    <!-- 高级筛选 -->
    <el-drawer
      v-if="AdvanceFilterShow"
      title="高级筛选"
      :size="580"
      :visible.sync="AdvanceFilterShow"
    >
      <div class="advance-filter-container">
        <div class="form-container">
          <el-form
            ref="advanceFilterForm"
            :model="advanceFilterForm"
            label-width="120px"
            label-position="left"
          >
            <span
              v-for="(item, index) in Object.keys(datas.advanceFilterConfig)"
              :key="index"
            >
              <!-- 如果在搜索行中有配置，则取搜索行中的配置 -->
              <span v-if="datas.searchLineConfig[item]">
                <el-form-item :label="datas.searchLineConfig[item].label">
                  <!-- input类型 -->
                  <span v-if="datas.searchLineConfig[item].type === 'input'">
                    <el-input
                      :placeholder="datas.searchLineConfig[item].placeholder"
                      v-model="advanceFilterForm[item]"
                      clearable
                    ></el-input>
                  </span>
                  <!-- selector类型 -->
                  <span
                    v-else-if="datas.searchLineConfig[item].type === 'selector'"
                  >
                    <el-select
                      style="width: 100%"
                      v-model="advanceFilterForm[item]"
                      :placeholder="datas.searchLineConfig[item].placeholder"
                      clearable
                    >
                      <el-option
                        v-for="(item, index) in datas.searchLineConfig[item]
                          .optionList"
                        :value="item.value"
                        :label="item.label"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </span>
                </el-form-item>
              </span>
              <span v-else>
                <el-form-item :label="datas.advanceFilterConfig[item].label">
                  <!-- 时间段选择类型（开始时间 - 结束时间） -->
                  <span
                    v-if="datas.advanceFilterConfig[item].type === 'dateRange'"
                  >
                    <el-date-picker
                      style="width: 192px"
                      v-model="advanceFilterForm[item][0]"
                      type="datetime"
                      placeholder="选择开始时间"
                    >
                    </el-date-picker>
                    <span class="date-range-span"> - </span>
                    <el-date-picker
                      style="width: 192px"
                      v-model="advanceFilterForm[item][1]"
                      type="datetime"
                      placeholder="选择结束时间"
                    >
                    </el-date-picker>
                  </span>
                  <span
                    v-else-if="
                      datas.advanceFilterConfig[item].type === 'tagList'
                    "
                  >
                    <el-select
                      ref="tagListRef"
                      @change="tagListChange"
                      style="width: 100%"
                      v-model="advanceFilterForm[item]"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="tagQueryHandler"
                      :loading="tagLoading"
                    >
                      <el-option
                        v-for="item in tagOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </span>
                  <span
                    v-else-if="datas.advanceFilterConfig[item].type === 'input'"
                  >
                    <el-input
                      v-model="advanceFilterForm[item]"
                      :placeholder="datas.advanceFilterConfig[item].placeholder"
                    ></el-input>
                  </span>
                </el-form-item>
              </span>
            </span>
          </el-form>
        </div>
        <div class="button-container">
          <div class="filter-button" @click="advanceFilterHandler">筛选</div>
          <div class="clear-button" @click="advanceFormReset">清空</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import searchLineItem from "./searchLineItem";
import detailLineItem from "./detailLineItem";
import Pagination from "./Pagination";
import $ from "jquery";
// import { getTagList } from "@/api/ruge/tag/tag";
export default {
  name: "VueFinalTable",
  components: { searchLineItem, detailLineItem, Pagination },
  props: {
    datas: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      advanceFilterForm: {},
      AdvanceFilterShow: false,
      tableLoading: false,
      filterLineShow: true,
      finalTableData: [],
      tagLoading: false,
      tagOptions: [],
      tagList: [],
      listQuery: {
        //分页参数
        current: 1,
        rowCount: 20,
        resultMode: 2,
        tagType:
          this.datas.advanceFilterConfig.tagList &&
          this.datas.advanceFilterConfig.tagList.tagType,
        tagName: null,
      },
    };
  },
  watch: {
    datas: {
      handler(val) {
        if (val.selection && val.selection.need) {
          this.searchLineSelectionToggle(true);
        }
        val && val.filterLine && this.filterLineToggle(val.filterLine.show);
        // 动态创建advanceFilterForm的key
        if (JSON.stringify(val.advanceFilterConfig) !== "{}") {
          Object.keys(val.advanceFilterConfig).forEach((item) => {
            this.advanceFilterForm[item] = val.advanceFilterConfig[item].value;
          });
        }
        // this.checkEmpty(val);
        this.loadDatas(val.tableData);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // 更多筛选在初始化时有默认值的情况下，需要初始化一次count
    if (this.datas.searchLineConfig.operation) {
      this.freshCount();
    }
    // 如果有标签搜索，初始化标签
    // if (this.datas.advanceFilterConfig.tagList) {
    //   this.getTagList();
    // }
  },
  methods: {
    // 选择内容后清除输入
    tagListChange() {
      this.$refs.tagListRef[0].query = "";
    },
    // getTagList(query) {
    //   this.tagLoading = true;
    //   this.listQuery.tagName = query;
    //   getTagList(this.listQuery)
    //     .then((res) => {
    //       this.tagOptions = res.rows.map((item) => {
    //         return {
    //           value: item.tagName,
    //           label: item.tagName,
    //         };
    //       });
    //       this.tagLoading = false;
    //     })
    //     .catch((error) => {
    //       console.log(`查询失败，原因=> ${error}`);
    //       this.tagLoading = false;
    //     });
    // },
    tagQueryHandler(query) {
      console.log("query", query);
      // this.getTagList(query);
    },
    // 处理tableData
    loadDatas(datas) {
      this.finalTableData = [{}, {}].concat(datas);
      try {
        this.$nextTick(() => {
          $(this.$refs.table.$el).find(".final-table-empty").remove();
        });
      } catch (error) {
        console.log(error);
      }

      if (datas.length === 0) {
        this.$nextTick(() => {
          // 给当前table添加暂无数据
          $(this.$refs.table.$el)
            .find(".el-table__body-wrapper")
            .append(
              '<div class="el-table__empty-block final-table-empty" style=""><span class="el-table__empty-text">暂无数据</span></div>'
            );
        });
      }
    },
    // loading状态
    loadingToggle(type) {
      this.$nextTick(() => {
        this.tableLoading = type;
      });
    },
    // 刷新badge count
    freshCount() {
      let count = 0;
      Object.keys(this.advanceFilterForm).forEach((ele) => {
        if (ele === "operation") return;
        if (
          this.datas.advanceFilterConfig[ele] &&
          !this.datas.advanceFilterConfig[ele].inline &&
          this.advanceFilterForm[ele].length > 0 &&
          this.checkEmptyList(this.advanceFilterForm[ele])
        ) {
          count++;
        }
      });
      this.datas.searchLineConfig.operation.filterCount =
        count > 0 ? count : "";
    },
    // 检查数组里是否每个item都不为null
    checkEmptyList(list) {
      if (typeof list === "string") {
        return list;
      } else {
        let count = list.filter((item) => item).length;
        return count > 0;
      }
    },
    // 更多筛选 - 筛选
    advanceFilterHandler() {
      // 更新更多选项的badge count
      this.freshCount();
      Object.keys(this.advanceFilterForm).forEach((ele) => {
        this.datas.advanceFilterConfig[ele].value = this.advanceFilterForm[ele]
          ? JSON.parse(JSON.stringify(this.advanceFilterForm[ele]))
          : "";
        if (this.datas.searchLineConfig[ele]) {
          this.datas.searchLineConfig[ele].value = this.advanceFilterForm[ele]
            ? JSON.parse(JSON.stringify(this.advanceFilterForm[ele]))
            : "";
        }
      });
      // 触发列表查询
      this.$emit("tableEventHandler", {
        type: "goSearch",
        params: { ...this.advanceFilterForm },
      });
      this.AdvanceFilterShow = false;
    },
    // 更多筛选 - 清空
    advanceFormReset() {
      for (let key in this.advanceFilterForm) {
        if (JSON.stringify(this.advanceFilterForm[key]) === "[]") {
          this.advanceFilterForm[key] = [];
        } else {
          this.advanceFilterForm[key] = "";
        }
      }
    },
    // 隐藏第一个selection
    searchLineSelectionToggle(type) {
      this.$nextTick(() => {
        try {
          this.$refs.table.doLayout();
          document.querySelector(
            ".el-table__body-wrapper tbody > tr:nth-child(2) > td.el-table-column--selection > div > label > span "
          ).style.display = type ? "none" : "inline-block";
        } catch (error) {
          console.log(error);
        }
      });
    },
    // 第一行的展示/隐藏
    filterLineToggle(action) {
      this.filterLineShow = action;
      this.searchLineSelectionToggle(action);
    },
    // 给table第一行加className
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 0 || (rowIndex === 1 && !this.filterLineShow)) {
        return "display-none-row";
      }
      return "";
    },
    // 存储勾选的rowList
    selectedChange(list) {
      this.$emit("tableEventHandler", {
        type: "updateSelectionList",
        list,
      });
    },
    paginationChange(current) {
      this.$emit("tableEventHandler", {
        type: "paginationChange",
        params: {
          current,
        },
      });
    },
    // 监听搜索行事件
    filterEventEmit(datas) {
      if (datas.type === "clickEvent") {
        if (datas.eventName === "showMoreFilters") {
          // 给advanceFilterForm赋值
          const tempObj = {};
          Object.keys(this.advanceFilterForm).forEach((item) => {
            tempObj[item] = this.datas.searchLineConfig[item]
              ? this.datas.searchLineConfig[item].value
              : JSON.parse(
                  JSON.stringify(this.datas.advanceFilterConfig[item].value)
                );
          });
          this.advanceFilterForm = { ...tempObj };
          this.AdvanceFilterShow = true;
        }
      } else {
        this.$emit("tableEventHandler", datas);
      }
    },
    // 监听行内容点击事件
    detailEventEmit(datas) {
      this.$emit("tableEventHandler", datas);
    },
  },
};
</script>

<style scoped lang="less">
.finale-table-comp {
  .advance-filter-container {
    height: 100%;
    width: 100%;
    padding: 32px 32px 96px 32px;
    position: relative;
    .button-container {
      width: 100%;
      height: 64px;
      line-height: 64px;
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      .filter-button {
        text-align: center;
        cursor: pointer;
        background-color: #0486fe;
        color: #fff;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        flex: 2;
      }
      .clear-button {
        border: 1px solid #c0c4cc;
        text-align: center;
        cursor: pointer;
        background-color: #fff;
        color: #606266;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        flex: 1;
      }
    }
  }
  .date-range-span {
    display: inline-block;
    width: 12px;
    text-align: center;
  }
  // 第一行添加的样式
  /deep/ .display-none-row {
    display: none;
  }
  // 修改selection对不齐的问题
  /deep/ .el-table-column--selection .cell {
    padding-left: 10px;
  }
  // 解决最后一列和边框不对齐问题
  /deep/ .el-table .cell {
    padding-right: 0 !important;
  }
  // 解决badge在表格中展示不全问题
  /deep/ .el-table__body-wrapper {
    overflow: visible;
  }
  // 只能设置搜索行，不然下面行的show-overflow-tooltip会有问题
  /deep/ .el-table tr:nth-child(2) .cell {
    overflow: visible;
  }
  /deep/ .el-table {
    overflow: visible;
  }
  /deep/ .el-pagination__sizes {
    float: right;
    margin-right: 0;
  }
  /deep/ .el-pagination {
    padding-right: 0;
  }
  /deep/ .el-pagination__total {
    float: right;
  }
  // filterLine hover的时候取消background的颜色
  /deep/
    .el-table__body-wrapper.is-scrolling-none
    > table
    > tbody
    > tr:nth-child(2):hover {
    .el-table__cell {
      background-color: #fff;
    }
  }
  // table select贴边
  /deep/ div.el-table__header-wrapper thead > tr th:nth-child(1) .cell {
    padding-left: 0;
  }
  /deep/ div.el-table__body-wrapper > table > tbody > tr td:nth-child(1) .cell {
    padding-left: 0;
  }
  // 修改taglist背景和颜色
  ::v-deep .el-tag.el-tag--info {
    color: #0486fe;
    background-color: #ecf5ff;
  }
  ::v-deep .el-select .el-tag__close.el-icon-close {
    background-color: #0486fe;
  }
  ::v-deep .el-tag.el-tag--info .el-tag__close {
    color: #fff;
  }
}
</style>