<template>
  <div>
    <!-- 搜索历史的标题 -->
    <van-cell title="搜索历史">
      <template #extra>
        <!-- 点击小垃圾桶图标，出现编辑状态'全部删除' '完成'，所以isDelete为true,即取反 -->
        <van-icon name="delete-o" @click="isDelete = true" v-if="!isDelete" />
        <div v-else>
          <!-- 传一个空数组给store-index.js里的mutations方法，传给histories，那么所有的就删除了 -->
          <span @click="$store.commit('SET_HISTORIES', [])">全部删除</span>
          &nbsp;
          <span @click="isDelete = false">完成</span>
        </div>
      </template>
    </van-cell>

    <!-- 搜索历史每一项 -->
    <!-- item已去重，可以绑定Key -->
    <!-- 点击搜索记录，也能出现搜索结果，历史里的值成为用户输入的keywords -->
    <van-cell
      v-for="(item, index) in histories"
      :key="index"
      :title="item"
      @click="!isDelete && $emit('change-keywords', item)"
    >
      <template #extra>
        <!-- 出现'全部删除' '完成'的同时，出现×号，和上面的v-else同状态 -->
        <van-icon
          name="close"
          v-show="isDelete"
          @click="
            $store.commit(
              'SET_HISTORIES',
              histories.filter((i) => item !== i)
            )
          "
        />
      </template>
    </van-cell>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isDelete: false // 不出现'全部删除' '完成'，没有处于编辑状态
    }
  },
  computed: {
    ...mapState(['histories'])
  }
}
</script>

<style></style>
