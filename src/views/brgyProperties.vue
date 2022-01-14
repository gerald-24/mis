<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="brgyproperties"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Barangay Properties</v-toolbar-title>
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
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.description"
                        label="Description"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.totalqty"
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
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
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
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-delete
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
export default {
  name: "brgypropertiesInfo",
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
      { text: "Description", value: "description" },
      { text: "Total Qty", value: "totalqty" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    brgyproperties: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      description: "",
      totalqty: 0,
    },
    defaultItem: {
      name: "",
      description: "",
      totalqty: 0,
    },
    printingItem: {},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      console.log(this.api);
      axios.get(`${this.api}/brgyproperties`).then((res) => {
        let data = res.data;
        this.brgyproperties = data;
      });
    },
    openMap(mapaddress) {
      window.open(mapaddress);
    },
    printItem(item) {
      this.editedIndex = this.brgyproperties.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.print = true;
    },
    bdateChange(item) {
      console.log(item);
    },
    editItem(item) {
      this.editedIndex = this.brgyproperties.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.brgyproperties.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.brgyproperties.splice(this.editedIndex, 1);
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

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        axios
          .post(`${this.api}/brgyproperties/dispose`, this.editedItem)
          .then((res) => {
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
      if (this.editedIndex > -1) {
        Object.assign(this.brgyproperties[this.editedIndex], this.editedItem);
        console.log("update");
        axios
          .post(`${this.api}/brgyproperties/update`, this.editedItem)
          .then((res) => {
            console.log(res.data);
          });
      } else {
        console.log("new", this.editedItem);
        axios
          .post(`${this.api}/brgyproperties/insert`, this.editedItem)
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