<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
  >
    <el-form
      ref="ruleForm"
      label-position="top"
      label-width="120px"
      class="demo-ruleForm"
      @submit.prevent="submit"
    >
      <el-row type="flex" :gutter="20">
        <el-col>
          <div>
            <el-form-item label="Image">
              <image-box ref="imageBox" style="width: 165px; height: 165px"  />
            </el-form-item>
            <el-form-item label="Name Uz">
              <el-input v-model="name_uz" type="text" autocomplete="off" />
            </el-form-item>
             <el-form-item label="Name Ru">
              <el-input v-model="name_ru" type="text" autocomplete="off" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20">
        <el-col>
          <el-form-item label="Link">
              <el-input type="text" v-model="link" autocomplete="off" rows="7" />
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">Отменить</el-button>
      <el-button type="primary" @click="submit" :loading="loading">Сохранить</el-button>
    </div>
  </el-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import firebase from 'firebase'
import imageBox from './ImageBox.vue'

export default {
  components: {
    imageBox
  },
  data () {
    return {
      loading: false,
      visible: false,
      statuses: [],
      regions: [],

      id: null,
      file: null,
      name: '',
      link: '',
      image: '',

      fileList: [],
      fileList2: [],
      storage: null,

      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false

    }
  },

  mounted () {
  },

  methods: {
    async reset () {
      this.loading = false
      this.id = null
      this.name_uz = ''
      this.name_ru = ''
      this.link = ''
      this.image = ''

      this.fileList = []
      this.fileList2 = []

      await this.$refs.imageBox.setImage(null)
    },
    assign (item) {
      this.id = item.id
      this.name_uz = item.name_uz
      this.name_ru = item.name_ru
      this.link = item.link
      this.image = item.image

      setTimeout(() => {
        this.$refs.imageBox.setImage(this.image)
      })
    },
    open (item) {
      if (item) {
        this.assign(item)
      }

      this.visible = true
    },

    close () {
      this.reset()
      this.visible = false
    },
    async submit () {
      this.loading = true
      const image = await this.$refs.imageBox.getImage()
      if (this.id) {
        await firebase
          .firestore()
          .collection('Medias')
          .doc(this.id)
          .update({
            name_uz: this.name_uz,
            name_ru: this.name_ru,
            link: this.link,
            image: image
          })
      } else {
        await firebase
          .firestore()
          .collection('Medias')
          .add({
            name_uz: this.name_uz,
            name_ru: this.name_ru,
            link: this.link,
            image: image,
            created_at: +new Date()
          })
        await firebase
          .firestore()
          .doc('media_setting/setting')
          .set({ count: firebase.firestore.FieldValue.increment(+1) }, { merge: true })
      }
      this.close()

      this.$emit('update2')
    }
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  position: relative;
}

 .image-box-src-item {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
  }
</style>
