<template>
  <div>
    <el-button @click="openDialog(null)">Add</el-button>

    <Modal ref="modalRef" @update2="getItems" />

    <div style="padding: 5rem">
      <el-table :data="products" border style="width: 100%">
        <el-table-column prop="name_uz" label="Name Uz" min-width="180">
        </el-table-column>
        <el-table-column prop="name_ru" label="Name Ru" min-width="180">
        </el-table-column>
        <el-table-column label="Operations">
          <template slot-scope="scope">
            <el-button style="margin-right: 1rem" @click="openDialog(scope.row)"
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
              <el-button type="danger" slot="reference">Delete</el-button>
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
import Modal from '@/components/MediaModal.vue'
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
      last: null,
      first: null,
      firstItem: null,
      lastItem: null
    }
  },
  mounted () {
    this.getCount()
    this.getItems()
  },
  methods: {
    async getCount () {
      const docs = await firebase
        .firestore()
        .collection('media_setting')
        .doc('setting').get()
      this.total = docs.data().count
    },
    // eslint-disable-next-line space-before-function-paren
    async handleDelete(item) {
      await firebase
        .firestore()
        .collection('Medias')
        .doc(item.id).delete()
      await firebase
        .firestore()
        .doc('media_setting/setting')
        .set({ count: firebase.firestore.FieldValue.increment(-1) }, { merge: true })
      this.getItems()
    },
    async getItems () {
      const db = firebase.firestore()
      if (this.lastItem) {
        await db.collection('Medias').orderBy('created_at', 'desc').startAfter(this.lastItem).limit(20).get().then((querySnapshot) => {
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
        await db.collection('Medias').orderBy('created_at', 'desc').limit(20).get().then((querySnapshot) => {
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
