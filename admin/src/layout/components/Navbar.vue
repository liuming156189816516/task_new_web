<template>
  <div class="navbar">
    <div class="right-menu">
      <div v-if="isServe" class="serveic_img" @click="jumpServeTg">
        <span class="icon_img">
          <img src="../../assets/tg_icon.png" alt="" srcset="">
        </span>
        <span>
          {{ $t('sys_l107') }}
        </span>
      </div>

      <error-log class="errLog-container right-menu-item hover-effect" />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-name">国家：{{ getLabelByVal(itemZonesVal,itemZonesData.options) }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in itemZonesData.options " :key="index" @click.native="clickItemZoneFun(item)">
            <span style="display:block;">{{ item.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <i class="el-icon-user" />
          <span class="user-name">{{ userInfo.account }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <template v-if="userInfo.account_type != 3">
            <router-link to="/change-password">
              <el-dropdown-item>{{ $t('sys_c098') }}</el-dropdown-item>
            </router-link>
          </template>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('sys_l015') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabelByVal } from '@/utils';
export default {
  components: { },
  data() {
    return {
      langeIdx: 0,
      itemZonesData: {
        options: [
          { label: '北京',value: 'Asia/Shanghai' },
          { label: '巴西',value: 'America/Sao_Paulo' },
          { label: '马来西亚',value: 'Asia/Kuala_Lumpur' },
        ]
      },
    }
  },
  computed: {
    ...mapGetters(['sidebar','userInfo']),
    expireTime() {
      const expireTime = this.userInfo;
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      const timeDifference = expireTime.valid_time - currentTimeStamp;
      const hoursDifference = timeDifference / (60 * 60);
      return hoursDifference <= 24 && expireTime.account !== 'admin';
    },
    isServe() {
      return process.env.VUE_APP_OUTDIR === 'prod';
    },
    itemZonesVal() {
      return this.$store.getters['timeZone/currentTimeZone']
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout');
      // this.$router.replace('/login')
      location.reload();
    },
    jumpServeTg() {
      window.open(process.env.VUE_APP_TG,'_blank');
    },
    // 切换时区
    clickItemZoneFun(item) {
      this.$setTimeZone(item.value)
      console.log('item',item)
    },
    getLabelByVal
  }
}
</script>
<style>
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    align-items: center;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .serveic_img{
      display: flex;
      height:100%;
      color: #409eff;
      cursor: pointer;
      font-size: 14px;
      margin-right: 10px;
      align-items: center;
      .icon_img{
        display: flex;
        width: 25px;
        height: 25px;
        flex-shrink: 0;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-right: 2px;
        // background-color: #409eff;
        background: linear-gradient(131.49deg, rgb(0, 174, 232) 0%, rgb(0, 164, 209) 100%);
        img{
          display: flex;
          height: 14px;
          width: 14px;
        }
      }
    }
    .serveic_img:hover{
      color: #409eff;
      text-decoration: underline;
    }

    .sys_use_time {
      color: #5a5e66;
      font-size: 14px;
      font-weight: 700;
      margin-right: 10px;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      cursor: pointer;
      margin-right: 10px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }

    .avatar-container {
      background: transparent;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-user {
          font-size: 18px;
        }

        .user-name {
          margin: 0 6px;
          font-size: 14px;
        }

        .el-icon-arrow-down {
          cursor: pointer;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
