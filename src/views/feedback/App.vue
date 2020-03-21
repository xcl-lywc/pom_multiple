<template>
  <div id="app">
    <!-- 根据需要显示不同的布局情况 -->
    <component :is="layout"></component>
  </div>
</template>

<script>
	import BlankLayout from "./layout/BlankLayout.vue";
	import NavLayout from "./layout/NavLayout.vue";
	export default {
		name: 'App',
		props: {
			layout: {
				type: String,
				default: "nav-layout"
			}
		},
		watch: {

		},
		components: {
			"nav-layout":   NavLayout,
			"blank-layout": BlankLayout
		},
		data() {
			return {
				
			};
		},
		mounted(){
			
		}
	}
</script>

<style>
	
</style>
