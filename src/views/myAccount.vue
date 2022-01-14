<template>
  <div>
    <template>
      <v-toolbar flat>
        <v-toolbar-title>Accounts</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      readonly
                      v-model="editedItem.name"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      readonly
                      v-model="editedItem.address"
                      label="Address"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      readonly
                      v-model="editedItem.bplace"
                      label="Birthplace"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      readonly
                      v-model="editedItem.bdate"
                      label="Birthdate"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4"> </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-radio-group
                      readonly
                      label="Gender"
                      v-model="editedItem.gender"
                    >
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
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="">
          <v-card>
            <v-card-title class="text-h5">Credentials</v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <a-input
                    readonly
                    ref="userNameInput"
                    v-model="credential.userName"
                    placeholder="Username"
                  >
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </v-col>
                <v-col>
                  <a-input-password
                    readonly
                    v-model="credential.password"
                    placeholder="input password"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    readonly
                    v-model="credential.position"
                    :items="positions"
                    label="Position"
                    item-text="name"
                    item-value="id"
                    outlined
                    dense
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-checkbox
                    readonly
                    v-model="credential.isAdmin"
                    :label="`Has Admin Previlages`"
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <v-checkbox
                    readonly
                    v-model="credential.active"
                    :label="`Active`"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="saveCredential"
                >Save</v-btn
              > -->
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
<script>
import axios from "axios";
// import moment from "moment";
export default {
  name: "Accounts",
  data: () => ({
    showprint: false,
    print: false,
    dialog: false,
    credentialsDialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Address", value: "address" },
      { text: "Birthdate", value: "bdate" },
      { text: "Birthplace", value: "bplace" },
      { text: "Gender", value: "gender" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    userdetails: [],
    credential: {
      userName: "",
      password: "",
      position: 0,
      isAdmin: 0,
      active: 1,
    },
    credentialStat: 0,
    editedIndex: -1,
    editedItem: {
      name: "",
      address: "",
      bdate: 0,
      bplace: 0,
      gender: 0,
    },
    defaultItem: {
      name: "",
      address: "",
      bdate: 0,
      bplace: 0,
      gender: 0,
    },
    positions: [
      { id: 1, name: "Captain" },
      { id: 2, name: "Vice Captain" },
      { id: 3, name: "Kagawad" },
      { id: 4, name: "Staff" },
      { id: 5, name: "Staff" },
    ],
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
      if (this.userInfo.uid) {
        let cred = this.userInfo;
        this.editedItem = this.userInfo.details;
        this.credential = cred;
      } else {
        this.credential = {
          userName: "",
          password: "",
          position: 0,
          isAdmin: 0,
          active: 1,
        };
        this.editedItem = {
          name: "",
          address: "",
          bdate: 0,
          bplace: 0,
          gender: 0,
        };
      }
    },
    printItem(item) {
      window.open(
        "https://www.google.com/maps/place/1515+Camia,+Santa+Cruz,+Cavite+City,+Cavite/@14.4727694,120.8924489,43m/data=!3m1!1e3!4m13!1m7!3m6!1s0x339632b370205dab:0xcb44d2d9fcb55635!2s22+(Leo),+Santa+Cruz,+Lungsod+ng+Cavite,+Cavite!3b1!8m2!3d14.4729446!4d120.8940304!3m4!1s0x339632b37aaef13d:0xe0e539f0b1c29e01!8m2!3d14.4726966!4d120.8936492"
      );
      this.editedIndex = this.userdetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.print = true;
    },

    editItem(item) {
      this.editedIndex = this.userdetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.userdetails.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    credentialsEdit(item) {
      this.editedIndex = this.userdetails.indexOf(item);

      axios.get(`${this.api}/users/${item.uid}`).then((res) => {
        let data = res.data;
        if (data.length > 0) {
          this.credential = data[0];
          console.log(this.credential);
          this.credentialStat = 1;
        } else {
          this.credential = {
            uid: item.uid,
            userName: "",
            password: "",
            position: 0,
            isAdmin: 0,
            active: 1,
          };
          this.credentialStat = 0;
        }
        this.credentialsDialog = true;
      });
    },
    deleteItemConfirm() {
      this.userdetails.splice(this.editedIndex, 1);
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
          .post(`${this.api}/userdetails/delete`, this.editedItem)
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
        Object.assign(this.userdetails[this.editedIndex], this.editedItem);
        console.log("update");
        axios
          .post(`${this.api}/userdetails/update`, this.editedItem)
          .then((res) => {
            console.log(res.data);
          });
      } else {
        console.log("new", this.editedItem);
        axios
          .post(`${this.api}/userdetails/insert`, this.editedItem)
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
    saveCredential() {
      if (this.credentialStat == 1) {
        console.log("update");
        axios.post(`${this.api}/users/update`, this.credential).then((res) => {
          console.log(res.data);
        });
      } else {
        console.log("insert", this.credential);
        axios
          .post(`${this.api}/users/insert`, this.credential)
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