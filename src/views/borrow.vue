<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="borrowedView"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Borrow</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="print" max-width="500px">
            <v-card>
              <div id="toPrint" hidden>
                <v-card-title>
                  <span class="text-h5">Barangay Properties</span>
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
                    <v-col cols="12" sm="6" md="6">
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
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="editedItem.bpid"
                        :items="brgyproperties"
                        label="Brgy Property"
                        item-text="name"
                        item-value="bpid"
                        outlined
                        dense
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.qty"
                        label="Total Quantity"
                      ></v-text-field>
                    </v-col>
                  </v-row>
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
          <v-dialog v-model="dialogReturn" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure Item has been Returned?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeReturn"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="returnItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="printItem(item)">
          mdi-printer
        </v-icon>
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-clipboard-arrow-left
        </v-icon>
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
  name: "log_bpInfo",
  data: () => ({
    showprint: false,
    print: false,
    dialog: false,
    menu2: false,
    credentialsDialog: false,
    dialogReturn: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Borrow Item", value: "bpName" },
      { text: "Qty", value: "qty" },
      { text: "borrow", value: "borrow" },
      { text: "return", value: "return" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    log_bp: [],
    editedIndex: -1,
    editedItem: {
      rid: "",
      bpid: "",
      qty: 0,
      borrowdt: moment(),
      returndt: "",
    },
    defaultItem: {
      rid: "",
      bpid: "",
      qty: 0,
      borrowdt: moment(),
      returndt: "",
    },
    printingItem: {},
    residents: [],
    brgyproperties: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    borrowedView() {
      return this.log_bp.map((r) => {
        let rname = this.residents.filter((rr) => {
          return rr.rid == r.rid;
        });
        if (rname.length > 0) {
          r.name = rname[0].name;
        }
        let tname = this.brgyproperties.filter((rr) => {
          return rr.bpid == r.bpid;
        });
        if (tname.length > 0) {
          r.bpName = tname[0].name;
        }
        r.borrow = moment(r.borrowdt).format("MMMM Do YYYY, h:mm:ss a");
        if (r.returndt != null) {
          r.return = moment(r.returndt).format("MMMM Do YYYY, h:mm:ss a");
        } else {
          r.return = "";
        }
        return r;
      });
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogReturn(val) {
      val || this.closeReturn();
    },
  },

  created() {
    this.initialize();
    this.getResidents();
    this.getBrgyProperties();
  },

  methods: {
    initialize() {
      console.log(this.api);
      axios.get(`${this.api}/log_bp`).then((res) => {
        let data = res.data;
        this.log_bp = data;
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
    getBrgyProperties() {
      axios.get(`${this.api}/brgyproperties`).then((res) => {
        let data = res.data;
        this.brgyproperties = data.map((r) => {
          return {
            bpid: r.bpid,
            name: r.name,
          };
        });
      });
    },
    openMap(mapaddress) {
      window.open(mapaddress);
    },
    printItem(item) {
      this.editedIndex = this.log_bp.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.print = true;
    },
    bdateChange(item) {
      console.log(item);
    },
    editItem(item) {
      this.editedIndex = this.log_bp.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.log_bp.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogReturn = true;
    },
    returnItemConfirm() {
      this.log_bp.splice(this.editedIndex, 1);
      this.closeReturn();
    },

    close() {
      this.dialog = false;
      this.credentialsDialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeReturn() {
      this.dialogReturn = false;
      this.$nextTick(() => {
        axios.post(`${this.api}/log_bp/return`, this.editedItem).then((res) => {
          console.log(res.data);
          this.initialize();
        });
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
      delete this.editedItem.bpName;
      delete this.editedItem.borrow;
      delete this.editedItem.return;
      if (this.editedIndex > -1) {
        Object.assign(this.log_bp[this.editedIndex], this.editedItem);
        console.log("update");
        axios.post(`${this.api}/log_bp/update`, this.editedItem).then((res) => {
          console.log(res.data);
        });
      } else {
        console.log("new", this.editedItem);
        this.editedItem.borrowdt = moment();
        axios
          .post(`${this.api}/log_bp/insert`, this.editedItem)
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