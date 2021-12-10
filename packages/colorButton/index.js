// 导入组件，组件必须声明 name
import ColorButton from './src/color-button.vue';

// 为组件提供 install 安装方法，供按需引入
ColorButton.install = function (Vue) {
  Vue.component(ColorButton.name, ColorButton);
};

// 默认导出组件
export default ColorButton;
