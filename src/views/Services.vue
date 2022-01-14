<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="serviceView"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Services</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="print" max-width="500px">
            <v-card>
              <div id="toPrint" hidden>
                <v-card-title>
                  <span class="text-h5">Services</span>
                </v-card-title>

                <v-card-text>
                  {{ editedItem }}
                  <br />
                  <br />
                  <label for="name">Name:</label>
                  <span id="name">{{ ` ${editedItem.name}` }}</span>
                  <br />
                  <br />
                  <label for="address">Address:</label> <br />
                  <span id="address">{{ ` ${editedItem.address}` }}</span>
                </v-card-text>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="printData">
                  Print
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="8">
                      <v-select
                        v-model="editedItem.rid"
                        :items="residents"
                        label="Resident Name"
                        item-text="name"
                        item-value="rid"
                        outlined
                        dense
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.type"
                        :items="serviceTypes"
                        label="Type"
                        item-text="name"
                        item-value="id"
                        outlined
                        dense
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.datetime"
                          label="Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.datetime"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.details"
                      label="Details"
                    ></v-text-field>
                  </v-col>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.gender="{ item }">
        <span v-if="item.gender == 1">Male</span>
        <span v-if="item.gender == 2">Female</span>
      </template>
      <template v-slot:item.mapaddress="{ item }">
        <v-icon small class="mr-2" @click="openMap(item.mapaddress)">
          mdi-map-marker
        </v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="printItem(item)">
          mdi-printer
        </v-icon>
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "servicesInfo",
  data: () => ({
    showprint: false,
    print: false,
    dialog: false,
    menu2: false,
    credentialsDialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Type", value: "typeName" },
      { text: "Details", value: "details" },
      { text: "Date Happened", value: "reportedDate" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    serviceTypes: [
      { id: 1, name: "Incident" },
      { id: 2, name: "Vawc" },
      { id: 3, name: "Complain" },
      { id: 4, name: "Blotter" },
    ],
    services: [],
    editedIndex: -1,
    editedItem: {
      rid: 0,
      type: 0,
      details: "",
      datetime: "",
    },
    defaultItem: {
      rid: 0,
      type: 0,
      details: "",
      datetime: "",
    },
    printingItem: {},
    residents: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    serviceView() {
      return this.services.map((r) => {
        let rname = this.residents.filter((rr) => {
          return rr.rid == r.rid;
        });
        if (rname.length > 0) {
          r.name = rname[0].name;
        }
        let tname = this.serviceTypes.filter((rr) => {
          return rr.id == r.type;
        });
        if (tname.length > 0) {
          r.typeName = tname[0].name;
        }
        r.reportedDate = moment(r.datetime).format("MMMM Do YYYY, h:mm:ss a");
        return r;
      });
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    this.getResidents();
  },

  methods: {
    initialize() {
      console.log(this.api);
      axios.get(`${this.api}/services`).then((res) => {
        let data = res.data;
        this.services = data;
      });
    },
    getResidents() {
      axios.get(`${this.api}/residents`).then((res) => {
        let data = res.data;
        this.residents = data.map((r) => {
          return {
            rid: r.rid,
            name: `${r.fname} ${r.mname} ${r.lname} ${r.suffix}`,
          };
        });
      });
    },
    openMap(mapaddress) {
      window.open(mapaddress);
    },
    printItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.print = true;
    },
    bdateChange(item) {
      console.log(item);
    },
    editItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.services.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.credentialsDialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    printData() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("toPrint").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>
  <body>
    ${prtHtml}
  </body>
</html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
    save() {
      delete this.editedItem.name;
      delete this.editedItem.typeName;
      delete this.editedItem.reportedDate;
      if (this.editedIndex > -1) {
        Object.assign(this.services[this.editedIndex], this.editedItem);
        console.log("update");
        axios
          .post(`${this.api}/services/update`, this.editedItem)
          .then((res) => {
            console.log(res.data);
          });
      } else {
        console.log("new", this.editedItem);
        axios
          .post(`${this.api}/services/insert`, this.editedItem)
          .then((res) => {
            console.log(res.data);
            this.initialize();
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.close();
    },
  },
};
</script>