<template>
  <div class="home">
    <b-nav-form>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">Jobs</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input
                size="sm"
                class="mr-sm-2"
                placeholder="過濾名稱"
                v-model="filter"
              ></b-form-input>
              <b-select
                size="sm"
                v-model="filterType"
                :options="filterTypeOptions"
                class="mr-sm-2"
                value-field="type"
                text-field="name"
                placeholder="過濾類別"
              >
              </b-select>
              &nbsp;
              <b-select
                size="sm"
                v-model="status"
                :options="statusOptions"
                class="mr-sm-2"
                value-field="value"
                text-field="text"
                placeholder="狀態"
              >
              </b-select>
              &nbsp;
              <b-button
                size="sm"
                class="my-2 my-sm-0"
                type="button"
                @click="getFilters"
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
      <b-form-group size="md" class="mb-0">
        <span v-html="'&nbsp;&nbsp;'"></span>
        <b-button class="mb-3" @click="openAddFilterModel()">新增過濾</b-button>
      </b-form-group>
    </b-nav-form>
    <br />
    <b-table
      id="my-table"
      :items="filters"
      :per-page="perPage"
      :fields="fields"
      :tbody-tr-class="rowClass"
      @sort-changed="sortingChanged"
      :no-local-sorting="true"
      :sort-by.sync="sortKey"
      small
    >
      <template #cell(filterType)="row">
        {{ findType(row.item.filterType) }}
      </template>
      <template #cell(modify)="row">
        <b-button @click="editModel(row.item, row.index, $event.target)"
          >修改</b-button
        >
      </template>
    </b-table>
    <!-- Info modal -->
    <b-modal
      size="lg"
      :id="editFilter.modelId"
      title="修改Filter"
      @ok="ok()"
      @cancel="cancel()"
    >
      <pre>
        <b-nav-form>
          <b-form-group size="md" class="mb-0">
            <b-input class="mb-3" v-model="editFilter.filterName" placeholder="過濾名稱" />
            &nbsp;
            <b-select
              v-model="editFilter.filterType"
              :options="filterTypes"
              class="mb-3"
              value-field="type"
              text-field="name"
              placeholder="過濾類別"
            >
            </b-select>
            &nbsp;        
            <b-form-radio-group
              id="btn-radios-2"
              v-model="editFilter.status"
              :options="options"
              button-variant="outline-primary"
              size="sm"
              name="radio-btn-outline"
              buttons
            ></b-form-radio-group>
          </b-form-group>
      </b-nav-form>
      </pre>
      <template #modal-footer="{ ok, cancel }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button size="sm" variant="success" @click="ok()">
          更新
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          取消
        </b-button>
      </template>
    </b-modal>
    <b-modal id="messageModal" ok-only>
      {{ alertMessage }}
    </b-modal>
    <b-modal size="lg" id="addFilterModal" title="新增Filter" @ok="addFilter()">
      <b-input class="mb-3" v-model="filter" placeholder="過濾名稱" />
      &nbsp;
      <b-select
        v-model="filterType"
        :options="filterTypeOptions"
        class="mb-3"
        value-field="type"
        text-field="name"
        placeholder="過濾類別"
      >
      </b-select>
      <template #modal-footer="{ ok, cancel }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button size="sm" variant="success" @click="ok()">
          新增過濾
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          取消
        </b-button>
      </template>
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
export default {
  name: "jobSettings",
  data() {
    return {
      fields: [
        { key: "id", label: "id" },
        {
          key: "filterName",
          label: "過濾名稱",
          sortable: true
        },
        { key: "filterType", label: "過濾類別", sortable: true },
        {
          key: "status",
          label: "狀態",
          sortable: true,
          formatter: "changeStatus"
        },
        {
          key: "modify",
          label: "修改",
          sortable: false
        }
      ],
      filter: null,
      filterType: null,
      status: null,
      filterTypes: [
        {
          name: "公司名稱",
          type: "COMPANY_NAME"
        },
        {
          name: "工作名稱",
          type: "JOB_NAME"
        },
        {
          name: "區塊名稱",
          type: "AREA_NAME"
        }
      ],
      options: [
        { text: "啟用", value: "ACTIVATED" },
        { text: "停用", value: "DISABLED" },
        { text: "刪除", value: "DELETED" }
      ],
      modifyContent: [],
      perPage: 10,
      currentPage: 1,
      sort: null,
      sortKey: null,
      editFilter: {
        modelId: "info-modal",
        id: null,
        filterName: null,
        filterType: null,
        status: null
      },
      alertMessage: null
    };
  },
  watch: {
    currentPage() {
      this.getFilters();
    }
  },
  computed: {
    rows() {
      return this.$store.state.rows;
    },
    filters() {
      return this.$store.state.content;
    },
    updateFilterSuccess() {
      return this.$store.state.updateFilterSuccess;
    },
    filterTypeOptions() {
      return [
        {
          name: "全部",
          type: null
        }
      ].concat(this.filterTypes);
    },
    statusOptions() {
      return [
        { text: "全部", value: null },
        { text: "啟用", value: "ACTIVATED" },
        { text: "停用", value: "DISABLED" }
      ];
    }
  },
  methods: {
    findType(type) {
      let result = null;
      this.filterTypes.forEach(item => {
        if (item.type === type) {
          result = item.name;
        }
      });
      return result;
    },
    addFilter() {
      if (this.filter == null || this.filterType == null) {
        alert("filter 是空值");
        return;
      }
      this.$store.dispatch("addFilter", {
        filterName: this.filter,
        filterType: this.filterType
      });
    },
    async updateFilter() {
      await this.$store.dispatch("updateFilter", {
        id: this.editFilter.id,
        filterName: this.editFilter.filterName,
        filterType: this.editFilter.filterType,
        status: this.editFilter.status
      });
    },
    deleteFilter(id) {
      this.$store.dispatch("deleteFilter", {
        filterId: id
      });
    },
    async getFilters() {
      let sort = null;
      if (this.sort != null) {
        sort = this.sort.by + "," + (this.sort.desc ? "desc" : "asc");
      }
      await this.$store.dispatch("getFilters", {
        page: this.currentPage - 1,
        size: this.perPage,
        filterName: this.filter,
        filterType: this.filterType,
        statusType: this.status,
        sort: sort
      });
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.read) return "table-success";
    },
    sortingChanged(sort) {
      this.currentPage = sort.currentPage;
      this.perPage = sort.perPage;
      this.sort = {
        by: sort.sortBy,
        desc: sort.sortDesc
      };
      this.getFilters();
    },
    resetSearch() {
      this.filter = null;
      this.filterType = null;
      this.status = null;
      this.sort = null;
      this.sortKey = null;
    },
    editModel(item, index, button) {
      this.editFilter.id = item.id;
      this.editFilter.filterName = item.filterName;
      this.editFilter.filterType = item.filterType;
      this.editFilter.status = item.status;
      this.$root.$emit("bv::show::modal", this.editFilter.modelId, button);
    },
    resetEditFilter() {
      this.editFilter.filterName = null;
      this.editFilter.filterType = null;
      this.editFilter.status = null;
    },
    ok() {
      this.updateFilter();
      this.executeAlertMessage(() => {
        if (this.updateFilterSuccess) {
          this.message("更新成功");
          this.getFilters();
        }
      });
    },
    cancel() {
      this.resetEditFilter();
    },
    openAddFilterModel() {
      this.$root.$emit("bv::show::modal", "addFilterModal");
    },
    executeAlertMessage(func) {
      setTimeout(() => {
        func();
      }, 300);
    },
    message(msg) {
      this.alertMessage = msg;
      this.$root.$emit("bv::show::modal", "messageModal");
    }
  },
  mounted() {
    this.getFilters();
  }
};
</script>
