<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Jobs</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-group size="md" class="mb-0">
              <span style="width: 180px;display:inline-block;">
                <multiselect
                  v-model="selectedJobArea"
                  :options="jobAreaList"
                  :multiple="true"
                  :selectLabel="''"
                  :deselectLabel="''"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="請選擇區域"
                  label="jobArea"
                  track-by="jobArea"
                >
                  <template
                    slot="selection"
                    slot-scope="{ values,  isOpen }"
                    ><span
                      class="multiselect__single"
                      v-if="values.length &amp;&amp; !isOpen"
                      >已選擇{{ values.length }}個區域</span
                    ></template
                  >
                </multiselect>
              </span>
              <span v-html="'&nbsp;&nbsp;'"></span>
            </b-form-group>
            <b-form-radio-group>
              <b-form-radio
                @change="read = null"
                style="color:white"
                :value="null"
                >全部</b-form-radio
              >
              <b-form-radio
                @change="read = true"
                style="color:white"
                :value="true"
                >已讀</b-form-radio
              >
              <b-form-radio
                @change="read = false"
                style="color:white"
                :value="false"
                >未讀</b-form-radio
              >
            </b-form-radio-group>
            <b-form-group size="sm" class="mr-sm-2">
              <b-form-checkbox-group style="color:white"
                >最愛
                <font-awesome-icon
                  :icon="['fas', 'heart']"
                  @click="favorite = !favorite"
                  v-if="favorite"
                  style="color:red"
                />
                <font-awesome-icon
                  :icon="['far', 'heart']"
                  @click="favorite = !favorite"
                  v-else
                  style="color:red"
                />
              </b-form-checkbox-group>
            </b-form-group>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="職稱"
              v-model="jobName"
            ></b-form-input>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="公司名稱"
              v-model="jobCompanyName"
            ></b-form-input>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="工作內容"
              v-model="jobContent"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="button"
              @click="search"
              >Search</b-button
            >
            <span v-html="'&nbsp;&nbsp;'"></span>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="button"
              @click="resetSearch"
              >Reset</b-button
            >
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-table
      id="my-table"
      :items="jobs"
      :per-page="perPage"
      :fields="fields"
      :tbody-tr-class="rowClass"
      @sort-changed="sortingChanged"
      :no-local-sorting="true"
      :sort-by.sync="sortKey"
      small
    >
      <template #cell(favorite)="row">
        <div>
          <font-awesome-icon
            :icon="['fas', 'heart']"
            @click="updateFavorite(row.item)"
            v-if="row.item.favorite"
            style="color:red"
          />
          <font-awesome-icon
            :icon="['far', 'heart']"
            @click="updateFavorite(row.item)"
            v-else
            style="color:red"
          />
        </div>
      </template>
      <template #cell(jobName)="row">
        <span :title="row.item.jobName">{{
          checkStringLength(row.item.jobName)
        }}</span>
      </template>
      <template #cell(jobCompany)="row">
        <a
          :href="row.item.jobCompanyUrl"
          :title="row.item.jobCompany"
          target="_blank"
          >{{ checkStringLength(row.item.jobCompany) }}
        </a>
      </template>
      <template #cell(jobContent)="row">
        <b-button
          size="sm"
          @click="info(row.item, row.index, $event.target)"
          class="mr-1"
        >
          {{ row.item.jobUpdateDate }} 更新
        </b-button>
      </template>
      <template #cell(jobUrl)="row">
        <span v-html="toUrlHtml(row.item.jobUrl)"></span>
      </template>
    </b-table>
    <!-- Info modal -->
    <b-modal
      size="lg"
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <div v-html="infoModal.content"></div>
    </b-modal>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      align="center"
      first-number
      last-number
    ></b-pagination>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-multiselect/dist/vue-multiselect.min.css";
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      fields: [
        { key: "jobId", label: "id" },
        { key: "favorite", label: "最愛", sortable: true },
        {
          key: "jobName",
          label: "職稱",
          formatter: "checkStringLength",
          sortable: true
        },
        { key: "jobCompany", label: "公司", sortable: true },
        { key: "jobContent", label: "工作內容" },
        { key: "jobArea", label: "工作地點", sortable: true },
        { key: "jobSalary", label: "薪資範圍" },
        {
          key: "jobLocation",
          label: "工作詳細地址",
          formatter: "checkStringLength"
        },
        { key: "jobUrl", label: "工作原始網址", formatter: "toUrlHtml" }
      ],
      perPage: 10,
      currentPage: 1,
      favorite: null,
      read: null,
      jobName: null,
      jobContent: null,
      jobCompanyName: null,
      selectedJobArea: [
{"id": 1},
{"id": 2},
//{"id": 3},// 內湖區
{"id": 4},
{"id": 5},
{"id": 6},
{"id": 8},
{"id": 9},
{"id": 10},
{"id": 11},
{"id": 13},
{"id": 18},
{"id": 19},
{"id": 45},
{"id": 46},
{"id": 47},
{"id": 48},
{"id": 49},
{"id": 53}],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      sort: null,
      sortKey: null
    };
  },
  computed: {
    rows() {
      return this.$store.state.rows;
    },
    jobs() {
      return this.$store.state.content;
    },
    jobAreaList() {
      let array = this.$store.state.jobAreaList;
      return array.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    }
  },
  watch: {
    read(v) {
      console.log(v);
    },
    currentPage() {
      this.getJobs();
    }
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.read) return "table-success";
    },
    getJobs: function() {
      let sort = null;
      if (this.sort != null) {
        sort = this.sort.by + "," + (this.sort.desc ? "desc" : "asc");
      }

      this.$store.dispatch("getJobs", {
        page: this.currentPage - 1,
        size: this.perPage,
        isRead: this.read,
        isFavorite: this.favorite,
        jobName: this.jobName,
        jobContent: this.jobContent,
        jobCompanyName: this.jobCompanyName,
        jobAreaIds: this.selectedJobArea.map(x => x.id).join(),
        sort: sort
      });
    },
    search() {
      this.currentPage = 1;
      this.getJobs();
    },
    resetSearch() {
      this.currentPage = 1;
      this.favorite = null;
      this.read = null;
      this.jobName = null;
      this.jobContent = null;
      this.jobCompanyName = null;
      this.selectedJobArea = [];
      this.sort = null;
      this.sortKey = null;
      this.getJobs();
    },
    getJobAreaList() {
      return this.$store.dispatch("getJobAreaList");
    },
    sortingChanged(sort) {
      this.currentPage = sort.currentPage;
      this.perPage = sort.perPage;
      this.sort = {
        by: sort.sortBy,
        desc: sort.sortDesc
      };
      this.getJobs();
    },
    checkStringLength(str) {
      if (str && str.length > 10) {
        str = str.substring(0, 10) + "...";
      }
      return str;
    },
    toUrlHtml(url) {
      return "<a href='" + url + "' target='_blank'>開啟網頁</a>";
    },
    decodeHtml(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
    info(item, index, button) {
      this.infoModal.title = item.jobName;
      this.infoModal.content = this.decodeHtml(item.jobContent);
      if (!item.read) {
        this.readJob(item.jobId);
        item.read = true;
      }
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    async readJob(jobId) {
      await this.$store.dispatch("readJob", { jobId: jobId });
    },
    async updateFavorite(item) {
      await this.$store.dispatch("updateFavorite", { jobId: item.jobId });
      item.favorite = this.$store.state.favorite
        ? !item.favorite
        : item.favorite;
    }
  },
  mounted() {
    this.getJobs();
    this.getJobAreaList();
  }
};
</script>
<style>
.multiselect__tags-wrap {
  display: none;
}
</style>
<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
label {
  /* Presentation */
  font-size: 48px;
}

/* Required Styling */

label input[type="checkbox"] {
  display: none;
}

.custom-checkbox {
  margin-left: 2em;
  position: relative;
  cursor: pointer;
}
.custom-checkbox .glyphicon {
  color: gold;
  position: absolute;
  top: 0.4em;
  left: -1.25em;
  font-size: 0.75em;
}

.custom-checkbox .glyphicon-star-empty {
  color: gray;
}

.custom-checkbox .glyphicon-star {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.custom-checkbox:hover .glyphicon-star {
  opacity: 0.5;
}

.custom-checkbox input[type="checkbox"]:checked ~ .glyphicon-star {
  opacity: 1;
}
@media (min-width: 992px) {
  .modal-lg {
    max-width: auto !important;
  }
}
@media (min-width: 576px) {
  .modal-dialog {
    max-width: auto !important;
  }
}
</style>
