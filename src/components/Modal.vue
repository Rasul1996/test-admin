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

        <el-col>
          <div>
            <el-form-item label="Header Image">
              <image-box ref="imageBoxHeader" style="width: 165px; height: 165px"  />
            </el-form-item>
            <el-form-item label="Category">
              <el-select v-model="value" placeholder="Select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>

        <el-col>
          <div>
            <el-form-item label="Ingredients">
              <image-box ref="imageBoxIng" style="width: 165px; height: 165px"  />
            </el-form-item>
            <el-form-item label="Minute">
              <el-input-number v-model="min" autocomplete="off" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20">
        <el-col>
          <el-form-item label="Body Uz">
              <el-input type="textarea" v-model="body_uz" autocomplete="off" rows="7" />
            </el-form-item>
            <el-form-item label="Body Ru">
              <el-input type="textarea" v-model="body_ru" autocomplete="off" rows="7" />
            </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="Quality Uz">
            <el-input v-model="quality_uz" type="textarea" autocomplete="off" rows="7" />
          </el-form-item>
          <el-form-item label="Quality Ru">
            <el-input v-model="quality_ru" type="textarea" autocomplete="off" rows="7" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="Images">
            <div style="display: flex; flex-wrap: wrap; margin-top:20px;">
              <div v-for="(image, idx) of images" :key="image" class="image-container">
                <imageBox :ref="`imageRef${image}`" class="image-box-src-item" :style="`margin-left: ${idx == 0 ? '2rem' : '2rem'}`" />
                <!-- <el-button style="border-radius: 50%" @click="removeImage(image)"><i class="ri-delete-bin-line" /></el-button> -->
                <el-button size="small" type="danger" style="position: absolute; top: -0.5rem; right: -0.5rem" circle @click="removeImage(image)">
                  <i class="el-icon-close" />
                </el-button>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end">
              <el-button type="primary" style="margin-top: 1rem; margin-left: auto" circle @click="images.push(Date.now())">
                <i class="el-icon-plus" />
              </el-button>
            </div>
          </el-form-item>
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
      body: '',
      image: '',
      images: [Date.now()],
      category_id: 0,
      min: 0,
      header_image: '',
      quality: '',
      ingredients: '',

      fileList: [],
      fileList2: [],
      storage: null,
      options: [{
        value: 1,
        label: 'Хлеба'
      }, {
        value: 2,
        label: 'ОМЛЕТЫ'
      }, {
        value: 3,
        label: 'КАШИ'
      }, {
        value: 4,
        label: 'БЛИНЧИКИ'
      }, {
        value: 5,
        label: 'БУТЕРБРОДЫ'
      }, {
        value: 6,
        label: 'БЛЮДА ИЗ ТВОРОГА'
      }, {
        value: 7,
        label: 'САЛАТЫ'
      }, {
        value: 8,
        label: 'Супы'
      }, {
        value: 9,
        label: 'ОСНОВНЫЕ БЛЮДА'
      }, {
        value: 10,
        label: 'МУЧНЫЕ БЛЮДА'
      }, {
        value: 11,
        label: 'ВЫПЕЧКИ И СЛАДОСТИ'
      }, {
        value: 12,
        label: 'ГАРНИРЫ И СОУСА'
      }, {
        value: 13,
        label: 'ГОРЯЧИЕ И ХОЛОДНЫЕ НАПИТКИ'
      }],
      value: 0,

      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false

    }
  },

  mounted () {
  },

  methods: {
    removeImage (id) {
      // eslint-disable-next-line eqeqeq
      this.images = this.images.filter(data => data != id)
    },
    async reset () {
      this.loading = false
      this.id = null
      this.name_uz = ''
      this.name_ru = ''
      this.body_uz = ''
      this.body_ru = ''
      this.image = ''
      this.category_id = null
      this.min = null
      this.header_image = ''
      this.quality_uz = ''
      this.quality_ru = ''
      this.ingredients = ''

      this.fileList = []
      this.fileList2 = []

      await this.$refs.imageBox.setImage(null)
      await this.$refs.imageBoxHeader.setImage(null)
      await this.$refs.imageBoxIng.setImage(null)

      for (const image of this.images) {
        await this.$refs[`imageRef${image}`][0].setImage(null)
      }

      this.images = [Date.now()]
    },
    assign (item) {
      this.id = item.id
      this.name_uz = item.name_uz
      this.name_ru = item.name_ru
      this.body_uz = item.body_uz
      this.body_ru = item.body_ru
      this.image = item.image
      this.category_id = item.category_id
      this.value = item.category_id
      this.min = item.min
      this.header_image = item.header_image
      this.quality_uz = item.quality_uz
      this.quality_ru = item.quality_ru
      this.ingredients = item.ingredients
      this.images = item.images

      setTimeout(() => {
        this.$refs.imageBox.setImage(this.image)
        this.$refs.imageBoxHeader.setImage(this.header_image)
        this.$refs.imageBoxIng.setImage(this.ingredients)
      })

      for (const photo of this.images) {
        setTimeout(() => {
          this.$refs[`imageRef${photo}`][0].setImage(photo)
        })
      }
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
      const headerImage = await this.$refs.imageBoxHeader.getImage()
      const ingredients = await this.$refs.imageBoxIng.getImage()
      const images = []
      for (const image of this.images) {
        const item = await this.$refs[`imageRef${image}`][0].getImage()
        images.push(item)
      }
      let searchArray = new Set()
      let s = ''
      for (let index = 0; index < this.name.length; index++) {
        s += this.name[index].toLowerCase()
        searchArray.add(s)
      }
      searchArray = new Set([...searchArray, ...this.name.toLowerCase().split(' ')])
      if (this.id) {
        await firebase
          .firestore()
          .collection('Products')
          .doc(this.id)
          .update({
            name_uz: this.name_uz,
            name_ru: this.name_ru,
            body_uz: this.body_uz,
            body_ru: this.body_ru,
            image: image,
            images: images,
            category_id: this.value,
            min: this.min,
            header_image: headerImage,
            quality_uz: this.quality_uz,
            quality_ru: this.quality_ru,
            ingredients: ingredients,
            search_uz: this.name_uz.toLowerCase(),
            search_ru: this.name_ru.toLowerCase(),
            searchArray: [...searchArray]
          })
      } else {
        await firebase
          .firestore()
          .collection('Products')
          .add({
            name_uz: this.name_uz,
            name_ru: this.name_ru,
            body_uz: this.body_uz,
            body_ru: this.body_ru,
            image: image,
            images: images,
            category_id: this.value,
            min: this.min,
            header_image: headerImage,
            quality_uz: this.quality_uz,
            quality_ru: this.quality_ru,
            ingredients: ingredients,
            created_at: +new Date(),
            search_uz: this.name_uz.toLowerCase(),
            search_ru: this.name_ru.toLowerCase(),
            searchArray: [...searchArray]
          })
        await firebase
          .firestore()
          .doc('product_setting/setting')
          .set({ count: firebase.firestore.FieldValue.increment(+1) }, { merge: true })
      }
      this.close()

      this.$emit('update')
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
