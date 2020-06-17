<template>
  <div>
    <p>正确填写下面参数才能打开 ChessTerm 哦~</p>
    <b-form>
      <b-form-group label="Game ID" label-for="inputGameId" label-cols-sm="3" label-cols-md="2">
        <b-form-input id="inputGameId" placeholder="请输入 Game ID" v-model="form.gameId"></b-form-input>
        <b-form-text text-variant="dark">Game ID 标识了棋种相关信息，每一个 Game ID 表示一种棋。若不知道，可以先尝试一下 Game ID 为 <code>1000</code> 的 14x14 测试棋盘。</b-form-text>
      </b-form-group>
      <b-form-group label="棋盘码" label-for="inputUserId" label-cols-sm="3" label-cols-md="2">
        <b-form-input id="inputUserId" placeholder="请输入棋盘码" v-model="form.userId" v-on:></b-form-input>
        <b-form-text text-variant="dark">
          要使用 ChessTerm，需要一个有效的棋盘码。每个棋盘码对应系统中的一个用户<span v-html="userNameText"></span>。
          <router-link to="/register/thhs">&gt; 清华附中师生注册入口 &lt;</router-link>
        </b-form-text>
      </b-form-group>
      <b-form-group label="控制的棋子" label-for="selectSide" label-cols-sm="3" label-cols-md="2">
        <b-form-select id="selectSide" v-model="form.side" v-bind:options="sides"></b-form-select>
      </b-form-group>
    </b-form>
  </div>
</template>

<script lang="ts">
  import Vue from "vue"
  import { debounce } from "lodash"
  import Axios from "axios"

  import { Side } from "../../../js/chessterm/classes"
  import { url } from "../utils"

  export default Vue.extend({
    data() {
      return {
        form: {
          gameId: 1000,
          userId: 10170,
          side: Side.None,
          bot: false
        },
        sides: [
          { value: Side.None, text: "无" },
          { value: Side.X, text: "“X” (黄子)" },
          { value: Side.O, text: "“O” (蓝子)" },
          { value: Side.Both, text: "双方" },
        ],
        userNameText: ""
      }
    },
    methods: {
      getUserName: debounce(function() {
        Axios.get(url("user/getBoard"), {
          params: {
            id: this.form.userId,
            game: 1000
          }
        }).then((response) => {
          if (response.data.success) {
            let data = response.data.data
            this.userNameText = `，如 <strong>${data.user.id}</strong> 对应 <strong>${data.user.name}</strong>`
          } else this.userNameText = ""
        })
      }, 500)
    },
    watch: {
      "form.userId"() {
        this.getUserName()
      }
    },
    mounted() {
      this.getUserName()
    }
  })
</script>
