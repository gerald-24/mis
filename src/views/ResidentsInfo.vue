<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="residents"
      sort-by="calories"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Residents Info</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            v-model="search"
            label="Search (UPPER CASE ONLY)"
            class="mx-4"
          ></v-text-field
          ><v-spacer></v-spacer>
          <v-dialog v-model="print" max-width="500px">
            <v-card>
              <div id="toPrint" hidden>
                <v-card-title>
                  <span class="text-h5">Residents Info</span>
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
                        v-model="editedItem.fname"
                        label="First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.mname"
                        label="Middle Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.lname"
                        label="Last Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.suffix"
                        label="Suffix"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.address"
                        label="Address"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.bplace"
                        label="Birthplace"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
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
                            v-model="editedItem.bdate"
                            label="BirthDate"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.bdate"
                          @input="menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4"> </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-radio-group label="Gender" v-model="editedItem.gender">
                        <v-radio
                          v-for="n in [
                            { id: 1, gender: 'male' },
                            { id: 2, gender: 'female' },
                          ]"
                          :key="n.id"
                          :label="`${n.gender}`"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="editedItem.email"
                        label="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="Phone"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.mapaddress"
                        label="Map Address"
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
import moment from "moment";
export default {
  name: "ResidentsInfo",
  data: () => ({
    search: "",
    showprint: false,
    print: false,
    dialog: false,
    menu2: false,
    credentialsDialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "First Name",
        align: "start",
        sortable: false,
        value: "fname",
      },
      { text: "Middle Name", value: "mname" },
      { text: "Last Name", value: "lname" },
      { text: "Suffix", value: "suffix" },
      { text: "Address", value: "address" },
      { text: "Birthdate", value: "bdate" },
      { text: "Birthplace", value: "bplace" },
      { text: "Gender", value: "gender" },
      { text: "E-mail", value: "email" },
      { text: "Phone", value: "phone" },
      { text: "MapAddress", value: "mapaddress" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    residents: [],
    editedIndex: -1,
    editedItem: {
      fname: "",
      mname: "",
      lname: "",
      suffix: "",
      address: "",
      bdate: "",
      bplace: "",
      gender: 0,
      email: "",
      phone: "",
      mapaddress: "",
    },
    defaultItem: {
      fname: "",
      mname: "",
      lname: "",
      suffix: "",
      address: "",
      bdate: "",
      bplace: "",
      gender: 0,
      email: "",
      phone: "",
      mapaddress: "",
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
      axios.get(`${this.api}/residents`).then((res) => {
        let data = res.data;
        this.residents = data.map((r) => {
          let update = moment(r.bdate).format("YYYY-MM-DD");
          r.bdate = update;
          return r;
        });
      });
    },
    openMap(mapaddress) {
      window.open(mapaddress);
    },
    printItem(item) {
      window.open(
        "https://www.google.com/maps/place/1515+Camia,+Santa+Cruz,+Cavite+City,+Cavite/@14.4727694,120.8924489,43m/data=!3m1!1e3!4m13!1m7!3m6!1s0x339632b370205dab:0xcb44d2d9fcb55635!2s22+(Leo),+Santa+Cruz,+Lungsod+ng+Cavite,+Cavite!3b1!8m2!3d14.4729446!4d120.8940304!3m4!1s0x339632b37aaef13d:0xe0e539f0b1c29e01!8m2!3d14.4726966!4d120.8936492"
      );
      this.editedIndex = this.residents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.print = true;
    },
    bdateChange(item) {
      console.log(item);
    },
    editItem(item) {
      this.editedIndex = this.residents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.residents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.residents.splice(this.editedIndex, 1);
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
          .post(`${this.api}/residents/delete`, this.editedItem)
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
        Object.assign(this.residents[this.editedIndex], this.editedItem);
        console.log("update");
        axios
          .post(`${this.api}/residents/update`, this.editedItem)
          .then((res) => {
            console.log(res.data);
          });
      } else {
        console.log("new", this.editedItem);
        axios
          .post(`${this.api}/residents/insert`, this.editedItem)
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