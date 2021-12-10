// 导入组件，组件必须声明 name
import VueFinalTable from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
VueFinalTable.install = function (Vue) {
  Vue.component(VueFinalTable.name, VueFinalTable);
};

// 默认导出组件
export default VueFinalTable;
