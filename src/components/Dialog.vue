<template>
  <el-dialog
    :close-on-click-modal="false"
    title="Коллекция"
    :visible.sync="visible"
    width="30%"
  >
    <el-form ref="ruleForm" label-position="top" :model="form" status-icon :rules="rules" label-width="120px" class="demo-ruleForm" @submit.prevent="submit">
      <el-row type="flex" :gutter="20">
        <el-col>
          <el-form-item label="Наименование РУ" prop="nameRu">
            <el-input v-model="form.nameRu" type="text" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="Nomi UZ" prop="nameUz">
            <el-input v-model="form.nameUz" type="text" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20">
        <el-col :span="12">
          <el-form-item label="Статус" prop="status">
            <el-checkbox v-model="form.isActive">Актив</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <div style="display: flex; flex-wrap: wrap;">
              <div v-for="(image, idx) of form.images" :key="image" class="image-container">
                <ImageBox :ref="`imageRef${image}`" class="image-box-src-item" :style="`margin-left: ${idx == 0 ? '2rem' : '2rem'}`" />
                <!-- <el-button style="border-radius: 50%" @click="removeImage(image)"><i class="ri-delete-bin-line" /></el-button> -->
                <el-button size="small" type="danger" style="position: absolute; top: -0.5rem; right: -0.5rem" circle @click="removeImage(image)">
                  <i class="ri-delete-bin-line" />
                </el-button>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end">
              <el-button type="primary" style="margin-top: 1rem; margin-left: auto" circle @click="form.images.push(Date.now())">
                <i class="ri-add-line" />
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">Отменить</el-button>
      <el-button type="primary" @click="submit">Сохранить</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageBox from '@/components/ImageBox.vue'

export default {
  components: {
    ImageBox
  },
  data () {
    return {
      visible: false,
      statuses: [],
      regions: [],

      form: {
        id: null,
        nameRu: '',
        nameUz: '',
        isActive: false,
        images: [Date.now()]
      },

      rules: {
        nameRu: [
          { required: true, message: 'Это поле обязательно к заполнению', trigger: 'blur' }
        ],
        nameUz: [
          { required: true, message: 'Это поле обязательно к заполнению', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    removeImage (id) {
      this.form.images = this.form.images.filter(data => data !== id)
    },
    reset () {
      this.$refs.ruleForm.resetFields()

      this.form.id = null
      this.form.nameUz = ''
      this.form.nameRu = ''
      this.form.descriptionRu = ''
      this.form.descriptionUz = ''
      this.form.isActive = false
      this.form.price = ''
      this.form.images = [0]
    },
    assign (item) {
      this.form.id = item.id
      this.form.nameUz = item.nameUz
      this.form.nameRu = item.nameRu
      this.form.isActive = item.isActive

      setTimeout(() => {
        const photos = item.photos.split(',')

        this.form.images = photos
        for (const photo of photos) {
          setTimeout(() => {
            this.$refs[`imageRef${photo}`][0].setImage(photo)
          })
        }
      })
    },
    open (item) {
      this.visible = true
      if (item) {
        this.assign(item)
      }
    },

    close () {
      this.reset()
      this.visible = false
    },

    submit () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const images = []
          for (const image of this.form.images) {
            const item = await this.$refs[`imageRef${image}`][0].getImage()
            images.push(item)
          }

          // eslint-disable-next-line no-unreachable
          await this.$axios({
            url: 'product/collection',
            method: this.form.id ? 'PUT' : 'POST',
            data: {
              id: this.form.id,
              nameRu: this.form.nameRu,
              nameUz: this.form.nameUz,
              isActive: this.form.isActive,
              photos: images.join(',')
            }
          })
          this.close()
          this.$emit('update')
        }
      })
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
