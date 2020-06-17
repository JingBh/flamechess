<template>
  <b-container class="my-3" fluid="md">
    <b-jumbotron class="pt-sm-4 pb-sm-5">
      <h1 class="display-4">ChessTerm <small class="text-muted" id="version">v{{ version }}</small></h1>
      <p class="lead mb-1">A checkerboard <del title="Not anymore." data-toggle="tooltip">, but in a terminal</del>.</p>
      <p class="mb-0">Developed by <a class="text-body" href="https://www.jingbh.top/" target="_blank">JingBh</a></p>
    </b-jumbotron>
    <b-nav tabs>
      <b-nav-item to="/" exact exact-active-class="active">简介</b-nav-item>
      <b-nav-item to="/use" exact exact-active-class="active">使用</b-nav-item>
      <b-nav-item class="ml-auto" href="https://github.com/JingBh/flamechess" target="_blank">GitHub</b-nav-item>
    </b-nav>
    <div class="tab-content mt-2">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </b-container>
</template>

<script lang="ts">
  import Vue from "vue"

  import { VERSION } from "../../../js/version"

  export default Vue.extend({
    data() {
      return {
        version: VERSION
      }
    }
  })
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
