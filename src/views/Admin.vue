<template>
  <v-container>
    <h1>Legg til spiller</h1>
    <v-text-field
      v-model="passord"
      type="password"
      label="Passord"
    ></v-text-field>
    <v-text-field v-model="navn" label="Navn"></v-text-field>
    <v-btn block @click="add()">Legg til</v-btn>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      passord: "",
      navn: ""
    };
  },
  methods: {
    add() {
      let vm = this;
      axios
        .post("/admin.php", {
          passord: this.passord,
          modus: "add",
          navn: this.navn
        })
        .then(() => {
          vm.navn = "";
        });
    }
  }
};
</script>
