<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell title="我的频道">
      <van-button
        class="btn"
        size="mini"
        round
        style="color: red; border-color: red"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>

    <!-- 每一个小频道 -->
    <div class="my-pannel">
      <!-- gutter: 格子之间的间距，默认单位为px -->
      <!-- border: 是否显示边框，默认为true -->
      <van-grid gutter="10" :border="false">
        <!-- 和Home index.js里面的频道是一样的，channels数据传进来 -->
        <!-- icon部分：不然推荐的小频道有×号 -->
        <van-grid-item
          v-for="(item, index) in myChannels"
          :key="item.id"
          :text="item.name"
          :class="{ active: item.name === '推荐' }"
          :icon="isEdit && item.name !== '推荐' ? 'cross' : ''"
          @click="handleMyChannels(item, index)"
        >
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 推荐频道 -->
    <van-cell title="推荐频道"> </van-cell>
    <!-- 每一个小频道 -->
    <div class="recommend-pannel">
      <!-- gutter: 格子之间的间距，默认单位为px -->
      <!-- border: 是否显示边框，默认为true -->
      <van-grid gutter="10" :border="false">
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          :text="item.name"
          icon="plus"
          @click="$emit('add-channel', item)"
        >
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannelsAPI } from '@/api/channel'
export default {
  props: { myChannels: Array }, // 传过来的'我的频道'
  data() {
    return {
      isEdit: false,
      allChannels: [] // 获取所有的频道
    }
  },
  computed: {
    recommendChannels() {
      // 推荐频道计算：所有频道-我的频道
      // const target = this.myChannels.find((item2) => { item2.id === item.id})
      // find方法，找到了就返回具体的元素，没找到就返回undefined
      // 相当于去重，有重合的为false,就过滤掉，保留没有重合的，就是推荐频道
      return this.allChannels.filter((allChannelsItem) => {
        return !this.myChannels.find(
          (myChannelsItem) => myChannelsItem.id === allChannelsItem.id
        )
      })
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannelsAPI()
      // console.log(data)
      this.allChannels = data.data.channels
    },
    handleMyChannels({ name, id }, index) {
      if (this.isEdit && name !== '推荐') {
        this.$emit('del-channel', id)
      } else {
        // 1.关闭弹窗  2.切换频道
        this.$emit('change-active', index)
      }
    }
  }
}
</script>

<style scoped lang="less">
:deep(.active) {
  .van-grid-item__text {
    color: red;
  }
}
// postcss插件无法把行内样式转为rem,所以把样式写在下面
.channel-edit {
  padding-top: 92px;
}
:deep(.btn) {
  width: 100px;
  font-size: 25px;
}
:deep(.van-grid-item__content) {
  background-color: #f4f5f6;
}
// 我的频道
.my-pannel {
  // 编辑按钮居中
  .van-cell__value {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  // 关闭按钮样式
  :deep(.van-grid-item__content) {
    position: relative;

    .van-grid-item__content {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
:deep(.van-icon-cross) {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 25px;
  transform: translate(20%, -35%);
  border: 0.02667rem solid #000;
  border-radius: 50%;
  text-align: center;
  line-height: 0.32rem;
}
// 推荐频道
.recommend-pannel {
  // 推荐频道加号样式
  :deep(.van-grid-item__content) {
    flex-direction: row;

    .van-grid-item__icon {
      font-size: 0.5rem;
    }

    .van-grid-item__text {
      margin-top: 0;
    }
  }
}
</style>
