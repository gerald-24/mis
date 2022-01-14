<template>
  <v-container fluid fill-height class="pa-0 text-center">
    <v-row align="center" justify="space-around" class="ma-0">
      <a-card
        :bordered="false"
        style="width: 300px"
        id="backgroundcardtransparent"
        @keyup.enter="blnSignUp ? mSubmit() : mLogin()"
      >
        <v-img
          slot="title"
          class="pa-0"
          transition="scroll-y-reverse-transition"
          height="50"
          contain
        ></v-img>

        <v-fab-transition hide-on-leave>
          <div v-show="!blnSignUp">
            <a-input
              id="backgroundcardtransparent"
              ref="username"
              auto-focus
              placeholder="Username"
              v-model="username"
            >
              <a-tooltip slot="prefix" title="Input Username">
                <a-icon type="user" />
              </a-tooltip>
            </a-input>
            <a-input
              id="backgroundcardtransparent"
              ref="strPassword"
              class="mt-2"
              placeholder="Password"
              :type="blnshowpassword ? 'text' : 'password'"
              v-model="strPassword"
            >
              <a-tooltip slot="prefix" title="Input Password">
                <a-icon type="key" />
              </a-tooltip>
              <a-tooltip
                slot="suffix"
                :title="blnshowpassword ? 'Hide Password' : 'Show Password'"
              >
                <a-icon
                  :type="blnshowpassword ? 'eye' : 'eye-invisible'"
                  @click="blnshowpassword = !blnshowpassword"
                />
              </a-tooltip>
            </a-input>
            <a-button
              id="backgroundcardtransparent"
              class="mt-3"
              icon="login"
              style="color: blue"
              block
              @click="mLogin()"
              >Login</a-button
            >
          </div>
        </v-fab-transition>
      </a-card>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      blnSignUp: false,
      blnshowpassword: false,
      username: "",
      strPassword: "",
      strConfirmPassword: "",
      objsignup: {},
      objduplicateUser: [],
    };
  },
  methods: {
    mLogin() {
      let error = false;
      if (this.username == "") {
        this.$refs.username.focus();
        this.$notification.error({
          message: "Management Information System",
          description: "Please input username.",
        });
        error = true;
        return;
      }
      if (this.strPassword == "") {
        this.$refs.strPassword.focus();
        this.$notification.error({
          message: "Management Information System",
          description: "Please input password.",
        });
        error = true;
        return;
      }
      if (error == false) {
        axios.get(`${this.api}/users/log/${this.username}`).then((res) => {
          let userdata = res.data;
          console.log("userdata", userdata);
          if (userdata.length == 0) {
            this.$notification.error({
              message: "Management Information System",
              description: "Invalid user !",
            });
            this.$refs.username.focus();
          } else {
            let getuser = userdata.find(
              (data) => data.password == this.strPassword
            );
            if (getuser != undefined) {
              if (getuser.Approved == false) {
                this.$notification.error({
                  message: "Management Information System",
                  description: "Account not yet approve by system admin.",
                });
              } else {
                this.$notification.success({
                  message: "Management Information System",
                  description: "Login successful.",
                });

                axios
                  .get(`${this.api}/userdetails/${getuser.uid}`)
                  .then((res) => {
                    let data = res.data;
                    let userdetails = data.map((r) => {
                      let update = moment(r.bdate).format("YYYY-MM-DD");
                      r.bdate = update;
                      return r;
                    });

                    let toSaveuser = getuser;
                    toSaveuser.details = userdetails[0];
                    delete toSaveuser.password;
                    this.CHANGE_userInfo(toSaveuser);
                    this.$router.push("/");
                  });
              }
            } else {
              this.$notification.error({
                message: "Management Information System",
                description: "Invalid password !",
              });
            }
          }
        });
      }
    },
    mSignUp() {
      this.blnSignUp = !this.blnSignUp;
      this.objsignup = {};
      this.username = "";
      this.strPassword = "";
      this.strConfirmPassword = "";
      this.blnshowpassword = false;
    },
    mSubmit() {
      let error = false;
      if (
        this.objsignup.EmployeeCode == undefined ||
        this.objsignup.EmployeeCode == ""
      ) {
        this.$refs.refEmployeeCode.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input Username.",
        });
        error = true;
        return;
      }
      if (error == false) {
        axios
          .get(`${this.api}/Check_User/${this.objsignup.EmployeeCode}`)
          .then((res) => {
            this.objduplicateUser = res.data;
          });
      }

      if (this.objduplicateUser.length != 0) {
        this.$refs.refEmployeeCode.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Username already exist.",
        });
        error = true;
        return;
      }
      if (
        this.objsignup.EmployeeName == undefined ||
        this.objsignup.EmployeeName == ""
      ) {
        this.$refs.refEmployeeName.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input employee Name.",
        });
        error = true;
        return;
      }
      if (
        this.objsignup.Password == undefined ||
        this.objsignup.Password == ""
      ) {
        this.$refs.refEmployeePass.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input password.",
        });
        error = true;
        return;
      }
      if (this.strConfirmPassword == "") {
        this.$refs.refEmployeeCPass.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input confirm password.",
        });
        error = true;
        return;
      }
      if (this.strConfirmPassword != this.objsignup.Password) {
        this.$refs.refEmployeeCPass.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Confirm password not equal to given password.",
        });
        error = true;
        return;
      }

      if (error == false) {
        this.objsignup.Approved = 0;
        axios.post(`${this.api}/M_Users_Insert`, this.objsignup).then((res) => {
          if (this.objsignup.EmployeeCode == res.data.EmployeeCode) {
            this.$notification.success({
              message: "Personal System",
              description:
                "Submit successful .Please wait system admin approve your request.",
            });
            this.blnSignUp = false;
          } else {
            this.$notification.error({
              message: "Personal System",
              description: "Submit error please try again.",
            });
          }
        });
      }
    },
  },
};
</script>
<style>
</style>