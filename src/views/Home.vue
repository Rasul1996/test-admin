<template>
  <div>
    <el-button @click="openDialog(null)">Add</el-button>

    <Modal ref="modalRef" @update="getItems" />

    <div style="padding: 5rem">
      <el-table :data="products" border style="width: 100%">
        <el-table-column prop="name_uz" label="Name Uz" min-width="180">
        </el-table-column>
        <el-table-column prop="name_ru" label="Name Ru" min-width="180">
        </el-table-column>
        <el-table-column label="Category" min-width="180">
          <template slot-scope="scope">{{ options[scope.row.category_id-1] }}</template>
        </el-table-column>
        <el-table-column label="Operations">
          <template slot-scope="scope">
            <el-button size="small" style="margin-right: 1rem" @click="openDialog(scope.row)"
              >Edit</el-button
            >
            <el-popconfirm
              @confirm="handleDelete(scope.row)"
              confirm-button-text='OK'
              cancel-button-text='No, Thanks'
              icon="el-icon-info"
              icon-color="red"
              title="Are you sure to delete this?"
            >
              <el-button size="small" type="danger" slot="reference">Delete</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
  background
  layout="prev, pager, next"
  :current-page="page"
  :page-size="20"
  :page-count="10"
  :next-click="getNext"
  :total="total">
</el-pagination>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue'
import firebase from 'firebase'

export default {
  components: {
    Modal
  },
  data () {
    return {
      total: 1,
      page: 1,
      items: [],
      products: [],
      product: null,
      options: ['Хлеба', 'ОМЛЕТЫ', 'КАШИ', 'БЛИНЧИКИ', 'БУТЕРБРОДЫ', 'БЛЮДА ИЗ ТВОРОГА', 'САЛАТЫ', 'Супы', 'ОСНОВНЫЕ БЛЮДА', 'МУЧНЫЕ БЛЮДА', 'ВЫПЕЧКИ И СЛАДОСТИ', 'ГАРНИРЫ И СОУСА', 'ГОРЯЧИЕ И ХОЛОДНЫЕ НАПИТКИ'
      ],
      last: null,
      first: null,
      firstItem: null,
      lastItem: null
    }
  },
  mounted () {
    this.getItems()
    this.getCount()
  },
  methods: {
    async getCount () {
      const docs = await firebase
        .firestore()
        .collection('product_setting')
        .doc('setting').get()
      this.total = docs.data().count
    },
    // eslint-disable-next-line space-before-function-paren
    async handleDelete(item) {
      await firebase
        .firestore()
        .collection('Products')
        .doc(item.id).delete()
      this.getItems()
      await firebase
        .firestore()
        .doc('product_setting/setting')
        .set({ count: firebase.firestore.FieldValue.increment(-1) }, { merge: true })
    },
    async getItems () {
      const db = firebase.firestore()
      if (this.lastItem) {
        await db.collection('Products').orderBy('created_at', 'desc').startAfter(this.lastItem).limit(20).get().then((querySnapshot) => {
          this.products = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data()
            }
          })
          if (querySnapshot.docs.length > 0) {
            this.last = querySnapshot.docs[querySnapshot.docs.length - 1]
            this.first = querySnapshot.docs[0]
          }
        })
      } else {
        await db.collection('Products').orderBy('created_at', 'desc').limit(20).get().then((querySnapshot) => {
          this.products = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data()
            }
          })
          if (querySnapshot.docs.length > 0) {
            this.last = querySnapshot.docs[querySnapshot.docs.length - 1]
            this.first = querySnapshot.docs[0]
          }
        })
      }
    },
    async getNext () {
      this.lastItem = this.last
      this.getItems()
    },
    openDialog (item) {
      this.$refs.modalRef.open(item)
    }
  }
}
</script>
