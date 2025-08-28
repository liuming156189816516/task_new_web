<!-- 预览图片 -->
<template>
  <transition name="preview-fade">
    <div v-if="visible" class="preview-overlay" :aria-hidden="!visible" @click.self="handleClose">
      <transition name="preview-zoom">
        <div
          v-show="visible"
          class="preview-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="alt || '图片预览'"
        >
          <button class="preview-close" aria-label="关闭" @click="handleClose">
            <span class="preview-close-x">×</span>
          </button>

          <div class="preview-body">
            <img
              v-if="src"
              :src="src"
              :alt="alt"
              class="preview-img"
              @load="onImgLoad"
              @error="onImgError"
            >
            <div v-else class="preview-empty">无图片</div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ImagePreview',
  model: {
    prop: 'visible',
    event: 'input'
  },
  props: {
    visible: { type: Boolean, default: false },
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    closeOnEsc: { type: Boolean, default: true },
    closeOnClickOverlay: { type: Boolean, default: true }
  },
  data() {
    return {
      imgLoaded: false,
      imgError: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.lockScroll(true);
        this.$nextTick(() => {
          if (this.closeOnEsc) window.addEventListener('keydown', this.onKeydown);
        });
      } else {
        this.unlock();
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.lockScroll(true);
      if (this.closeOnEsc) window.addEventListener('keydown', this.onKeydown);
    }
  },
  beforeDestroy() {
    this.unlock();
  },
  methods: {
    handleClose() {
      this.$emit('input', false);
      this.$emit('close');
    },
    onKeydown(e) {
      if (e.key === 'Escape') this.handleClose();
    },
    onImgLoad() {
      this.imgLoaded = true;
      this.imgError = false;
    },
    onImgError() {
      this.imgError = true;
      this.imgLoaded = false;
    },
    lockScroll(add) {
      if (add) document.documentElement.classList.add('preview-lock');
    },
    unlock() {
      document.documentElement.classList.remove('preview-lock');
      window.removeEventListener('keydown', this.onKeydown);
    }
  }
};
</script>

<style scoped lang="scss">
/* 遮罩层淡入淡出 */
.preview-fade-enter-active, .preview-fade-leave-active { transition: opacity .2s ease; }
.preview-fade-enter, .preview-fade-leave-to { opacity: 0; }

/* 弹窗缩放过渡 */
.preview-zoom-enter-active, .preview-zoom-leave-active { transition: transform .2s ease, opacity .2s ease; }
.preview-zoom-enter, .preview-zoom-leave-to { transform: scale(.98); opacity: 0; }

/* 遮罩层 */
.preview-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,.6);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}

/* 弹窗容器，最大不超过窗口 80% */
.preview-dialog {
  position: relative;
  max-width: 80vw; max-height: 80vh;
  background: rgba(0,0,0,.2); /* 轻微蒙层，衬托图片 */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
}

/* 关闭按钮 */
.preview-close {
  position: absolute; top: 8px; right: 8px;
  width: 36px; height: 36px; border-radius: 18px;
  border: none; outline: none; cursor: pointer;
  background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center;
}
.preview-close:hover { background: rgba(0,0,0,.65); }
.preview-close-x { color: #fff; font-size: 22px; line-height: 1; }

/* 图片容器 */
.preview-body {
  display: flex; align-items: center; justify-content: center;
  max-width: 80vw; max-height: 80vh;
}

/* 图片等比缩放，自动适应 */
.preview-img {
  display: block;
  max-width: 100%;
  max-height: 80vh; /* 限制总高度 */
  height: auto; width: auto;
}

.preview-empty {
  color: #fff; padding: 32px;
}
</style>

<style>
.preview-lock { overflow: hidden; }
</style>
