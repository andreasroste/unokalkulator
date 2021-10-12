<template>
  <v-container>
    <v-btn
      absolute
      right
      fab
      dark
      icon
      color="primary"
      @click="ny_dialog = true"
      ><v-icon>mdi-account-plus</v-icon></v-btn
    >
    <h1>Fortell meg...</h1>
    Hvem skal være med?
    <v-simple-table>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Deltagelse</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(spiller, id) in registrerte_spillere" :key="id">
          <td>{{ spiller }}</td>
          <td v-if="!spillende_keys.includes(id)">
            <v-btn @click="leggTilSpiller(spiller, id)" small color="accent"
              ><v-icon small left>mdi-plus</v-icon>Legg til</v-btn
            >
          </td>
          <td v-if="spillende_keys.includes(id)">
            <v-btn @click="fjernSpiller(spiller, id)" small color="secondary"
              ><v-icon small left>mdi-minus</v-icon>Fjern</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <v-btn color="primary" block style="margin-top: 20px" @click="startSpillet"
      >Begynn spillet</v-btn
    >

    <v-dialog v-model="ny_dialog" scrollable>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Legge inn ny spiller</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="ny_dialog = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text style="padding-top: 20px;">
          <v-text-field
            v-model="ny_navn"
            label="Navn på spilleren"
          ></v-text-field>
          <v-checkbox label="Reglene for UNO er lest og forstått"></v-checkbox>
          <v-btn
            color="secondary"
            block
            href="https://docs.google.com/document/d/1xCRAahDAeSWZ9jZteKSjhIDmXHRHkmAAckj7r0vjez4"
            >De offisielle reglene for UNO</v-btn
          >
          <v-btn
            color="primary"
            block
            style="margin-top: 20px;"
            @click="nySpiller()"
            >Legg til</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-overlay absolute :value="overlay">
      <h1>Laster inn...</h1>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      registrerte_spillere: [],
      spillende_keys: [],
      spillende: [],
      overlay: true,
      ny_dialog: false,
      ny_navn: ""
    };
  },
  mounted() {
    let vm = this;
    axios
      .get("/spillere.json?" + new Date().getTime())
      .then(e => {
        vm.registrerte_spillere = Object.values(e.data);
      })
      .then(() => {
        vm.overlay = false;
      });
  },
  methods: {
    startSpillet() {
      localStorage.setItem("spillere", JSON.stringify(this.spillende));
      localStorage.setItem(
        "spillere_keys",
        JSON.stringify(this.spillende_keys)
      );
      localStorage.setItem("runder", "[]");
      this.$router.push("/spill");
    },
    leggTilSpiller(spiller, id) {
      this.spillende.push(spiller);
      this.spillende_keys.push(id);
    },
    fjernSpiller(spiller, id) {
      this.spillende = this.spillende.filter(item => {
        return item !== spiller;
      });

      this.spillende_keys = this.spillende_keys.filter(item => {
        return item !== id;
      });
    },
    nySpiller() {
      let vm = this;

      axios
        .post("/admin.php", {
          mode: "add",
          navn: this.ny_navn
        })
        .then(() => {
          vm.ny_dialog = false;
          vm.ny_navn = false;
          axios
            .get("/spillere.json?" + new Date().getTime())
            .then(e => {
              vm.registrerte_spillere = Object.values(e.data);
            })
            .then(() => {
              vm.overlay = false;
            });
        });
    }
  }
};
</script>
