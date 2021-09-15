<template>
  <div>
    <div class="image-box-container" @click="$refs.inputRef.click()">
      <img v-if="src || isLocal" :src="getImageURL" alt="">
      <div class="edit-icon">
        <i class="el-icon-upload" />
      </div>
    </div>
    <input ref="inputRef" type="file" hidden accept="image/*" @change="imageSelected">
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      src: '',
      file: '',
      isLocal: false
    }
  },
  computed: {
    getImageURL () {
      let result = ''

      if (this.isLocal) {
        // result = URL.createObjectURL(src);
        result = this.src
      } else {
        if (this.src) {
          result = `${this.src}`
        }
      }

      return result
    }
  },
  methods: {
    imageSelected (e) {
      const file = e.target.files[0]
      const reader = new FileReader()

      if (!file) return

      reader.readAsDataURL(file)
      this.file = file

      reader.onload = (e) => {
        const src = e.target?.result
        this.src = src
        this.isLocal = true
      }
    },

    reset () {
      this.src = null
      this.file = null
      this.isLocal = false
    },

    setImage (src) {
      this.src = src
      this.isLocal = false
    },

    async uploadFile (src) {
      try {
        const ref = firebase.storage().ref()
        const name = (+new Date()) + '-' + this.file.name
        const metadata = {
          contentType: this.file.type
        }
        const task = await ref.child('images/' + name).put(this.file, metadata)
        const result = await task.ref.getDownloadURL()

        return result
      } catch (error) {
        throw ('Error', error)
      }
    },

    async getImage () { // it for outside components that need img src
      let resultSrc = this.src // current src
      if (this.isLocal) {
        try {
          const result = await this.uploadFile(this.file, 'image')
          resultSrc = result
        } catch (error) {
          throw ('error in getImage', error)
        }
      }

      return resultSrc
    }
  }
}
</script>

<style lang="scss" scoped>
.image-box-container {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    // background: var(--secondary);
    border: 1px solid red;
    border-radius: 32px;

    cursor: pointer;

    position: relative;

    img {
        width: 100%;
        height: 100%;

        object-fit: cover;
        border-radius: 16px;
    }

    .edit-icon {
        // background-color: var(--secondary);
        opacity: 0.8;
        width: 100%;
        height: 100%;
        position: absolute;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 16px;

        i {
            font-size: 2rem;
        }
    }
}
</style>
